import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";
import { RowDataPacket } from "mysql2";

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

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
   

    const requiredFiles = ["admission_letter"];

    const filePaths: { [key: string]: string } = {};

    for (const fileKey of requiredFiles) {
      const file = formData.get(fileKey) as File | null;

      console.log(file, fileKey);

      if(file == null) {
        continue;
      }

      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `${fileKey} must be a PDF` },
          { status: 400 }
        );
      }
      filePaths[fileKey] = await saveFile(file);
    }

    const [userResult] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?;", [email]);
    const user = userResult[0];

    await db.query("UPDATE users SET admission_letter = ? WHERE email = ?;", [
      filePaths.admission_letter,
      email,
    ]);

    console.log("Updated admission letter for user:", email, filePaths.admission_letter);

    const filePath = path.join(
      process.cwd(),
      "public",
      filePaths.admission_letter.replace(/^\//, '')
    );

    console.log("File path:", filePath);

    const attachments = [
      {
        filename: "admission_letter.pdf",
        path: filePaths.admission_letter.startsWith('/') 
          ? path.join(process.cwd(), 'public', filePaths.admission_letter.substring(1)) 
          : path.join(process.cwd(), 'public', filePaths.admission_letter),
        contentType: 'application/pdf',
      },
    ];

    const emailText = `
    Dear University Administration,

    Please find attached the Admission Letter for the following applicant:

    - Name: ${user.name}
    - Email: ${user.email}

    Regards,  
    BringUrBuddy Team
    `;


    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: user.email,
  
      subject: "Student Admission Document",
      text: emailText,
      attachments: attachments,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        { error: "Failed to send email, but document was uploaded" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Admission letter uploaded and email sent successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
