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
  const {commission, email } = await request.json();

   try{
    const emailText = `
        Dear Admin,

        Please find below the applicant's essential academic and financial documents.


        Commission information has been successfully updated in our system.
        - Commission: Rs. ${commission}


        Regards,  
        BringUrBuddy Team
        `;

    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Request for Commission Payment",
      text: emailText,
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