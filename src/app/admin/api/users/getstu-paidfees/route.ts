
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Fetch count of students who have paid the fees
    const [result] = await db.query(
      "SELECT COUNT(*) AS paidFeesCount FROM users WHERE payment_status = 1"
    );

    const paidFeesCount = result[0].paidFeesCount;

    // Return the number of students who have paid the fees
    return NextResponse.json({
      paidFeesCount,
      message: "Paid fees count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching paid fees count:", error);
    return NextResponse.json(
      { error: "Failed to fetch paid fees count" },
      { status: 500 }
    );
  }
}
