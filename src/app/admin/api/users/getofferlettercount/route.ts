

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Fetch count of students who have generated an offer letter
    const [result] = await db.query(
      "SELECT COUNT(*) AS offerLetterCount FROM users WHERE offer_letter_status = 1"
    );

    const offerLetterCount = result[0].offerLetterCount;

    // Return the number of students who have generated an offer letter
    return NextResponse.json({
      offerLetterCount,
      message: "Offer letter count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching offer letter count:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer letter count" },
      { status: 500 }
    );
  }
}



