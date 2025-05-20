import { NextResponse, NextRequest } from 'next/server';
import path from "path";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

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

export async function POST(request: NextRequest) {
  const { user_id, agent_id, commission, email, cc } = await request.json();

  if (!user_id || commission === undefined) {
    return NextResponse.json(
      { message: "userId and commission are required." },
      { status: 400 }
    );
  }  

  console.log( user_id, agent_id, commission, email, cc);
  

  try {
    const [result] = await db.query(
      `UPDATE agents SET commission = ? WHERE id = ?`,
      [commission, agent_id]
    );

   

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
      WHERE u.id = ?
    `,
      [user_id]
    );

    const user = rows[0];


     const attachmentFields = [
          "tenth_certificate",
          "twelfth_certificate",
          "id_proof",
          "payment_receipt",
          "bonafide_letter",
          "offer_letter",
          "admission_letter",
          "ugc_letter",
          "visa",
          "affliation_letter",
          

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
              filename: `${field.replace(/_/g, " ")}.${fullPath.split(".").pop()}`,
              path: fullPath,
            };
          });

    // if (!Array.isArray(rows) || rows.length === 0) {
    //   return NextResponse.json({ message: "User not found" });
    // }

    const emailText = `
Dear ${user.university_name},

Please find below the applicant's essential academic and financial documents.

- Name: ${user.name}
- Email: ${user.email}
- Program: ${user.program_name}
- University: ${user.university_name}
- Trade: ${user.trade_name}
- Country: ${user.country_name}


Commission information has been successfully updated in our system.
- Commission: Rs. ${commission}

Attached are:
${attachments.map((att) => `- ${att.filename}`).join("\n")}

Regards,  
BringUrBuddy Team
`;

    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      cc: cc,
      subject: "Request for Commission Payment",
      text: emailText,
      attachments,
    };

        await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Commission updated successfully.", status: "success" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to update commission.",
        error: error.message,
        status: "error"
      },
      { status: 500 }
    );
  }
} 