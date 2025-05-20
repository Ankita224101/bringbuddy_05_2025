
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Fetch all users from the database
        const users = await db.query("SELECT id, name, email FROM users");

        // Count the total number of users
        const [countResult] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
        const totalUsers = countResult[0].totalUsers;

        // Return users and total count as a response
        return NextResponse.json({
            users: users,
            totalUsers: totalUsers,
            message: "Users fetched successfully"
        });
    } catch (err) {
        return NextResponse.json({
            err: err,
            message: "Error while fetching users",
        });
    }
}
