"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [productsData, setProductsData] = useState({
    items: [],
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const callGetProducts = async (filters: any = {}, page = 1) => {
    const queryParams = new URLSearchParams({
      limit: "16",
      page: page.toString(),
      categoryId: searchParams.get("categoryId") || "",
      search: searchParams.get("search") || "",
      parentCategoryId: searchParams.get("parentCategoryId") || "",
      latestProduct: searchParams.get("latestProduct") || "",
      featureProduct: searchParams.get("featureProduct") || "",
      bestsellerProduct: searchParams.get("bestsellerProduct") || "",
      sort: filters?.sort || "",
      percentageOff: filters?.discount?.value?.toString() || "",
      material: JSON.stringify(filters.material || []),
      colors: JSON.stringify(filters.color || []),
      sizes: JSON.stringify(filters.size || []),
      minPrice: filters?.price?.[0]?.toString() || "0",
      maxPrice: filters?.price?.[1]?.toString() || "100000",
    });

    try {
      setIsLoading(true);

      const { payload } = await dispatch(getAllProducts(queryParams));
     

      if (payload.success) {
        const data = {
          currentPage: payload.currentPage,
          totalPages: payload.totalPages,
          items: payload.products.map((item) => ({
            id: item._id,
            name: item.name,
            rating: item.rating.star,
            offerPrice: item.sizes[0].offerPrice,
            actualPrice: item.actualPrice,
            reviewCount: item.rating.ratedBy,
            brand: "",
            color: item.color,
            colors: item.colors.map((color) => ({
              name: color.name,
              class: `bg-${color.name}`,
              id: color._id,
            })),
            sizes: item.sizes.map((size) => ({
              type: size.size,
              stock: size.stock,
              price: size.offerPrice,
              id: size._id,
            })),
            sku: item.sku,
            image: item.img,
            best: item.bestsellerProduct,
            featured: item.featureProduct,
            latest: item.latestProduct,
            stock: item.stock,
          })),
        };

        setProductsData(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetProducts();
  }, [searchParams]);

  const handleApplyFilters = (filters) => {
    callGetProducts(filters);
  };

  const handlePageChange = (page) => {
    callGetProducts({}, page);
  };
  const renderPaginationItems = () => {
    const { currentPage, totalPages } = productsData;
    const items = [];

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

  return (
    <div className="bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        <div className="mb-4  left-0 -top-20">
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-secondary-900 hover:bg-secondary-950"
          >
            <Filter className="md:mr-2 h-4 w-4" />
            <span className="hidden md:block"> Filters </span>
          </Button>
        </div>

        <div className="flex">
          <FilterComponent
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilters={handleApplyFilters}
          />
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array(12)
                  .fill(null)
                  .map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
              </div>
            ) : productsData.items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 md:gap-8">
                  {productsData.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(productsData.currentPage - 1)
                        }
                        className={
                          productsData.currentPage === 1
                            ? "pointer-events-none opacity-50 "
                            : ""
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
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
