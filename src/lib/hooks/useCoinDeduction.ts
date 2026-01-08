import { useCallback } from "react";
import { useAITrials } from "@/lib/context/AITrialsContext";
import { useToast } from "@/components/ui/use-toast";
import { type CoinFeature } from "@/lib/constants/coins";

interface DeductCoinsOptions {
  feature: CoinFeature;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useCoinDeduction() {
  const { deductCoinsOptimistic, refreshBalance, hasEnoughCoins } =
    useAITrials();
  const { toast } = useToast();

  const deductCoins = useCallback(
    async ({
      feature,
      onSuccess,
      onError,
    }: DeductCoinsOptions): Promise<boolean> => {
      // Check if user has enough coins
      if (!hasEnoughCoins(feature)) {
        const message =
          "Insufficient coins. Please wait until tomorrow for coins to reset!";
        toast({
          title: "No Coins Left",
          description: message,
          variant: "destructive",
        });
        onError?.(message);
        return false;
      }

      // Optimistic UI update
      deductCoinsOptimistic(feature);

      try {
        const response = await fetch("/api/coins/deduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feature }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to deduct coins");
        }

        const result = await response.json();

        // Refresh balance to sync with server
        await refreshBalance();

        onSuccess?.();
        return true;
      } catch (error: any) {
        console.error("Error deducting coins:", error);

        // Refresh balance to revert optimistic update
        await refreshBalance();

        const message = error.message || "Failed to deduct coins";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        onError?.(message);
        return false;
      }
    },
    [hasEnoughCoins, deductCoinsOptimistic, refreshBalance, toast]
  );

  return { deductCoins };
}
