import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, phone_number, address, country_id, country_code } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Agent ID is required",
      }, { status: 400 });
    }

    // Build the update query based on provided fields
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (phone_number) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone_number);
    }

    if (address) {
      updateFields.push("address = ?");
      updateValues.push(address);
    }

    if (country_id) {
      updateFields.push("country_id = ?");
      updateValues.push(country_id);
    }

    if (country_code) {
      updateFields.push("country_code = ?");
      updateValues.push(country_code);
    }

    // If no fields to update, return early
    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No fields provided for update",
      }, { status: 400 });
    }

    // Add the agent ID as the last parameter for WHERE clause
    updateValues.push(id);

    // Construct and execute the update query
    const updateQuery = `UPDATE agents SET ${updateFields.join(", ")} WHERE id = ?`;
    const [result] = await db.query<ResultSetHeader>(updateQuery, updateValues);

    if (result && result.affectedRows > 0) {
      // Fetch the updated agent details
      const [updatedAgents] = await db.query<RowDataPacket[]>("SELECT * FROM agents WHERE id = ?", [id]);
      
      if (Array.isArray(updatedAgents) && updatedAgents.length > 0) {
        // Hide sensitive info
        const updatedAgent = updatedAgents[0];
        if (updatedAgent) {
          delete updatedAgent.password;
          delete updatedAgent.otp;
          
          return NextResponse.json({
            success: true,
            message: "Agent details updated successfully",
            agent: updatedAgent
          });
        }
      }
    }

    return NextResponse.json({
      success: false,
      message: "Failed to update agent details",
    }, { status: 400 });
  } catch (error: unknown) {
    console.error("Error updating agent details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      success: false,
      message: "An error occurred while updating agent details",
      error: errorMessage,
    }, { status: 500 });
  }
} 