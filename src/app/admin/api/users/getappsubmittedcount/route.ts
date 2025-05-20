
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Fetch count of students who have submitted applications
    const [result] = await db.query(
      "SELECT COUNT(*) AS submittedApplicationsCount FROM users WHERE application_submitted = 1"
    );

    const [students] = await db.query(
      "SELECT * FROM users WHERE application_submitted = 1"
    );

    const submittedApplicationsCount = result[0].submittedApplicationsCount;

    // Return the number of students who have submitted applications
    return NextResponse.json({
      submittedApplicationsCount,
      students,
      message: "Submitted applications count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching submitted applications count:", error);
    return NextResponse.json(
      { error: "Failed to fetch submitted applications count" },
      { status: 500 }
    );
  }
}
