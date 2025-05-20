
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Query to count total countries
    const [result] = await db.query(
      "SELECT COUNT(*) AS totalCountriesCount FROM countries"
    );

    const totalCountriesCount = result[0].totalCountriesCount;

    // Send response
    return NextResponse.json({
      totalCountriesCount,
      message: "Total countries count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching countries count:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries count" },
      { status: 500 }
    );
  }
}
