import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import AOS from "aos";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import TestimonialItem from "../../Components/TestimonialItem/TestimonialItem";
import { useQuery, useEffect } from "../../shared/hooks";
import { like, dislike, love } from "../../shared/images";
import { LoadingOne } from "../../shared/components";
import styles from "./HomeTestimonalsSlider.module.css";

const HomeTestimonalsSlider = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () =>
      mainFormsHandlerTypeRaw({ type: "testimonials", isLimited: true }),
    staleTime: Infinity,
  });

  useEffect(() => {
    AOS.init({ disable: "mobile" });
  });

  return (
    <>
      {!data || (isFetching && <LoadingOne />)}
      {data?.data?.length > 0 ? (
        <>
          <div className={styles.like_emotion}>
            <img src={like} alt="like" className="w-100" />
          </div>
          <div className={styles.love_emotion}>
            <img src={love} alt="love" className="w-100" />
          </div>
          <div className={styles.dislike_emotion}>
            <img src={dislike} alt="dislike" className="w-100" />
          </div>
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: true,
            }}
            loop={true}
            navigation={true}
            modules={[Navigation, Autoplay]}
            className={`${styles.Swiper_container} mySwiper`}
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            {data?.data?.map((content) => (
              <SwiperSlide key={content?._id} className={styles.slide}>
                <TestimonialItem content={content} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : null}
    </>
  );
};

export default HomeTestimonalsSlider;
