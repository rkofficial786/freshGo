import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../db";
import Contact from "../../../../models/Contact";

connectDB();

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const {name, email, description, mobile} = body;
        if(!name || !email || !description || !mobile) return NextResponse.json({ success: false, msg: "Bad Request" }, { status: 400 });
        const contact = await Contact.create({
            name,
            email,
            mobile,
            description
        });
        return NextResponse.json({ success: true, msg: "Success", contact }, { status: 200 });
    } catch (error) {
        console.log("Error to create contact", error);
        return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
}