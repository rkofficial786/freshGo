"use client";

import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaInstagram, FaPlay, FaPause } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch } from "react-redux";
import { getInstaPosts } from "@/lib/features/insta";
import toast from "react-hot-toast";
import InstagramPosts from "./InstaPosts";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface Post {
  _id: string;
  url: string;
  fileType: string;
  fileLink: string;
}

const InstagramPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [instaData, setInstaData] = useState<Post[]>([]);

  const callGetInstaContentApi = async () => {
    try {
      const { payload }: any = await dispatch(getInstaPosts());

      if (payload?.success === true) {
        setInstaData(payload.instagramDetails);
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    callGetInstaContentApi();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl d text-center  ">INSTAGRAM POSTS</h2>
        <Button variant="link" className="text-primary hover:bg-none group">
          Follow Us{" "}
          <ChevronRight
            className="ml-2 group-hover:translate-x-1 transition-all ease-in-out duration-300"
            size={20}
          />
        </Button>
      </div>
      <InstagramPosts posts={instaData} />
    </div>
  );
};

export default InstagramPage;
