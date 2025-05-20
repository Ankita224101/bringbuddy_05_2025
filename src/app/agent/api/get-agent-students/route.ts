import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {

        const {agent_id} = await req.json();

        const [students] = await db.query(
          "SELECT * FROM users where agent_id = ?",
          [agent_id]
        );

        return NextResponse.json({
          students: students,
          message: "students fetched successfully",
        });

    } catch (err) {
        return NextResponse.json({
          err: err,
          message: "Error while fetching students",
        });
    }
}
