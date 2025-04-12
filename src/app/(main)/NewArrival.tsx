"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ButtonMain from "@/components/ButtonMain";
import { useDispatch } from "react-redux";
import { getAllProducts } from "@/lib/features/products";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/components/skeletons/skeletonNewArrival";

const NewArrival = () => {
  const dispatch = useDispatch<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [productsData, setProductsData] = useState<any>({});
  const router = useRouter();

  const callGetProducts = async () => {
    const queryParams = new URLSearchParams({
      limit: "8",
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
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="p-4 pt-2">
        <h2 className="text-3xl  text-center mb-12">NEW ARRIVALS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productsData?.items?.map((product, productIndex) => (
            <ProductCard key={productIndex} product={product} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <ButtonMain
            arrow={true}
            onClick={() => router.push(`/products?latestProduct=true`)}
            className="!rounded-full !bg-secondary-950 !text-nowrap !flex"
          >
            View More
          </ButtonMain>
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
