import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS submittedApplicationsCount FROM users WHERE application_submitted = 1"
    );

    const submittedApplicationsCount = countResult[0].submittedApplicationsCount;

    const [students] = await db.query(
      "SELECT * FROM users"
    );

    return NextResponse.json({
      submittedApplicationsCount,
      students,
      message: "Submitted applications data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching submitted applications data:", error);
    return NextResponse.json(
      { error: "Failed to fetch submitted applications data" },
      { status: 500 }
    );
  }
}
