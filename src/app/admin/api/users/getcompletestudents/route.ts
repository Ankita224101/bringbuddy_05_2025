
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Query to get users who have submitted applications, paid fees, and generated offer letter
    const students = await db.query(
      `SELECT id, name, email, application_submitted, payment_status, offer_letter_status 
       FROM users 
       WHERE application_submitted = 1 
         AND payment_status = 1 
         AND offer_letter_status = 1`
    );

    // Count of such students
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS completedStudentsCount 
       FROM users 
       WHERE application_submitted = 1 
         AND payment_status = 1 
         AND offer_letter_status = 1`
    );

    const completedStudentsCount = countResult[0].completedStudentsCount;

    return NextResponse.json({
      completedStudentsCount,
      students,
      message: "Students who completed all steps fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching completed students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students who completed all steps" },
      { status: 500 }
    );
  }
}
