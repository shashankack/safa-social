import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Box } from "@mui/material";

// Custom styles for Swiper navigation and pagination
const swiperStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    color: #da6c81 !important;
  }
  
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 20px !important;
  }
  
  .swiper-pagination-bullet {
    background: #da6c81 !important;
    opacity: 0.5;
  }
  
  .swiper-pagination-bullet-active {
    background: #da6c81 !important;
    opacity: 1;
  }
`;

const VideoSection = ({ videos = [] }) => {
  return (
    <>
      {/* Inject custom styles */}
      <style>{swiperStyles}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        style={{
          width: "100%",
          padding: "0 40px 40px 40px",
        }}
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            <Box
              component="video"
              src={video}
              controls
              preload="metadata"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default VideoSection;
