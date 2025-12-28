"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

// Feature types for trials
export type TrialFeature = "resume_ai" | "ats_check" | "cover_letter";

// Daily limits for each feature
const DAILY_LIMITS: Record<TrialFeature, number> = {
  resume_ai: 3,
  ats_check: 1,
  cover_letter: 1,
};

interface AITrialsContextType {
  // Resume AI trials (for backward compatibility)
  trialsRemaining: number;
  useTrialIfAvailable: () => boolean;
  isTrialExhausted: boolean;
  // Generic feature trials
  getTrialsRemaining: (feature: TrialFeature) => number;
  useFeatureTrialIfAvailable: (feature: TrialFeature) => boolean;
  isFeatureTrialExhausted: (feature: TrialFeature) => boolean;
}

const AITrialsContext = createContext<AITrialsContextType | undefined>(
  undefined
);

const STORAGE_KEY = "ai_trials_data_v2";

interface TrialData {
  date: string;
  trialsUsed: Record<TrialFeature, number>;
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getDefaultTrialsUsed(): Record<TrialFeature, number> {
  return {
    resume_ai: 0,
    ats_check: 0,
    cover_letter: 0,
  };
}

// Initialize from localStorage synchronously to prevent flash of wrong data
function getInitialTrialsUsed(): Record<TrialFeature, number> {
  if (typeof window === "undefined") return getDefaultTrialsUsed();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefaultTrialsUsed();

  try {
    const data = JSON.parse(stored) as TrialData;
    const today = getTodayDateString();

    // Only use stored data if it's from today
    if (data.date === today) {
      return {
        ...getDefaultTrialsUsed(),
        ...data.trialsUsed,
      };
    }
    // If it's a new day, return defaults (will be saved in useEffect)
    return getDefaultTrialsUsed();
  } catch {
    return getDefaultTrialsUsed();
  }
}

function getStoredTrialData(): TrialData | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as TrialData;
  } catch {
    return null;
  }
}

function setStoredTrialData(data: TrialData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function AITrialsProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage immediately to prevent reset
  const [trialsUsed, setTrialsUsed] = useState<Record<TrialFeature, number>>(
    () => getInitialTrialsUsed()
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const trialsUsedRef = useRef(trialsUsed);

  // Keep ref in sync with state
  useEffect(() => {
    trialsUsedRef.current = trialsUsed;
  }, [trialsUsed]);

  // Handle new day reset and ensure localStorage is in sync
  useEffect(() => {
    const storedData = getStoredTrialData();
    const today = getTodayDateString();

    if (storedData && storedData.date === today) {
      // Data is from today - ensure state matches localStorage
      const mergedTrialsUsed = {
        ...getDefaultTrialsUsed(),
        ...storedData.trialsUsed,
      };
      setTrialsUsed(mergedTrialsUsed);
      trialsUsedRef.current = mergedTrialsUsed;
    } else {
      // It's a new day or no data - reset and save
      const defaultTrials = getDefaultTrialsUsed();
      setStoredTrialData({ date: today, trialsUsed: defaultTrials });
      setTrialsUsed(defaultTrials);
      trialsUsedRef.current = defaultTrials;
    }
    setIsInitialized(true);
  }, []);

  // Generic function to get remaining trials for a feature
  const getTrialsRemaining = useCallback(
    (feature: TrialFeature): number => {
      return DAILY_LIMITS[feature] - (trialsUsed[feature] || 0);
    },
    [trialsUsed]
  );

  // Generic function to check if feature trials are exhausted
  const isFeatureTrialExhausted = useCallback(
    (feature: TrialFeature): boolean => {
      return getTrialsRemaining(feature) <= 0;
    },
    [getTrialsRemaining]
  );

  // Generic function to use a trial for any feature
  const useFeatureTrialIfAvailable = useCallback(
    (feature: TrialFeature): boolean => {
      const currentTrialsUsed = trialsUsedRef.current;
      const currentUsed = currentTrialsUsed[feature] || 0;
      const remaining = DAILY_LIMITS[feature] - currentUsed;

      if (remaining <= 0) {
        return false;
      }

      const newTrialsUsed = {
        ...currentTrialsUsed,
        [feature]: currentUsed + 1,
      };
      const today = getTodayDateString();

      trialsUsedRef.current = newTrialsUsed;
      setTrialsUsed(newTrialsUsed);
      setStoredTrialData({ date: today, trialsUsed: newTrialsUsed });

      return true;
    },
    []
  );

  // Backward compatibility for resume_ai
  const trialsRemaining = DAILY_LIMITS.resume_ai - (trialsUsed.resume_ai || 0);
  const isTrialExhausted = trialsRemaining <= 0;
  const useTrialIfAvailable = useCallback(
    () => useFeatureTrialIfAvailable("resume_ai"),
    [useFeatureTrialIfAvailable]
  );

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <AITrialsContext.Provider
      value={{
        trialsRemaining,
        useTrialIfAvailable,
        isTrialExhausted,
        getTrialsRemaining,
        useFeatureTrialIfAvailable,
        isFeatureTrialExhausted,
      }}
    >
      {children}
    </AITrialsContext.Provider>
  );
}

export function useAITrials() {
  const context = useContext(AITrialsContext);
  if (context === undefined) {
    throw new Error("useAITrials must be used within an AITrialsProvider");
  }
  return context;
}
