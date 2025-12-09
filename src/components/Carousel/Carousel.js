import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Carousel.scss";

const slides = [
  { id: 1, title: "배너 1", desc: "이곳에 주요 메시지를 노출하세요." },
  { id: 2, title: "배너 2", desc: "슬라이드를 넘겨 다양한 정보를 전달합니다." },
  { id: 3, title: "배너 3", desc: "모바일/데스크탑 반응형 지원." },
];

const Carousel = () => {
  return (
    <div className="guide-preview guide-preview--carousel">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="carousel-card">
              <h4>{slide.title}</h4>
              <p>{slide.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;

