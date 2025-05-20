import { NextResponse, NextRequest } from "next/server";
import path from "path";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import fs from "fs";
import { writeFile } from "fs/promises";

// Upload directory setup
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file: File) => {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const user_id = formData.get("user_id")?.toString();
    const university_email = formData.get("university_email")?.toString();
    const cc_email = formData.get("cc_email")?.toString();

    // New form fields replacing visaFile and photoFile
    const departure_datetime = formData.get("departure_datetime")?.toString();
    const departure_port = formData.get("departure_port")?.toString();
    const destination_port = formData.get("destination_port")?.toString();
    const destination_datetime = formData.get("destination_datetime")?.toString();
    const ticket_document = formData.get("ticket_document") as File;


    if (
      !user_id ||
      !departure_datetime ||
      !departure_port ||
      !destination_port ||
      !destination_datetime ||
      !ticket_document
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Save ticket document file
    const ticketPath = await saveFile(ticket_document);

    // Fetch user info
    const [rows] = await db.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.tenth_certificate, 
        u.twelfth_certificate,
        u.payment_receipt,
        u.id_proof,
        u.offer_letter,
        u.bonafide_letter,
        u.admission_letter,
        u.ugc_letter,
        u.visa,
        u.affiliation_letter,
        u.university_id,
        p.name AS program_name,
        un.name AS university_name,
        ct.name AS trade_name,
        c.name AS country_name
      FROM users u
      LEFT JOIN programs p ON u.program_id = p.id
      LEFT JOIN universities un ON u.university_id = un.id
      LEFT JOIN course_trades ct ON u.course_trade_id = ct.id
      LEFT JOIN countries c ON u.country_id = c.id
      WHERE u.id = ?`,
      [user_id]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    const [existingTravelRows] = await db.query(
      `SELECT id FROM tickets WHERE user_id = ?`,
      [user_id]
    );

    if (Array.isArray(existingTravelRows) && existingTravelRows.length > 0) {
      await db.query(
        `UPDATE tickets SET departure_datetime = ?, departure_port = ?, destination_port = ?, destination_datetime = ?, ticket_document = ? WHERE user_id = ?`,
        [departure_datetime, departure_port, destination_port, destination_datetime, ticketPath, user_id]
      );
    } else {
      await db.query(
        `INSERT INTO tickets (user_id, departure_datetime, departure_port, destination_port, destination_datetime, ticket_document) VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, departure_datetime, departure_port, destination_port, destination_datetime, ticketPath]
      );
    }

    // Prepare attachments from user documents
    const attachmentFields = [
      "tenth_certificate",
      "twelfth_certificate",
      "id_proof",
      "payment_receipt",
      "offer_letter",
      "bonafide_letter",
      "admission_letter",
      "ugc_letter",
      "affiliation_letter",
    ];

    const attachments = attachmentFields
      .filter((field) => user[field])
      .map((field) => {
        const relativePath = user[field];
        const fullPath = path.join(process.cwd(), "public", relativePath.replace(/^\/+/, ""));
        return {
          filename: field === "id_proof" 
            ? `passport.${fullPath.split(".").pop()}`
            : `${field.replace(/_/g, " ")}.${fullPath.split(".").pop()}`,
          path: fullPath,
        };
      });

    attachments.push({
      filename: `ticket_document.${ticketPath.split(".").pop()}`,
      path: path.join(process.cwd(), "public", ticketPath.replace(/^\/+/, "")),
    });

    // Compose email body with travel details
    const emailText = `
Dear ${user.university_name},

Please find below the applicant's travel details and ticket document.

- Name: ${user.name}
- Email: ${user.email}
- Program: ${user.program_name}
- University: ${user.university_name}
- Trade: ${user.trade_name}
- Country: ${user.country_name}

Travel Details:
- Departure DateTime: ${departure_datetime}
- Departure Port: ${departure_port}
- Destination Port: ${destination_port}
- Destination DateTime: ${destination_datetime}

Attached is the ticket document along with other documents.
${attachments.map((att) => {
  // Replace "id proof" with "passport" in the attachment list
  const filename = att.filename.startsWith("passport") 
    ? "passport" + att.filename.substring("passport".length)
    : att.filename;
  return `- ${filename}`;
}).join("\n")}

Regards,  
BringUrBuddy Team
`;

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: university_email,
      cc: cc_email,
      subject: "Applicant Travel Details and Ticket Document",
      text: emailText,
      attachments,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: `Email sent to university at ${university_email}`,
      success: true,
    });
  } catch (err: any) {
    console.error("Server Error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
