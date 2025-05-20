import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update a payment status by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { payment_status } = body;
    const { id } = params;

    // Validate input
    if (payment_status === undefined) {
      return NextResponse.json(
        { error: "Payment status is required" },
        { status: 400 }
      );
    }

    // Check if status is valid (0 or 1)
    if (![0, 1].includes(payment_status)) {
      return NextResponse.json(
        { error: "Invalid payment status. Must be 0 (pending) or 1 (paid)" },
        { status: 400 }
      );
    }

    // Update payment status in database
    await db.query(
      "UPDATE users SET payment_status = ? WHERE id = ?",
      [payment_status, id]
    );

    return NextResponse.json({
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}

// GET: Get payment information for a user by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get user payment details
    const [user] = await db.query(
      "SELECT id, name, email, phone_number, payment_status, payment_amount, created_at FROM users WHERE id = ?",
      [id]
    );

    if (!user || (Array.isArray(user) && user.length === 0)) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Payment information fetched successfully",
      payment: user[0],
    });
  } catch (error) {
    console.error("Error fetching payment information:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment information" },
      { status: 500 }
    );
  }
} 