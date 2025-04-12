import { NextRequest, NextResponse } from "next/server";
import Admin from "../../../../../../models/Admin";
import { connectDB } from "../../../../../../db";
import Product from "../../../../../../models/Product";

connectDB();

export const GET = async (req: NextRequest) => {
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

    // Find the top 3 most-selling products using the sellCount field
    const topProducts = await Product.aggregate([
      // Unwind sizes to work with each size object
      { $unwind: "$sizes" },

      // Group by product _id and accumulate total sellCount and revenue
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" }, // Keep the product name
          totalUnitsSold: { $sum: "$sizes.sellCount" }, // Total units sold across all sizes
          totalRevenue: { $sum: { $multiply: ["$sizes.sellCount", "$sizes.offerPrice"] } }, // Revenue = sellCount * offerPrice for each size
        }
      },

      // Sort by totalUnitsSold in descending order
      { $sort: { totalUnitsSold: -1 } },

      // Limit to the top 3 products
      { $limit: 3 }
    ]);

    return NextResponse.json(
      { success: true, msg: "Success", topProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error to get sales overview", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
