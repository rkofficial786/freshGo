import React from "react";
import Banner from "./Banner";
import Category from "./Category";
import NewArrival from "./NewArrival";
import { Separator } from "@/components/ui/separator";
import Featured from "./Featured";
import InstagramPage from "./Insta";

const page = () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <Category />
      <Separator />
      <NewArrival />
      <Featured />
      <Separator />
      <InstagramPage/>
    </div>
  );
};

export default page;
