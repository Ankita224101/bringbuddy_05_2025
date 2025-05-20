import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const uploadDir = path.join(process.cwd(), "public", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file: File) => {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);
  return `/documents/${fileName}`;
};


export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const user_id = formData.get("user_id") as string;


    const requiredFiles = ["payment_receipt"];



    const filePaths: { [key: string]: string } = {};

    for (const fileKey of requiredFiles) {
      const file = formData.get(fileKey) as File | null;

      console.log(file, fileKey);

      // if (fileKey == "bachelor_certificate") {
      //   continue;
      // }

      if(file == null) {
        continue;
      }


      // if (!file) {
      //   return NextResponse.json(
      //     { error: `${fileKey} is required` },
      //     { status: 400 }
      //   );
      // }

      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `${fileKey} must be a PDF` },
          { status: 400 }
        );
      }
      filePaths[fileKey] = await saveFile(file);
    }


    console.log("File Paths:", filePaths.payment_receipt, user_id);
    

   await db.query("UPDATE commission SET payment_reciept = ?  WHERE user_id = ?;", [
     filePaths.payment_receipt,
     user_id,
   ]);



    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
