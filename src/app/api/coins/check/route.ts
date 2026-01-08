import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkCoinAvailability } from "@/lib/actions/coin.actions";
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

    const result = await checkCoinAvailability(userId, feature);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking coin availability:", error);
    return NextResponse.json(
      { error: "Failed to check coin availability" },
      { status: 500 }
    );
  }
}
