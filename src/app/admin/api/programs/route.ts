
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, course_id } = body;
  
      // Validate input
      if (!name || !course_id) {
        return NextResponse.json(
          { error: "Program name and course_id are required." },
          { status: 400 }
        );
      }

      await db.query(
        "INSERT INTO programs (name, course_id) VALUES (?, ?)",
        [name, course_id]
      );
  
      return NextResponse.json({
        message: "Program added successfully",
        program: { name, course_id },
      });
    } catch (error) {
      console.error("Error adding program:", error);
      return NextResponse.json(
        { error: "Failed to add program" },
        { status: 500 }
      );
    }
  }