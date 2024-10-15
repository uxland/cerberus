import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import "./index.css";

export const Slider = ({children}) => {
  return (
    <div className="w-full h-[400px]">
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        {React.Children.map(children, (child) => (
          <SwiperSlide className="flex items-center">{child}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
