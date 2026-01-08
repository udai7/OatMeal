import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCoinBalance } from "@/lib/actions/coin.actions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("No userId found in auth");
      return NextResponse.json(
        { error: "Unauthorized", balance: 0 },
        { status: 401 }
      );
    }

    console.log("Fetching coin balance for user:", userId);
    const balance = await getCoinBalance(userId);
    console.log("Coin balance fetched:", balance);

    return NextResponse.json({ balance });
  } catch (error: any) {
    console.error("Error fetching coin balance:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch coin balance", balance: 0 },
      { status: 500 }
    );
  }
}
