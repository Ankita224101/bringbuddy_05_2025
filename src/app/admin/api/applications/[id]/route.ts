import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update an application status by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;
    const { id } = params;

    console.log("Updating application status for ID:", id, "to status:", status);
    

    // Validate input
    if (!status) {
      return NextResponse.json(
        { error: "Application status is required" },
        { status: 400 }
      );
    }

    // Check if status is valid
    const validStatuses = ["submitted", "pending", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid application status" },
        { status: 400 }
      );
    }

    // Update application status in database
    // Set application_submitted to 1 if completed, 0 if pending
    if (status === "submitted") {
      await db.query(
        "UPDATE users SET  application_submitted = 1 WHERE id = ?",
        [id]
      );
    } else if (status === "pending") {
      await db.query(
        "UPDATE users SET  application_submitted = 0 WHERE id = ?",
        [id]
      );
    } else {
      // For rejected status, keep the application_submitted value but update status
      await db.query(
        "UPDATE users SET application_submitted = ? WHERE id = ?",
        [0, id]
      );
    }

    return NextResponse.json({
      message: "Application status updated successfully",
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}

// GET: Get a single application by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get application details
    const [user] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (!user || (Array.isArray(user) && user.length === 0)) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Application fetched successfully",
      application: user[0],
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
} 