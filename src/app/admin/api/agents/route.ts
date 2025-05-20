import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Fetch all admins with full details (id, name, email, password)


        const [agents] = await db.query("SELECT * FROM agents");


        // Return admins and total count as a response
        return NextResponse.json({
          agents: agents,
          message: "agents fetched successfully",
        });
    } catch (err) {
        return NextResponse.json({
          err: err,
          message: "Error while fetching agents",
        });
    }
}
