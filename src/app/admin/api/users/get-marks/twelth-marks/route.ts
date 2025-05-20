
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


  try {

    const {twelth_id} = await req.json();


    const [twelth_marks] = await db.query(
      "SELECT * FROM twefth_marks where id = ?", [twelth_id]
    );

    console.log("twelth_marks : ", twelth_marks);

    return NextResponse.json({
      twelth_marks,
      message: "twelth_marks fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching twelth_marks:", error);
    return NextResponse.json({ error: "Failed to tenth_marks" }, { status: 500 });
  }
}
