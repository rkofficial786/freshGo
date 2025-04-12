import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../../db";
import Product from "../../../../../../models/Product";
import mongoose from "mongoose";
import { uploadFile } from "../../../../../../helper/uploadFile";
import { deleteFile } from "../../../../../../helper/deleteFile";
import Admin from "../../../../../../models/Admin";

connectDB();

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
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
    
    const id = params.id;
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, msg: "Product not found" },
        { status: 404 }
      );
    }
    
    // Delete the product image if it exists
    if (product.img) {
      await deleteFile(product.img);
    }
    
    // Delete the product
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json(
      { success: true, msg: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting product:", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
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
    
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, msg: "Invalid product ID" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    
    const file = formData.get("file") as File;
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
    const mrp = formData.get("mrp") ? parseFloat(formData.get("mrp") as string) : null;
    const stockQuantity = formData.get("stockQuantity") ? parseInt(formData.get("stockQuantity") as string) : null;
    const unit = formData.get("unit") as string | null;
    const sku = formData.get("sku") as string | null;
    const category = formData.get("category") as string | null;
    const isFeatured = formData.has("isFeatured") ? formData.get("isFeatured") === "true" : null;
    const hide = formData.has("hide") ? formData.get("hide") === "true" : null;
    const keepExistingImage = formData.get("keepExistingImage") === "true";

    const updateData: any = {};

    if (name !== null) updateData.name = name;
    if (description !== null) updateData.description = description;
    if (price !== null) updateData.price = price;
    if (mrp !== null) updateData.mrp = mrp;
    if (stockQuantity !== null) updateData.stockQuantity = stockQuantity;
    if (unit !== null) updateData.unit = unit;
    if (sku !== null) updateData.sku = sku;
    if (category !== null) updateData.category = category;
    if (isFeatured !== null) updateData.isFeatured = isFeatured;
    if (hide !== null) updateData.hide = hide;

    // Get the existing product to handle image updates
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, msg: "Product not found" },
        { status: 404 }
      );
    }

    // Handle image upload if a new file is provided
    if (file) {
      // Delete old image if it exists
      if (existingProduct.img && !keepExistingImage) {
        await deleteFile(existingProduct.img);
      }
      
      // Upload new image
      const imgUrl = await uploadFile("server/product", file);
      if (imgUrl === null) {
        return NextResponse.json(
          { success: false, msg: "Failed to upload image" },
          { status: 500 }
        );
      }
      
      updateData.img = imgUrl;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json(
      { 
        success: true, 
        msg: "Product updated successfully",
        product: updatedProduct 
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating product:", error);
    
    // Check for duplicate key error (for SKU)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, msg: "Product with this SKU already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";