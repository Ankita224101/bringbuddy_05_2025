import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function isAuthenticated(req: NextRequest) {
  try {


    const token = req.cookies.get("token")?.value;
    

    const authHeader = req.headers.get("authorization");
    const headerToken = authHeader && authHeader.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : null;
    
    const finalToken = token || headerToken;

    if (!finalToken) {
      return { success: false, message: "No authentication token found" };
    }

    const [rows]: any = await db.query(
      "SELECT * FROM user_tokens WHERE token = ? AND expires_at > NOW()",
      [finalToken]
    );

    if (!rows || rows.length === 0) {
      return { success: false, message: "Invalid or expired token" };
    }

    const userId = rows[0].user_id;
    const [users]: any = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (!users || users.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = users[0];

    return { 
      success: true, 
      user,
      isAdmin: user.role === "ADMIN"
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, message: "Authentication failed" };
  }
} 

