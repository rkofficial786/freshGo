import React from "react";
import ProductPage from "./ProductDetails";
import { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const { name } = params;

  const formattedName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return {
    title: `${formattedName}`,
  };
}

const page = ({ params }) => {
  return (
    <div>
      <ProductPage params={params} />
    </div>
  );
};

export default page;
