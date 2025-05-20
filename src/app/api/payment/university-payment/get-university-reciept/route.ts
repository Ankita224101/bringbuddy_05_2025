import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    
  try {
  
    const { user_id } = await req.json();


    const [rows] = await db.query(
      "SELECT payment_document FROM uni_payments WHERE user_id = ?",
      [user_id]
    );


    const filePath = rows[0].payment_document;
    

    const fullFilePath = path.join(process.cwd(), "public", filePath);
    if (!fs.existsSync(fullFilePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      payment_document: [{ name: path.basename(filePath), url: `${filePath}` }],
    });
  } catch (error) {
    console.error("Error fetching offer letter:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer letter" , payment_document: [] },
      { status: 500 }
    );
  }
}
