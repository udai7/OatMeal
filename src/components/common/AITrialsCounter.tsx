"use client";

import React from "react";
import { useAITrials, TrialFeature } from "@/lib/context/AITrialsContext";
import { Coins } from "lucide-react";

interface AITrialsCounterProps {
  feature?: TrialFeature;
  variant?: "badge" | "minimal";
}

const AITrialsCounter = ({
  feature = "resume_ai",
  variant = "badge",
}: AITrialsCounterProps) => {
  const { trialsRemaining, getTrialsRemaining } = useAITrials();

  const coins =
    feature === "resume_ai" ? trialsRemaining : getTrialsRemaining(feature);

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-1.5">
        <Coins className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-medium text-white">{coins}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg">
      <Coins className="h-4 w-4 text-blue-400" />
      <span className="text-xs sm:text-sm font-medium text-white">
        {coins}{" "}
        <span className="text-white/60">{coins === 1 ? "coin" : "coins"}</span>
      </span>
    </div>
  );
};

export default AITrialsCounter;
