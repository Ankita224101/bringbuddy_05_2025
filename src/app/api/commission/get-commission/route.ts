import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {agent_id} = await req.json();


    const [commission] = (await db.query(
      "select  commission from agents WHERE id = ?",
      [agent_id]
    )) as any[];

     
    return NextResponse.json({ commission: commission[0] }, { status: 200 });
        
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 400 });
  }


}

