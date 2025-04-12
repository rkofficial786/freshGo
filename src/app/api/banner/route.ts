import { NextRequest, NextResponse } from "next/server";
import HeroBanner from "../../../../models/HeroBanner";
import { connectDB } from "../../../../db";

connectDB();

export const GET = async (req: NextRequest) => {
  try {
    const banners = await HeroBanner.find().sort("position");
    return NextResponse.json(
      { success: true, msg: "Success", banners },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error to get banner", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
