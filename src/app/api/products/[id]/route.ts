import { NextRequest, NextResponse } from "next/server";
import Product from "../../../../../models/Product";
import { connectDB } from "../../../../../db";
import "../../../../../models/User"

connectDB();

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;
    const product = await Product.findById(id).populate("reviews.user");
    
    if (!product)
      return NextResponse.json(
        { success: false, msg: "Product not found" },
        { status: 404 }
      );

    // Calculate discount percentage
    const productObj = product.toObject();
    if (productObj.mrp && productObj.price) {
      const discount = productObj.mrp - productObj.price;
      const discountPercentage = (discount / productObj.mrp) * 100;
      productObj.discountPercentage = Math.round(discountPercentage);
    }

    return NextResponse.json(
      { success: true, msg: "Success", product: productObj },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching product by id:", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";