import { NextRequest, NextResponse } from "next/server";
import Product from "../../../../models/Product";

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const search = url.searchParams.get("search") || "";
        
        // Search in products by name, description, category, or sku
        const products = await Product.find({
            $or: [
                { name: new RegExp(search, "i") },
                { description: new RegExp(search, "i") },
                { category: new RegExp(search, "i") },
                { sku: new RegExp(search, "i") }
            ]
        });
        
        // Create suggestions array
        let suggestions = [];
        
        // Add product name suggestions
        products.forEach((product) => {
            suggestions.push({ 
                name: product.name, 
                type: 'product',
                id: product._id
            });
        });
        
        // Add unique category suggestions from product results
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        uniqueCategories.forEach(category => {
            if (category) {
                suggestions.push({
                    name: category,
                    type: 'category'
                });
            }
        });
        
        return NextResponse.json(
            { 
                success: true, 
                msg: "Success", 
                suggestions 
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in search API: ", error);
        return NextResponse.json(
            { success: false, msg: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export const dynamic = "force-dynamic";