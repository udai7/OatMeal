import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deductCoins } from "@/lib/actions/coin.actions";
import { COIN_COSTS, type CoinFeature } from "@/lib/constants/coins";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { feature } = body as { feature: CoinFeature };

    if (!feature || !COIN_COSTS[feature]) {
      return NextResponse.json({ error: "Invalid feature" }, { status: 400 });
    }

    const result = await deductCoins(userId, feature);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || "Insufficient coins",
          balance: result.balance,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      balance: result.balance,
      message: result.message,
    });
  } catch (error) {
    console.error("Error deducting coins:", error);
    return NextResponse.json(
      { error: "Failed to deduct coins" },
      { status: 500 }
    );
  }
}
