# Coin System Migration Guide

This guide shows how to update existing features to use the server-side coin system.

## Overview

The old system used localStorage (client-side) which could be manipulated. The new system:
- Stores coins in MongoDB (server-side)
- First-time users get 5 coins
- Coins reset daily at midnight
- Resume AI: 3 coins
- ATS Check: 1 coin
- Cover Letter: 1 coin

## Updated Files

### Core System Files Created:
1. `src/lib/models/coin.model.ts` - Coin database model
2. `src/lib/actions/coin.actions.ts` - Server-side coin management
3. `src/lib/hooks/useCoinDeduction.ts` - Client-side hook for coin deduction
4. `src/app/api/coins/balance/route.ts` - API to get balance
5. `src/app/api/coins/deduct/route.ts` - API to deduct coins
6. `src/app/api/coins/check/route.ts` - API to check availability

### Updated Files:
1. `src/lib/context/AITrialsContext.tsx` - Now fetches from server
2. `src/components/common/AITrialsCounter.tsx` - Displays server-side balance

## How to Update Your Feature Pages

### Old Code Pattern (Client-Side):
```typescript
const { useFeatureTrialIfAvailable, isFeatureTrialExhausted } = useAITrials();

// Check coins
if (isFeatureTrialExhausted("ats_check")) {
  toast({ title: "No Coins Left", variant: "destructive" });
  return;
}

// Deduct coin (client-side only - can be manipulated!)
const coinUsed = useFeatureTrialIfAvailable("ats_check");
if (!coinUsed) {
  toast({ title: "No Coins Left", variant: "destructive" });
  return;
}

// Proceed with feature...
```

### New Code Pattern (Server-Side):
```typescript
import { useCoinDeduction } from "@/lib/hooks/useCoinDeduction";

const { deductCoins } = useCoinDeduction();
const { hasEnoughCoins } = useAITrials();

// Check if user has enough coins (client-side check for UX)
if (!hasEnoughCoins("ats_check")) {
  toast({
    title: "No Coins Left",
    description: "Come back tomorrow for more coins!",
    variant: "destructive",
  });
  return;
}

// Deduct coins on server (secure!)
const success = await deductCoins({
  feature: "ats_check",
  onSuccess: () => {
    console.log("Coins deducted successfully");
  },
  onError: (message) => {
    console.error("Failed to deduct coins:", message);
  },
});

if (!success) {
  return; // Hook already shows error toast
}

// Proceed with feature...
```

## Example: Updating ATS Test Page

Replace lines 118-143 in `src/app/(root)/ats-test/page.tsx`:

### OLD CODE:
```typescript
// Check if coins are available
if (isFeatureTrialExhausted("ats_check")) {
  toast({
    title: "No Coins Left",
    description: "You've used your daily ATS analysis coin. Come back tomorrow!",
    variant: "destructive",
  });
  return;
}

// Deduct one coin
const coinUsed = useFeatureTrialIfAvailable("ats_check");
if (!coinUsed) {
  toast({
    title: "No Coins Left",
    description: "You've used your daily ATS analysis coin. Come back tomorrow!",
    variant: "destructive",
  });
  return;
}

setIsLoading(true);
```

### NEW CODE:
```typescript
// Check if user has enough coins (client-side check for UX)
if (!hasEnoughCoins("ats_check")) {
  toast({
    title: "No Coins Left",
    description: "You've used your daily ATS analysis coin. Come back tomorrow!",
    variant: "destructive",
  });
  return;
}

setIsLoading(true);

// Deduct coins on server (secure!)
const success = await deductCoins({
  feature: "ats_check",
  onError: () => {
    setIsLoading(false);
  },
});

if (!success) {
  return; // Hook already shows error toast
}
```

### Update imports at the top:
```typescript
// OLD imports:
import { useAITrials } from "@/lib/context/AITrialsContext";
const {
  getTrialsRemaining,
  useFeatureTrialIfAvailable,
  isFeatureTrialExhausted,
} = useAITrials();

// NEW imports:
import { useAITrials } from "@/lib/context/AITrialsContext";
import { useCoinDeduction } from "@/lib/hooks/useCoinDeduction";

const { hasEnoughCoins } = useAITrials();
const { deductCoins } = useCoinDeduction();
```

## Files That Need Updating

Apply similar changes to:
1.  `src/app/(root)/ats-test/page.tsx` (shown above)
2. `src/app/(root)/cover-letter/page.tsx`
3. `src/components/layout/my-resume/forms/EducationForm.tsx`
4. `src/components/layout/my-resume/forms/ExperienceForm.tsx`
5. `src/components/layout/my-resume/forms/SummaryForm.tsx`

## Testing

1. Sign in as a new user - should get 5 coins
2. Use features and watch coins deduct
3. Try using features without enough coins - should be blocked
4. Wait until next day (or manually update DB) - coins should reset to 5
5. Try manipulating client state - should not affect server validation

## Benefits

 Secure - coins stored server-side
 Daily reset at midnight
 First-time users get 5 coins automatically
 Atomic operations prevent race conditions
 Optimistic UI updates for better UX
 Automatic balance refresh after operations
