import { NextResponse, NextRequest } from 'next/server';
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, degree, marks, grade, percentage } = data;

    console.log("data", data);
    
 

    // Begin a transaction
    await db.query('START TRANSACTION');
    
    try {
     
        await db.query(
          `INSERT INTO bachelor_marks (id, degree, marks, grade, percentage) 
           VALUES (?, ?, ?, ?, ?)`,
          [id,degree ,marks, grade, percentage]
        );

      
      // Commit the transaction
      await db.query('COMMIT');
      
      return NextResponse.json({
        message: "10th marks data saved successfully",
        success: true
      }, { status: 200 });
      
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      throw error;
    }
    
  } catch (error: any) {
    console.error("Error saving 10th marks:", error);
    
    return NextResponse.json({
      message: "Failed to save 10th marks data",
      error: error.message,
      success: false
    }, { status: 500 });
  }
}
