import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../db";
import Product from "../../../../models/Product";

connectDB();


interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductWithQuantity {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  [key: string]: any; // For other properties the product might have
}

interface ProductMap {
  [key: string]: ProductWithQuantity;
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { cartItems } = body as { cartItems: CartItem[] };
        
        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ 
                success: true, 
                products: [],
                msg: "Cart is empty" 
            }, { status: 200 });
        }
        
        // Extract product IDs from cart items
        const productIds = cartItems.map(item => item.productId);
        
        // Fetch products by IDs
        const products = await Product.find({ _id: { $in: productIds } });
        
        if (!products || products.length === 0) {
            return NextResponse.json({ 
                success: false, 
                msg: "Products not found" 
            }, { status: 404 });
        }
        
        // Create a map of products with their quantities
        const productMap: ProductMap = {};
        products.forEach(product => {
            const productObj = product.toObject();
            productMap[product._id.toString()] = {
                ...productObj,
                quantity: 0 // Initialize quantity
            };
        });
        
        // Add quantities from cart items
        cartItems.forEach(item => {
            if (productMap[item.productId]) {
                productMap[item.productId].quantity = item.quantity;
            }
        });
        
        // Convert back to array and calculate totals
        const productsWithQuantity = Object.values(productMap);
        
        // Calculate cart totals
        const cartTotal = productsWithQuantity.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        const mrpTotal = productsWithQuantity.reduce((total, item) => {
            return total + (item.mrp * item.quantity);
        }, 0);
        
        const discount = mrpTotal - cartTotal;
        
        return NextResponse.json({ 
            success: true, 
            msg: "Success", 
            products: productsWithQuantity,
            cartSummary: {
                totalItems: productsWithQuantity.length,
                totalQuantity: productsWithQuantity.reduce((sum, item) => sum + item.quantity, 0),
                cartTotal,
                mrpTotal,
                discount,
                deliveryFee: cartTotal < 499 ? 50 : 0, // Free delivery above 499
                tax: Math.round(cartTotal * 0.05), // 5% tax example
            }
        }, { status: 200 });
    } catch (error: any) { // Type error as any to be able to access error.message
        console.log("Error fetching cart products:", error);
        return NextResponse.json({ 
            success: false, 
            msg: "Internal Server Error", 
            error: error.message 
        }, { status: 500 });
    }
}

export const dynamic = "force-dynamic";