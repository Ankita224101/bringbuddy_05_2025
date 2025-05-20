import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const file = formData.get("file") as File;

    // Validate required fields
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Agent ID is required",
      }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "Profile image file is required",
      }, { status: 400 });
    }

    // Get file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({
        success: false,
        message: "Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP files are allowed.",
      }, { status: 400 });
    }

    // Create directories if they don't exist
    const uploadDir = path.join(process.cwd(), 'public', 'agents', 'profile');
    await mkdir(uploadDir, { recursive: true });

    // Generate a unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Convert file to Buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update the agent's profile_img in the database
    const dbFilePath = `/agents/profile/${uniqueFilename}`;
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE agents SET profile_img = ? WHERE id = ?",
      [dbFilePath, id]
    );

    if (result && result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
        message: "Profile image uploaded successfully",
        profileImgPath: dbFilePath
      });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to update profile image in database",
    }, { status: 500 });
  } catch (error: unknown) {
    console.error("Error uploading profile image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      success: false,
      message: "An error occurred while uploading profile image",
      error: errorMessage,
    }, { status: 500 });
  }
} 