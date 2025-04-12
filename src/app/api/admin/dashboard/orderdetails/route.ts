import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../../db";
import Admin from "../../../../../../models/Admin";
import Order from "../../../../../../models/Order";
import "../../../../../../models/Product";

// Ensure database connection is established
connectDB();

export const GET = async (req: NextRequest) => {
    try {
        const adminId = req.headers.get('x-admin-id');
        if (!adminId) {
            return NextResponse.json({ success: false, msg: "Please provide Admin Id" }, { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin || (admin.role !== "Admin" && admin.role !== "SuperAdmin")) {
            return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const periodDays = Number(url.searchParams.get("period") as string);

        if (isNaN(periodDays) || periodDays <= 0) {
            return NextResponse.json({ success: false, msg: 'Invalid period' }, { status: 400 });
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);

        if (!startDate || startDate>new Date()) {
            return NextResponse.json({ success: false, msg: 'Invalid period' }, { status: 400 });
        }

        // Aggregate sales data from orders during the given period
        const salesData = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, paymentStatus: "COMPLETED" } },  // Match successful orders within the period
            { $unwind: '$productDetails' },  // Unwind the productDetails array to get each product
            {
                $group: {
                    _id: '$productDetails.product._id',  // Group by product ID (since the product is an object)
                    productName: { $first: '$productDetails.product.name' },  // Get the product name
                    productImage: { $first: '$productDetails.product.img' },  // Get the product image
                    productDescription: { $first: '$productDetails.product.description' },  // Get product description
                    totalSalesAmount: { $sum: { $multiply: ['$productDetails.count', '$productDetails.sizes.offerPrice'] } },  // Calculate total sales amount for each product
                    productSize: { $first: '$productDetails.size.size' },
                    totalCount: { $sum: '$productDetails.count' }  // Count the total products sold
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',  // Return the product ID
                    productName: 1,  // Include product name
                    productImage: 1,  // Include product image
                    productDescription: 1,  // Include product description
                    totalSalesAmount: 1,  // Return total sales amount
                    productSize:1,
                    totalCount: 1  // Return total count of products sold
                }
            }
        ]);

        const totalAmount = salesData.reduce((acc, item) => acc + item.totalSalesAmount, 0);
        const totalOrderCount = await Order.countDocuments({ createdAt: { $gte: startDate }, paymentStatus: "COMPLETED" });

        return NextResponse.json({ success: true, msg: "Success", totalAmount, salesData, totalOrderCount }, { status: 200 });

    } catch (error) {
        console.error("Error to get admin order details", error);
        return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
};
