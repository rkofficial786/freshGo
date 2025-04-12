import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../db";
import { uploadFile } from "../../../../../helper/uploadFile";
import Admin from "../../../../../models/Admin";
import Product from "../../../../../models/Product";

connectDB();

export const POST = async (req: NextRequest) => {
  try {
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, msg: "Please provide Admin Id" },
        { status: 400 }
      );
    }
    const admin = await Admin.findById(adminId);
    if (!admin || (admin.role !== "Admin" && admin.role !== "SuperAdmin")) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const category = formData.get("category") as string;
    const hide = formData.get("hide") === "true";

    if (!name || !price || !category) {
      return NextResponse.json(
        {
          success: false,
          msg: "Name, price, and category are required fields.",
        },
        { status: 400 }
      );
    }

    // Upload image if provided
    let imgUrl = "";
    if (file) {
      imgUrl = await uploadFile("server/product", file);
      if (imgUrl === null) {
        return NextResponse.json(
          { success: false, msg: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Create the new product
    const newProduct = await Product.create({
      name,
      img: imgUrl,
      description,
      price,
      stockQuantity,
      category,
      hide,
    });

    return NextResponse.json(
      {
        success: true,
        msg: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating product:", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
