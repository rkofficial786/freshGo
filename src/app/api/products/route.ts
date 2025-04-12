import { NextRequest, NextResponse } from "next/server";
import Product from "../../../../models/Product";
import { connectDB } from "../../../../db";

connectDB();

export const GET = async (req: NextRequest) => {
  try {
    // Parse the URL to get query parameters
    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const category = url.searchParams.get("category");
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const limit = parseInt(url.searchParams.get("limit") as string) || 10;
    const sort = url.searchParams.get("sort");
    const minPrice = parseFloat(url.searchParams.get("minPrice") as string);
    const maxPrice = parseFloat(url.searchParams.get("maxPrice") as string);
    const isFeatured = url.searchParams.get("isFeatured") === 'true';
    const hide = url.searchParams.get("hide") === 'false';
    const unit = url.searchParams.get("unit");

    // Build the search criteria
    const searchCriteria: any = {};

    if (search) {
      const regex = new RegExp(search, "i");
      searchCriteria.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
        { sku: regex }
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (isFeatured) {
      searchCriteria.isFeatured = true;
    }

    if (hide) {
      searchCriteria.hide = !hide;
    }

    if (unit) {
      searchCriteria.unit = unit;
    }

    // Price filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      searchCriteria.price = {};
      
      if (!isNaN(minPrice)) {
        searchCriteria.price.$gte = minPrice;
      }
      
      if (!isNaN(maxPrice)) {
        searchCriteria.price.$lte = maxPrice;
      }
    }

    // Determine sorting
    let sortCriteria = {};
    if (sort === "newest") {
      sortCriteria = { createdAt: -1 };
    } else if (sort === "priceHighToLow") {
      sortCriteria = { price: -1 };
    } else if (sort === "priceLowToHigh") {
      sortCriteria = { price: 1 };
    } else if (sort === "discountHighToLow") {
      // Sort by discount percentage (calculated from MRP and price)
      sortCriteria = { $expr: { $subtract: ["$mrp", "$price"] } };
    }

    // Calculate the skip value
    const skip = (page - 1) * limit;

    // Execute the query
    const products = await Product.find(searchCriteria)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // Calculate discount percentage for each product
    const productsWithDiscount = products.map(product => {
      const productObj = product.toObject();
      if (productObj.mrp && productObj.price) {
        const discount = productObj.mrp - productObj.price;
        const discountPercentage = (discount / productObj.mrp) * 100;
        return {
          ...productObj,
          discountPercentage: Math.round(discountPercentage)
        };
      }
      return productObj;
    });

    // Get the total count of products matching the search criteria
    const totalProducts = await Product.countDocuments(searchCriteria);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);
    
    return NextResponse.json(
      {
        success: true,
        msg: "Success",
        products: productsWithDiscount,
        totalPages,
        previousPage: page == 1 ? null : page - 1,
        currentPage: page,
        nextPage: page === totalPages ? null : page + 1,
        totalProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching products:", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";