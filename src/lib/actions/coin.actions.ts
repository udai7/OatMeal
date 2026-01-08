"use server";

import { connectToDB } from "../mongoose";
import Coin from "../models/coin.model";
import {
  COIN_COSTS,
  DAILY_COIN_LIMIT,
  type CoinFeature,
} from "../constants/coins";

export type { CoinFeature };

interface CoinBalance {
  balance: number;
  lastResetDate: Date;
}

interface CoinOperationResult {
  success: boolean;
  balance: number;
  message?: string;
}

/**
 * Get the start of the current day (midnight)
 */
function getStartOfDay(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Check if a date needs to be reset (if it''s before today)
 */
function needsReset(lastResetDate: Date): boolean {
  const today = getStartOfDay();
  const lastReset = getStartOfDay(new Date(lastResetDate));
  return lastReset < today;
}

/**
 * Initialize or get user coin balance
 * Creates a new record with 5 coins for first-time users
 */
export async function initializeUserCoins(
  userId: string
): Promise<CoinBalance> {
  try {
    console.log("Connecting to DB for user:", userId);
    await connectToDB();
    console.log("DB connected, finding coin record");

    let coinRecord = await Coin.findOne({ userId });
    console.log("Coin record found:", coinRecord ? "Yes" : "No");

    if (!coinRecord) {
      // First-time user - create with 5 coins
      console.log("Creating new coin record with 5 coins");
      coinRecord = await Coin.create({
        userId,
        balance: DAILY_COIN_LIMIT,
        lastResetDate: getStartOfDay(),
      });
      console.log("New coin record created:", coinRecord);
    } else if (needsReset(coinRecord.lastResetDate)) {
      // Reset coins to 5 for the new day
      console.log("Resetting coins to 5 for new day");
      coinRecord.balance = DAILY_COIN_LIMIT;
      coinRecord.lastResetDate = getStartOfDay();
      await coinRecord.save();
    }

    console.log("Returning balance:", coinRecord.balance);
    return {
      balance: coinRecord.balance,
      lastResetDate: coinRecord.lastResetDate,
    };
  } catch (error: any) {
    console.error("Error initializing user coins:", error);
    console.error("Error details:", error.message);
    throw new Error("Failed to initialize coins: " + error.message);
  }
}

/**
 * Get current coin balance for a user
 */
export async function getCoinBalance(userId: string): Promise<number> {
  try {
    if (!userId || userId === "undefined" || userId === "null") {
      return 0;
    }

    await connectToDB();

    // Initialize or reset if needed
    const { balance } = await initializeUserCoins(userId);
    return balance;
  } catch (error) {
    console.error("Error getting coin balance:", error);
    return 0;
  }
}

/**
 * Check if user has enough coins for a feature
 */
export async function checkCoinAvailability(
  userId: string,
  feature: CoinFeature
): Promise<{ hasEnough: boolean; balance: number; required: number }> {
  try {
    const balance = await getCoinBalance(userId);
    const required = COIN_COSTS[feature];

    return {
      hasEnough: balance >= required,
      balance,
      required,
    };
  } catch (error) {
    console.error("Error checking coin availability:", error);
    return {
      hasEnough: false,
      balance: 0,
      required: COIN_COSTS[feature],
    };
  }
}

/**
 * Deduct coins for a feature usage
 * Returns success status and new balance
 */
export async function deductCoins(
  userId: string,
  feature: CoinFeature
): Promise<CoinOperationResult> {
  try {
    if (!userId || userId === "undefined" || userId === "null") {
      return {
        success: false,
        balance: 0,
        message: "Invalid user ID",
      };
    }

    await connectToDB();

    // Initialize or reset if needed
    await initializeUserCoins(userId);

    const cost = COIN_COSTS[feature];

    // Try to deduct coins atomically
    const updated = await Coin.findOneAndUpdate(
      {
        userId,
        balance: { $gte: cost }, // Only update if balance is sufficient
      },
      {
        $inc: { balance: -cost },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      // Not enough coins
      const current = await Coin.findOne({ userId });
      return {
        success: false,
        balance: current?.balance || 0,
        message: `Insufficient coins. Required: ${cost}, Available: ${
          current?.balance || 0
        }`,
      };
    }

    return {
      success: true,
      balance: updated.balance,
      message: `Successfully deducted ${cost} coin(s)`,
    };
  } catch (error) {
    console.error("Error deducting coins:", error);
    return {
      success: false,
      balance: 0,
      message: "Failed to deduct coins",
    };
  }
}

/**
 * Get detailed coin information including reset time
 */
export async function getCoinInfo(userId: string): Promise<{
  balance: number;
  lastResetDate: Date;
  nextResetDate: Date;
  dailyLimit: number;
}> {
  try {
    const { balance, lastResetDate } = await initializeUserCoins(userId);

    // Calculate next reset (start of next day)
    const nextReset = new Date(lastResetDate);
    nextReset.setDate(nextReset.getDate() + 1);

    return {
      balance,
      lastResetDate,
      nextResetDate: nextReset,
      dailyLimit: DAILY_COIN_LIMIT,
    };
  } catch (error) {
    console.error("Error getting coin info:", error);
    const now = new Date();
    return {
      balance: 0,
      lastResetDate: now,
      nextResetDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      dailyLimit: DAILY_COIN_LIMIT,
    };
  }
}

/**
 * Admin function: Manually add coins to a user (for testing or support)
 */
export async function addCoins(
  userId: string,
  amount: number
): Promise<CoinOperationResult> {
  try {
    await connectToDB();

    await initializeUserCoins(userId);

    const updated = await Coin.findOneAndUpdate(
      { userId },
      {
        $inc: { balance: amount },
        updatedAt: new Date(),
      },
      { new: true }
    );

    return {
      success: true,
      balance: updated?.balance || 0,
      message: `Successfully added ${amount} coin(s)`,
    };
  } catch (error) {
    console.error("Error adding coins:", error);
    return {
      success: false,
      balance: 0,
      message: "Failed to add coins",
    };
  }
}
