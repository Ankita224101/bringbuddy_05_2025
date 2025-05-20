import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {


    const body = await req.json();

    
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

    const validatedEntryType = entry_type !== undefined ? Number(entry_type) : 0;
    if (![0, 1].includes(validatedEntryType)) {
      return NextResponse.json(
        { error: "Invalid entry_type. Must be 0 (manual) or 1 (automated)" },
        { status: 400 }
      );
    }
  
    await db.query(
      `INSERT INTO universities 
      (
        name, program_id, university_country_id, location, campus, fees, annual_fees, description, entry_type
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
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
      ]
    );

    return NextResponse.json({
      message: "University added successfully",
      university: { name, program_id, entry_type: validatedEntryType },
    });
  } catch (error) {
    console.error("Error adding university:", error);
    return NextResponse.json(
      { error: "Failed to add university" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const [universities] = await db.query("SELECT * FROM universities");

    return NextResponse.json({
      message: "Universities fetched successfully",
      universities,
    });
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing university
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    const {
      id,
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
    
    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "University ID is required" },
        { status: 400 }
      );
    }
    
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
      university: { id, name, program_id, entry_type: validatedEntryType }
    });
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Failed to update university" },
      { status: 500 }
    );
  }
}
