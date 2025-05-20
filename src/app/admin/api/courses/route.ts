import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const courseType = formData.get("courseType") as string; 
    const courseTrade = formData.get("courseTrade") as string; 
    const duration = formData.get("duration") as string;

    await db.beginTransaction();

    // Insert into course_types table
    const courseTypeInsert = await db.query(
      "INSERT INTO course_types (name) VALUES (?)",
      [ courseType]
    );


    // Insert into course_trades table
    await db.query(
      "INSERT INTO course_trades (trade, duration) VALUES (?, ?)",[courseTrade, duration]);

    await db.commit();

    return NextResponse.json(
      { message: "Course type and trade created successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Rollback in case of error
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error creating course type and trade", error },
      { status: 500 }
    );
  }
}
