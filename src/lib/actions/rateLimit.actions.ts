"use server";

import { connectToDB } from "../mongoose";
import RateLimit from "../models/rateLimit.model";

// Rate limits per feature (per 24 hours)
const RATE_LIMITS = {
  resume_ai: 5,
  cover_letter: 1,
  ats_check: 1,
};

type Feature = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
}

// Helper function to add timeout to promises
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage: string
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([promise, timeout]);
}

export async function checkRateLimit(
  userId: string,
  feature: Feature
): Promise<RateLimitResult> {
  if (!userId) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
      limit: RATE_LIMITS[feature],
    };
  }

  try {
    // Add 5 second timeout for the entire operation
    return await withTimeout(
      checkRateLimitInternal(userId, feature),
      5000,
      "Rate limit check timed out. Please try again."
    );
  } catch (error: any) {
    console.error("Rate limit check error:", error);
    // On timeout or DB error, ALLOW the request (don't block users due to infrastructure issues)
    // Return allowed: true so the user can proceed
    return {
      allowed: true,
      remaining: RATE_LIMITS[feature],
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      limit: RATE_LIMITS[feature],
    };
  }
}

async function checkRateLimitInternal(
  userId: string,
  feature: Feature
): Promise<RateLimitResult> {
  await connectToDB();

  const now = new Date();
  const limit = RATE_LIMITS[feature];
  const defaultResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Find rate limit record
  let rateLimit = await RateLimit.findOne({ userId, feature }).lean();

  if (!rateLimit) {
    // If no record exists, the user hasn't used the feature yet
    return {
      allowed: true,
      remaining: limit,
      resetAt: defaultResetAt,
      limit,
    };
  }

  // Check if reset time has passed (with null safety)
  if (rateLimit && now >= new Date(rateLimit.resetAt)) {
    // Reset the counter using atomic update
    const updated = await RateLimit.findOneAndUpdate(
      { userId, feature },
      {
        count: 0,
        resetAt: defaultResetAt,
      },
      { new: true }
    ).lean();
    if (updated) {
      rateLimit = updated;
    }
  }

  const count = rateLimit?.count ?? 0;
  const remaining = Math.max(0, limit - count);
  const allowed = count < limit;

  return {
    allowed,
    remaining,
    resetAt: rateLimit?.resetAt ? new Date(rateLimit.resetAt) : defaultResetAt,
    limit,
  };
}

export async function incrementRateLimit(
  userId: string,
  feature: Feature
): Promise<RateLimitResult> {
  if (!userId) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(),
      limit: RATE_LIMITS[feature],
    };
  }

  try {
    await connectToDB();

    const now = new Date();
    const limit = RATE_LIMITS[feature];
    const resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // First, check if record exists and if it needs reset
    let rateLimit = await RateLimit.findOne({ userId, feature }).lean();

    if (!rateLimit) {
      // Create new record with count 1 (this is the first use)
      rateLimit = await RateLimit.create({
        userId,
        feature,
        count: 1,
        resetAt,
        createdAt: now,
      });
    } else if (now >= new Date(rateLimit.resetAt)) {
      // Reset expired record - count starts at 1 (this use)
      const updated = await RateLimit.findOneAndUpdate(
        { userId, feature },
        { count: 1, resetAt },
        { new: true }
      ).lean();
      rateLimit = updated || rateLimit;
    } else {
      // Increment existing valid record
      const updated = await RateLimit.findOneAndUpdate(
        { userId, feature },
        { $inc: { count: 1 } },
        { new: true }
      ).lean();
      rateLimit = updated || rateLimit;
    }

    const currentCount = rateLimit?.count || 1;
    const remaining = Math.max(0, limit - currentCount);

    return {
      allowed: currentCount <= limit,
      remaining,
      resetAt: rateLimit?.resetAt ? new Date(rateLimit.resetAt) : resetAt,
      limit,
    };
  } catch (error) {
    console.error("Increment rate limit error:", error);
    // Don't throw - allow the operation to complete
    return {
      allowed: true,
      remaining: RATE_LIMITS[feature],
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      limit: RATE_LIMITS[feature],
    };
  }
}

export async function getRateLimitStatus(
  userId: string,
  feature: Feature
): Promise<RateLimitResult> {
  return checkRateLimit(userId, feature);
}
