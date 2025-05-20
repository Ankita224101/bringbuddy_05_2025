
        import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
  
export async function GET(req: Request) {
    try {
      const [programs] = await db.query("SELECT * FROM programs");
  
      return NextResponse.json({
        message: "Programs fetched successfully",
        programs,
      });
    } catch (error) {
      console.error("Error fetching programs:", error);
      return NextResponse.json(
        { error: "Failed to fetch programs" },
        { status: 500 }
      );
    }
  }