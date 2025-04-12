import React from "react";
import Banner from "./Banner";
import Category from "./Category";
import Showcase from "./Showcase";
import { Separator } from "@/components/ui/separator";
import Featured from "./Featured";
import InstagramPage from "./Insta";

const page = () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Showcase />
      
      <Separator />
      <Featured />
      <Separator />
   
    </div>
  );
};

export default page;
