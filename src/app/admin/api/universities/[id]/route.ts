import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Get a single university by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get university by ID
    const [university] = await db.query(
      "SELECT * FROM universities WHERE id = ?",
      [id]
    );

    if (!university || (Array.isArray(university) && university.length === 0)) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "University fetched successfully",
      university: university[0],
    });
  } catch (error) {
    console.error("Error fetching university:", error);
    return NextResponse.json(
      { error: "Failed to fetch university" },
      { status: 500 }
    );
  }
}

// PUT: Update a university by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { id } = params;

    const {
      name,
      program_id,
      university_country_id,
      location,
      campus,
      fees,
      annual_fees,
      description,
      entry_type,
    } = body;

    // Validate entry_type
    const validatedEntryType = entry_type !== undefined ? Number(entry_type) : 0;
    if (![0, 1].includes(validatedEntryType)) {
      return NextResponse.json(
        { error: "Invalid entry_type. Must be 0 (manual) or 1 (automated)" },
        { status: 400 }
      );
    }

    // Check if university exists
    const [existingUniversity] = await db.query(
      "SELECT * FROM universities WHERE id = ?",
      [id]
    );

    if (!existingUniversity || (Array.isArray(existingUniversity) && existingUniversity.length === 0)) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Update university
    await db.query(
      `UPDATE universities 
      SET name = ?, program_id = ?, university_country_id = ?, 
          location = ?, campus = ?, fees = ?, annual_fees = ?, 
          description = ?, entry_type = ? 
      WHERE id = ?`,
      [
        name,
        program_id,
        university_country_id,
        location,
        campus,
        fees,
        annual_fees,
        description,
        validatedEntryType,
        id
      ]
    );

    return NextResponse.json({
      message: "University updated successfully",
      university: { id, name, entry_type: validatedEntryType }
    });
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Failed to update university" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a university by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if university exists
    const [existingUniversity] = await db.query(
      "SELECT * FROM universities WHERE id = ?",
      [id]
    );

    if (!existingUniversity || (Array.isArray(existingUniversity) && existingUniversity.length === 0)) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Delete university
    await db.query("DELETE FROM universities WHERE id = ?", [id]);

    return NextResponse.json({
      message: "University deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      { error: "Failed to delete university" },
      { status: 500 }
    );
  }
} 