import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// UPDATE ADMIN (PUT)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = params.id;
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    await db.query(
      `UPDATE admin SET name = ?, email = ?, password = ? WHERE id = ?`,
      [name, email, password, adminId]
    );

    return NextResponse.json({
      message: "Admin updated successfully",
      admin: { id: adminId, name, email },
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
} 