import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {user_id, commission} = await req.json();

    console.log(user_id, commission);
    


    const [commissions] = (await db.query(
      "insert into commission (user_id, amount, status) values (?, ?, ?)",
      [user_id, commission, 1]
    )) as any[];

     
    return NextResponse.json({ commission: commissions[0] }, { status: 200 });
        
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 400 });
  }


}

