import React, { useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

const InstagramPosts = ({ posts }) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);

  const muteAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
      }
    });
  };

  const handleToggleMute = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (activeAudioIndex === index) {
      if (videoRefs.current[index]) {
        videoRefs.current[index]!.muted = true;
      }
      setActiveAudioIndex(null);
      return;
    }

    muteAllVideos();

    if (videoRefs.current[index]) {
      videoRefs.current[index]!.muted = false;
      setActiveAudioIndex(index);
    }
  };

  return (
    <div className="w-full  mx-auto px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        onScroll={() => {
          muteAllVideos();
          setActiveAudioIndex(null);
        }}
      >
        <CarouselContent>
          {posts.map((post, index) => (
            <CarouselItem key={post._id} className="md:basis-1/2 lg:basis-1/4">
              <Card className="border-0">
                <CardContent className="p-0 relative">
                  {post.fileType === "image" ? (
                    <img
                      src={post.fileLink}
                      alt={`Post ${index + 1}`}
                      className="w-full h-[500px] object-cover rounded-lg"
                    />
                  ) : (
                    <div className="relative">
                      <video
                        ref={(el: any) => (videoRefs.current[index] = el)}
                        src={post.fileLink}
                        className="w-full h-[500px] object-cover rounded-lg"
                        loop
                        muted={activeAudioIndex !== index}
                        playsInline
                        autoPlay
                      />
                      <div className="absolute bottom-4 right-4">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                          onClick={(e) => handleToggleMute(e, index)}
                        >
                          {activeAudioIndex === index ? (
                            <Volume2 className="h-4 w-4" />
                          ) : (
                            <VolumeX className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-4 text-white hover:text-white/80 transition-colors"
                  >
                    <div className="bg-black/50 p-2 rounded-full">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default InstagramPosts;
