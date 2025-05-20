import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { db } from "@/lib/db";
import PaymentReceiptTemplate from "@/templates/paymentReceiptTemplate";
import { writeFile } from "fs/promises";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public", "documents", "payments");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// SMTP Email Configuration
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

    const user_id = formData.get("user_id") as string;
    const payment_type = formData.get("payment_type") as string;
    const paymentFile = formData.get("payment_document") as File;

    if (!user_id || !payment_type || !paymentFile) {
      return NextResponse.json({ 
        success: false,
        error: "Missing required fields" 
      }, { status: 400 });
    }
    
    // Parse user_id to number
    const userId = parseInt(user_id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ 
        success: false,
        error: "Invalid user ID" 
      }, { status: 400 });
    }

    // Fetch user details from database
    const [usersResult]: any = await db.execute(
      `SELECT u.email, u.name, u.university_id, u.program_id, un.name AS university_name, p.name AS program_name 
       FROM users u 
       JOIN universities un ON u.university_id = un.id 
       JOIN programs p ON u.program_id = p.id 
       WHERE u.id = ? 
       LIMIT 1`,
      [userId]
    );

    if (!usersResult || usersResult.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: "User not found" 
      }, { status: 404 });
    }

    const user = usersResult[0];
    
    // Save the uploaded file
    const fileExtension = paymentFile.name.split('.').pop();
    const fileName = `payment_${userId}_${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    const fileBuffer = Buffer.from(await paymentFile.arrayBuffer());
    
    // Write file to disk
    await writeFile(filePath, fileBuffer);
    
    // File path to store in database (relative to public folder)
    const dbFilePath = `/documents/payments/${fileName}`;
    
    // Generate receipt PDF
    const receiptFileName = `receipt_${userId}_${Date.now()}.pdf`;
    const receiptContent = PaymentReceiptTemplate(
      user.name, 
      payment_type === 'yearly' ? 'Yearly Payment' : 'Semester Payment',
      'success'
    );
    
    const receiptPath = await generatePDF(receiptFileName, receiptContent);
    const dbReceiptPath = `/documents/payments/${receiptFileName}`;

    
    const insertQuery = `
      INSERT INTO uni_payments 
      (user_id, payment_document,  payment_status, payment_type) 
      VALUES (?, ?, ?, ?)`;

    await db.execute(insertQuery, [
      userId,
      dbReceiptPath,
      1,
      payment_type
    ]);

    // Send email notification
    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `University ${payment_type === 'yearly' ? 'Yearly' : 'Semester'} Payment Receipt`,
      text: `Hello ${user.name},\n\nYour ${payment_type} payment has been received and processed successfully. Please find attached your payment receipt.\n\nBest regards,\nBring Ur Buddy Team`,
      attachments: [
        {
          filename: receiptFileName,
          path: receiptPath,
        },
        {
          filename: fileName,
          path: filePath,
        }
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Payment file uploaded and processed successfully",
      file_path: dbFilePath,
      receipt_path: dbReceiptPath
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process payment"
    }, { status: 500 });
  }
}

async function generatePDF(fileName: string, htmlContent: string): Promise<string> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const filePath = path.join(uploadDir, fileName);
    await page.pdf({ path: filePath, format: "A4" });

    return filePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("PDF Generation Failed");
  } finally {
    if (browser) await browser.close();
  }
}
