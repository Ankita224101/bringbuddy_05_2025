import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {user_id} = await req.json();


    const [status] = (await db.query(
      "select  uni_email_status from users WHERE id = ?",
      [user_id]
    )) as any[];

     
    return NextResponse.json({ status: status[0] }, { status: 200 });
        
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 400 });
  }


}

