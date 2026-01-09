"use client";

import React from "react";
import { useAITrials } from "@/lib/context/AITrialsContext";
import { Coins } from "lucide-react";

interface AITrialsCounterProps {
  variant?: "badge" | "minimal";
}

const AITrialsCounter = ({
  variant = "badge",
}: AITrialsCounterProps) => {
  const { coinBalance, isLoading } = useAITrials();

  if (isLoading) {
    return (
      <div className={variant === "minimal" ? "flex items-center gap-1.5" : "flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg"}>
        <Coins className="h-4 w-4 text-blue-400 animate-pulse" />
        <span className={variant === "minimal" ? "text-sm font-medium text-white" : "text-xs sm:text-sm font-medium text-white"}>
          ...
        </span>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-1.5">
        <Coins className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-medium text-white">{coinBalance}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg">
      <Coins className="h-4 w-4 text-blue-400" />
      <span className="text-xs sm:text-sm font-medium text-white">
        {coinBalance}{" "}
        <span className="text-white/60">{coinBalance === 1 ? "coin" : "coins"}</span>
      </span>
    </div>
  );
};

export default AITrialsCounter;
