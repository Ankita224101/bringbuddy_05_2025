import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {user_id} = await req.json();
 

    const [user] = (await db.query(
      "UPDATE users SET request_doc = 1 WHERE id = ?",
      [user_id]
    )) as any[];

    return NextResponse.json({ message :  "success" }, { status: 200 });
        
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 400 });
  }


}