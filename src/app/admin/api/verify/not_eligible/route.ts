import { NextResponse } from "next/server";
import { db } from "@/lib/db";




export async function POST(req: Request) {
  try {
    const {email} = await req.json();



   const [response] = await db.query("UPDATE users SET document_verified_status = ?, is_eligible = ? WHERE email = ?;", [
     0, 0, email
   ]);

   console.log(response, "response");
   



    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
