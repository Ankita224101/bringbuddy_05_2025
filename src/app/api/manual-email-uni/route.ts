import { NextResponse, NextRequest } from "next/server";
import path from "path";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

// Configure mail transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, university_email, cc_email } = body;

    if (!user_id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.tenth_certificate, 
        u.twelfth_certificate,
        u.payment_receipt,
        u.id_proof,
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
      WHERE u.id = ?
    `,
      [user_id]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    // Prepare attachments
    const attachmentFields = [
      "tenth_certificate",
      "twelfth_certificate",
      "id_proof",
      "payment_receipt",
    ];
    const attachments = attachmentFields
      .filter((field) => user[field])
      .map((field) => {
        const relativePath = user[field];
        const fullPath = path.join(
          process.cwd(),
          "public",
          relativePath.replace(/^\/+/, "")
        );
        return {
          filename: field === "id_proof" 
            ? `passport.${fullPath.split(".").pop()}`
            : `${field.replace(/_/g, " ")}.${fullPath.split(".").pop()}`,
          path: fullPath,
        };
      });

    
    // const [universityDetails] = await db.query(
    //   `SELECT university_email FROM universities WHERE id = ?`,
    //   [user.university_id]
    // );

    // const universityEmail =
    //   universityDetails[0]?.university_email || "ankita31.mcl@gmail.com";

    //   console.log("universityEmail", universityEmail);
      

    const emailText = `
Dear ${user.university_name},

Please find below the applicant's essential academic and financial documents.

- Name: ${user.name}
- Email: ${user.email}
- Program: ${user.program_name}
- University: ${user.university_name}
- Trade: ${user.trade_name}
- Country: ${user.country_name}

Attached are:
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

    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: university_email,
      cc: cc_email,
      subject: "Applicant Document Submission",
      text: emailText,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: `Email sent to university at ${university_email}`,
      success: true,
    });
  } catch (err: any) {
    console.error("Email Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
