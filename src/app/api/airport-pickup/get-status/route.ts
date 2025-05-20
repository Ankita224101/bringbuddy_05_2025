import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {user_id} = await req.json();


     const [users] = (await db.query(
       "SELECT * from  airport_pickup WHERE user_id = ?",
       [user_id]
     )) as any[];

     console.log("Airprt Pickup users : ",users);
     
    
        if (!users.length) {
          return NextResponse.json({ users });
        }else{
            return NextResponse.json({ users }, { status: 200 });
        }
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 200 });
  }


}