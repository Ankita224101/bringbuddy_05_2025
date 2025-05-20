
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {


    const [students] = await db.query(
      "SELECT * FROM users"
    );

    return NextResponse.json({
      students,
      message: "students fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to students" }, { status: 500 });
  }
}
