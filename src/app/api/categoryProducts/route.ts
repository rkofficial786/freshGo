import { NextRequest, NextResponse } from "next/server";
import Category from "../../../../models/Category";
import { connectDB } from "../../../../db";
import Product from "../../../../models/Product";

connectDB();

export const GET = async (req: NextRequest) => {
  try {
    console.log("hii caewtgiry");

    const allCategories = await Category.find();
console.log(allCategories);

    const categories = allCategories.filter((item) => item.childCategory.length > 0);

    console.log(categories, "caetgories main");

    const categoryProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({
          categories: { $in: category.childCategory },
        }).limit(4);
        console.log(products, "products");

        const obj = {
          name: category.name,
          products,
        };
        return obj;
      })
    );

    return NextResponse.json(
      { success: true, msg: "Success", categoryProducts },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error to get categories ", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
