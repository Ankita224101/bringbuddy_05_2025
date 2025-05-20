import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";



export async function POST(req: Request) {
  try {
    const {email} = await req.json();



   await db.query("UPDATE users SET document_verified_status = ?, is_eligible = ? WHERE email = ?;", [
     1, 1, email,
   ]);



    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
