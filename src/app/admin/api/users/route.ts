import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin


    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    
    // Calculate offset
    const offset = (page - 1) * limit;

    // Build the query based on filters
    let countQuery = "SELECT COUNT(*) as total FROM users";
    let usersQuery = `
      SELECT u.id, u.name, u.email, u.phone, u.country, u.status, 
             u.created_at as registeredOn, p.name as program
      FROM users u
      LEFT JOIN programs p ON u.program_id = p.id
    `;
    
    const queryParams: any[] = [];
    const whereConditions: string[] = [];
    
    if (search) {
      whereConditions.push("(u.name LIKE ? OR u.email LIKE ? OR p.name LIKE ?)");
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (status && status !== "all") {
      whereConditions.push("u.status = ?");
      queryParams.push(status);
    }
    
    if (whereConditions.length > 0) {
      const whereClause = `WHERE ${whereConditions.join(" AND ")}`;
      countQuery += ` ${whereClause}`;
      usersQuery += ` ${whereClause}`;
    }
    
    // Add pagination to users query
    usersQuery += " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Execute queries
    const [countResult]: any = await db.query(countQuery, queryParams.slice(0, queryParams.length - 2));
    const totalUsers = countResult[0].total;
    
    const [users]: any = await db.query(usersQuery, queryParams);

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);
    
    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages,
      }
    });
  } catch (error) {
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { error: "Failed to fetch users data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin

    // Get user data from request body
    const userData = await req.json();
    
    // Validate required fields
    if (!userData.name || !userData.email) {
      return NextResponse.json(
        { error: "Name and email are required fields" },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const [existingUsers]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [userData.email]
    );
    
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    
    // Insert new user
    const [result]: any = await db.query(
      `INSERT INTO users (name, email, phone, country, status, program_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userData.name,
        userData.email,
        userData.phone || null,
        userData.country || null,
        userData.status || "pending",
        userData.programId || null
      ]
    );
    
    if (result.affectedRows === 1) {
      const [newUser]: any = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [result.insertId]
      );
      
      return NextResponse.json({
        success: true,
        user: newUser[0]
      });
    } else {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
} 