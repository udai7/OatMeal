"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";
import { COIN_COSTS, type CoinFeature } from "@/lib/constants/coins";

// Feature types for trials (aligned with coin system)
export type TrialFeature = CoinFeature;

interface AITrialsContextType {
  // Coin balance
  coinBalance: number;
  isLoading: boolean;
  // Check if user has enough coins for a feature
  hasEnoughCoins: (feature: CoinFeature) => boolean;
  // Deduct coins (should be called from server-side, this is for optimistic UI updates)
  deductCoinsOptimistic: (feature: CoinFeature) => void;
  // Refresh balance from server
  refreshBalance: () => Promise<void>;
  // Legacy API (for backward compatibility)
  trialsRemaining: number;
  useTrialIfAvailable: () => boolean;
  isTrialExhausted: boolean;
  getTrialsRemaining: (feature: CoinFeature) => number;
  useFeatureTrialIfAvailable: (feature: CoinFeature) => boolean;
  isFeatureTrialExhausted: (feature: CoinFeature) => boolean;
}

const AITrialsContext = createContext<AITrialsContextType | undefined>(
  undefined
);

export function AITrialsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [coinBalance, setCoinBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch coin balance from server
  const fetchBalance = useCallback(async () => {
    if (!user?.id) {
      setCoinBalance(0);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/coins/balance");
      if (response.ok) {
        const data = await response.json();
        setCoinBalance(data.balance || 0);
      } else {
        console.error("Failed to fetch coin balance");
        setCoinBalance(0);
      }
    } catch (error) {
      console.error("Error fetching coin balance:", error);
      setCoinBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch balance when user loads or changes
  useEffect(() => {
    if (isLoaded) {
      // Clean up old localStorage coin system
      if (typeof window !== "undefined") {
        localStorage.removeItem("ai_trials_data_v2");
      }
      fetchBalance();
    }
  }, [isLoaded, fetchBalance]);

  // Refresh balance (can be called manually)
  const refreshBalance = useCallback(async () => {
    setIsLoading(true);
    await fetchBalance();
  }, [fetchBalance]);

  // Check if user has enough coins for a feature
  const hasEnoughCoins = useCallback(
    (feature: CoinFeature): boolean => {
      return coinBalance >= COIN_COSTS[feature];
    },
    [coinBalance]
  );

  // Optimistic UI update (actual deduction happens server-side)
  const deductCoinsOptimistic = useCallback((feature: CoinFeature) => {
    setCoinBalance((prev) => Math.max(0, prev - COIN_COSTS[feature]));
  }, []);

  // Legacy API for backward compatibility
  const getTrialsRemaining = useCallback(
    (feature: CoinFeature): number => {
      // Calculate how many times this feature can be used with current balance
      return Math.floor(coinBalance / COIN_COSTS[feature]);
    },
    [coinBalance]
  );

  const isFeatureTrialExhausted = useCallback(
    (feature: CoinFeature): boolean => {
      return !hasEnoughCoins(feature);
    },
    [hasEnoughCoins]
  );

  const useFeatureTrialIfAvailable = useCallback(
    (feature: CoinFeature): boolean => {
      if (!hasEnoughCoins(feature)) {
        return false;
      }
      // Optimistically update UI
      deductCoinsOptimistic(feature);
      return true;
    },
    [hasEnoughCoins, deductCoinsOptimistic]
  );

  // Resume AI specific (backward compatibility)
  const trialsRemaining = getTrialsRemaining("resume_ai");
  const isTrialExhausted = isFeatureTrialExhausted("resume_ai");
  const useTrialIfAvailable = useCallback(
    () => useFeatureTrialIfAvailable("resume_ai"),
    [useFeatureTrialIfAvailable]
  );

  return (
    <AITrialsContext.Provider
      value={{
        coinBalance,
        isLoading,
        hasEnoughCoins,
        deductCoinsOptimistic,
        refreshBalance,
        // Legacy API
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
