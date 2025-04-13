import React from "react";
import Banner from "./Banner";
import Category from "./AllProducts";
import Showcase from "./Showcase";
import { Separator } from "@/components/ui/separator";
import Featured from "./Featured";
import InstagramPage from "./Insta";
import AllProducts from "./AllProducts";

const page = () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Showcase />
      
      <Separator />
      <Featured />
      <Separator />
      <AllProducts/>
   
    </div>
  );
};

export default page;
