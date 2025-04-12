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
    const page = parseInt(url.searchParams.get("page") as string) || 1; // Default to page 1
    const limit = parseInt(url.searchParams.get("limit") as string) || 10; // Default to 10 items per page
    const sort = url.searchParams.get("sort"); // For sorting
    const minPrice = parseFloat(url.searchParams.get("minPrice") as string);
    const maxPrice = parseFloat(url.searchParams.get("maxPrice") as string);
    const hide = url.searchParams.get("hide") === 'false';

    // Build the search criteria
    const searchCriteria: any = {};

    if (search) {
      const regex = new RegExp(search, "i"); // 'i' for case-insensitive
      searchCriteria.$or = [
        { name: regex },
        { description: regex },
        { category: regex }
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (hide) {
      searchCriteria.hide = !hide;
    }

    if (!isNaN(minPrice)) {
      searchCriteria.price = { ...searchCriteria.price, $gte: minPrice };
    }

    if (!isNaN(maxPrice)) {
      searchCriteria.price = { ...searchCriteria.price, $lte: maxPrice };
    }

    // Determine sorting
    let sortCriteria = {};
    if (sort === "newest") {
      sortCriteria = { createdAt: -1 }; // Sort by newly arrived
    } else if (sort === "priceHighToLow") {
      sortCriteria = { price: -1 }; // Sort by price high to low
    } else if (sort === "priceLowToHigh") {
      sortCriteria = { price: 1 }; // Sort by price low to high
    }

    // Calculate the skip value
    const skip = (page - 1) * limit;

    // Execute the query
    const products = await Product.find(searchCriteria)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // Get the total count of products matching the search criteria
    const totalProducts = await Product.countDocuments(searchCriteria);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);
    
    return NextResponse.json(
      {
        success: true,
        msg: "Success",
        products,
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