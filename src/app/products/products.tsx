"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAllProducts } from "@/lib/features/products";

import { Button } from "@/components/ui/button";
import { Filter, PackageX } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FilterComponent from "./Filters";
import ProductCard from "@/components/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";

const ShimmerEffect = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

const ProductSkeleton = () => (
  <div className="relative overflow-hidden rounded-lg bg-gray-100 p-4 shadow-sm">
    <Skeleton height={200} className="mb-4" />
    <Skeleton width={150} height={20} className="mb-2" />
    <Skeleton width={100} height={16} className="mb-2" />
    <div className="flex justify-between items-center">
      <Skeleton width={60} height={16} />
      <Skeleton width={40} height={16} />
    </div>
    <ShimmerEffect />
  </div>
);

const Products = () => {
  const dispatch = useDispatch<any>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [productsData, setProductsData] = useState({
    items: [],
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchProducts = useCallback(
    async (filters: any = {}, page = 1) => {
      try {
        setIsLoading(true);

        console.log(filters, "filters");

        // Base query parameters from URL
        const baseParams: any = {
          limit: "16",
          page: page.toString(),
          search: searchParams.get("search") || "",
          category: filters?.category || searchParams.get("category") || "",
          isFeatured: searchParams.get("isFeatured") || "",
          sort: filters?.sort || searchParams.get("sort") || "",
        };

        // Price filters
        if (filters?.price) {
          baseParams.minPrice = filters.price[0]?.toString() || "0";
          baseParams.maxPrice = filters.price[1]?.toString() || "100000";
        }

        const queryParams = new URLSearchParams(baseParams);
        const { payload } = await dispatch(getAllProducts(queryParams));
        const data = payload;

        if (data.success) {
          const transformedProducts = data.products.map((product) => ({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            mrp: product.mrp,
            discount:
              product.discountPercentage ||
              Math.round(((product.mrp - product.price) / product.mrp) * 100),
            stockQuantity: product.stockQuantity,
            category: product.category,
            unit: product.unit,
            image: product.img,
            rating: product.rating?.avgRating || 0,
            numReviews: product.rating?.numReviews || 0,
            isFeatured: product.isFeatured,
          }));

          setProductsData({
            items: transformedProducts,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
          });
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams]
  );

  useEffect(() => {
    fetchProducts(currentFilters, 1);
  }, [searchParams, fetchProducts]);

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    fetchProducts(filters, 1);
  };

  const handlePageChange = (page) => {
    fetchProducts(currentFilters, page);

    // Scroll to top of products when changing page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderPaginationItems = () => {
    const { currentPage, totalPages } = productsData;
    const items = [];

    // Logic for showing pagination items
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={
                currentPage === i
                  ? "bg-black text-white hover:bg-gray-800"
                  : "hover:bg-gray-100"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // Display a category indicator if we're filtering by category
  const categoryName = searchParams.get("category");
  const isFeatured = searchParams.get("isFeatured") === "true";
  const searchTerm = searchParams.get("search");

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {categoryName
                ? `${categoryName}`
                : isFeatured
                ? "Featured Products"
                : searchTerm
                ? `Search Results: "${searchTerm}"`
                : "All Products"}
            </h1>

            {productsData.items.length > 0 && !isLoading && (
              <p className="text-gray-500">
                {productsData.items.length} product
                {productsData.items.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          <div className="mb-6 ">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-green-700 hover:bg-green-500 text-white"
            >
              <Filter className="md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Filters</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <FilterComponent
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilters={handleApplyFilters}
          />

          <div className="flex-1 md:pl-4">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array(12)
                  .fill(null)
                  .map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
              </div>
            ) : productsData.items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {productsData.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {productsData.totalPages > 1 && (
                  <Pagination className="mt-12">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(productsData.currentPage - 1)
                          }
                          className={
                            productsData.currentPage === 1
                              ? "pointer-events-none opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(productsData.currentPage + 1)
                          }
                          className={
                            productsData.currentPage === productsData.totalPages
                              ? "pointer-events-none opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <PackageX size={48} className="text-gray-400 mb-4" />
                <p className="text-xl font-semibold text-gray-600">
                  No products found
                </p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
