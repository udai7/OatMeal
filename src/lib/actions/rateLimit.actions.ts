"use server";

import { connectToDB } from "../mongoose";
import RateLimit from "../models/rateLimit.model";

// Rate limits per feature (per 24 hours)
const RATE_LIMITS = {
  resume_ai: 3,
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

  await connectToDB();

  const now = new Date();
  const limit = RATE_LIMITS[feature];

  // Find or create rate limit record
  let rateLimit = await RateLimit.findOne({ userId, feature });

  if (!rateLimit) {
    // Create new rate limit record
    const resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    rateLimit = await RateLimit.create({
      userId,
      feature,
      count: 0,
      resetAt,
    });
  }

  // Check if reset time has passed
  if (now >= rateLimit.resetAt) {
    // Reset the counter
    rateLimit.count = 0;
    rateLimit.resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    await rateLimit.save();
  }

  const remaining = Math.max(0, limit - rateLimit.count);
  const allowed = rateLimit.count < limit;

  return {
    allowed,
    remaining,
    resetAt: rateLimit.resetAt,
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

  await connectToDB();

  const now = new Date();
  const limit = RATE_LIMITS[feature];

  // Find or create rate limit record
  let rateLimit = await RateLimit.findOne({ userId, feature });

  if (!rateLimit) {
    // Create new rate limit record
    const resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    rateLimit = await RateLimit.create({
      userId,
      feature,
      count: 1,
      resetAt,
    });
  } else {
    // Check if reset time has passed
    if (now >= rateLimit.resetAt) {
      rateLimit.count = 1;
      rateLimit.resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else {
      rateLimit.count += 1;
    }
    await rateLimit.save();
  }

  const remaining = Math.max(0, limit - rateLimit.count);

  return {
    allowed: rateLimit.count <= limit,
    remaining,
    resetAt: rateLimit.resetAt,
    limit,
  };
}

export async function getRateLimitStatus(
  userId: string,
  feature: Feature
): Promise<RateLimitResult> {
  return checkRateLimit(userId, feature);
}
