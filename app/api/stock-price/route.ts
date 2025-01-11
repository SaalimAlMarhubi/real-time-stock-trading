import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://stocks.heat-engineer.dev/api/stocks/heat-engineer/current"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stock price from API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Stock price fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock price" },
      { status: 500 }
    );
  }
}
