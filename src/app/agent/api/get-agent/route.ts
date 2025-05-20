import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Fetch all admins with full details (id, name, email, password)

        const {email} = await req.json();


        const [agents] = await db.query("SELECT * FROM agents where email = ?", [email]);



        // Return admins and total count as a response
        return NextResponse.json({
          agents: agents[0],
          message: "agents fetched successfully",
        });
    } catch (err) {
        return NextResponse.json({
          err: err,
          message: "Error while fetching agents",
        });
    }
}
