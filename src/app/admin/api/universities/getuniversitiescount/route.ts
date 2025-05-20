
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Fetch count of total universities from the universities table
    const [result] = await db.query(
      "SELECT COUNT(*) AS totalUniversitiesCount FROM universities"
    );

    const totalUniversitiesCount = result[0].totalUniversitiesCount;

    // Return the count of total universities
    return NextResponse.json({
      totalUniversitiesCount,
      message: "Total universities count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching total universities count:", error);
    return NextResponse.json(
      { error: "Failed to fetch total universities count" },
      { status: 500 }
    );
  }
}
