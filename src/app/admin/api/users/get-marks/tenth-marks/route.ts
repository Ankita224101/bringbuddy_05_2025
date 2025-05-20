
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


  try {

    const {tenth_id} = await req.json();


    const [tenth_marks] = await db.query(
      "SELECT * FROM tenth_marks where id = ?", [tenth_id]
    );

    console.log("tenth_marks : ", tenth_marks);
    

    return NextResponse.json({
      tenth_marks,
      message: "tenth_marks fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching tenth_marks:", error);
    return NextResponse.json({ error: "Failed to tenth_marks" }, { status: 500 });
  }
}
