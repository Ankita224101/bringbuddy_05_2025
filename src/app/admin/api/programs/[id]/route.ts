import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update a program by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, course_id } = body;
    const { id } = params;

    // Validate input
    if (!name || !course_id) {
      return NextResponse.json(
        { error: "Program name and course_id are required." },
        { status: 400 }
      );
    }

    // Check if program exists
    const [existingProgram] = await db.query(
      "SELECT * FROM programs WHERE id = ?",
      [id]
    );

    if (!existingProgram || (Array.isArray(existingProgram) && existingProgram.length === 0)) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    await db.query(
    "UPDATE programs SET name = ?, course_id = ? WHERE id = ?",
      [name, course_id, id]
    );

    return NextResponse.json({
      message: "Program updated successfully",
      program: { id, name, course_id },
    });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { error: "Failed to update program" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [existingProgram] = await db.query(
      "SELECT * FROM programs WHERE id = ?",
      [id]
    );

    if (!existingProgram || (Array.isArray(existingProgram) && existingProgram.length === 0)) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    await db.query("DELETE FROM programs WHERE id = ?", [id]);

    return NextResponse.json({
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { error: "Failed to delete program" },
      { status: 500 }
    );
  }
}

// GET: Get a single program by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get program by ID
    const [program] = await db.query(
      "SELECT * FROM programs WHERE id = ?",
      [id]
    );

    if (!program || (Array.isArray(program) && program.length === 0)) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Program fetched successfully",
      program,
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 }
    );
  }
} 