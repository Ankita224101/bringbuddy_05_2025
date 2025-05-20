import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      id,
      name, 
      email, 
      phone_number, 
      payment_status, 
      application_submitted,
      university_id,
      program_id,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" }, 
        { status: 400 }
      );
    }

    // Fetch the student to update
    const [studentResult] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [parseInt(id.toString())]
    );

    // MySQL returns array-like results
    if (!studentResult || !Array.isArray(studentResult) || studentResult.length === 0) {
      return NextResponse.json(
        { error: "Student not found" }, 
        { status: 404 }
      );
    }

    // Build the update query dynamically
    const updateFields: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      values.push(name);
    }

    if (university_id !== undefined) {
      updateFields.push("university_id = ?");
      values.push(university_id);
    }
    if (program_id !== undefined) {
      updateFields.push("program_id = ?");
      values.push(program_id);
    }

    if (email !== undefined) {
      updateFields.push("email = ?");
      values.push(email);
    }

    if (phone_number !== undefined) {
      updateFields.push("phone_number = ?");
      values.push(phone_number);
    }

    if (payment_status !== undefined) {
      updateFields.push("payment_status = ?");
      values.push(parseInt(payment_status.toString()));
    }

    if (application_submitted !== undefined) {
      updateFields.push("application_submitted = ?");
      values.push(parseInt(application_submitted.toString()));
    }

    // Add ID as the last parameter
    values.push(parseInt(id.toString()));

    // Execute update query if there are fields to update
    if (updateFields.length > 0) {
      const query = `
        UPDATE users 
        SET ${updateFields.join(", ")} 
        WHERE id = ?
      `;

      await db.query(query, values);
      
      // Fetch the updated student
      const [updatedResult] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [parseInt(id.toString())]
      );

      if (updatedResult && Array.isArray(updatedResult) && updatedResult.length > 0) {
        return NextResponse.json({ 
          success: true, 
          message: "Student updated successfully", 
          student: updatedResult[0] 
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "No changes were made",
      student: studentResult[0]
    });
  } catch (error: unknown) {
    console.error("Error updating student:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update student",
        message: errorMessage
      }, 
      { status: 500 }
    );
  }
} 

