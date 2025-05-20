import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Fetch all admins with full details (id, name, email, password)
        const [admins] = await db.query("SELECT id, name, email, password FROM admin");


        const [countResult] = await db.query("SELECT COUNT(*) AS totalAdmins FROM admin");
        const totalAdmins = countResult[0].totalAdmins;

        // Return admins and total count as a response
        return NextResponse.json({
            admins: admins[0],
            totalAdmins: totalAdmins,
            message: "Admins fetched successfully"
        });
    } catch (err) {
        return NextResponse.json({
            err: err,
            message: "Error while fetching admins",
        });
    }
}
