import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {

    const [paidStudents] = await db.query(
      "SELECT * FROM users WHERE payment_status = 1"
    );

    return NextResponse.json({
      paidStudents,
      message: "Paid students data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching paid students:", error);
    return NextResponse.json(
      { error: "Failed to fetch paid students" },
      { status: 500 }
    );
  }
}
