import styles from "./Home.module.css";
import AOS from "aos";
import Packages from "../Packages/Packages";
import About from "../About/About";
import Contact from "../Contact/Contact";
import { useTranslation, useEffect, useNavigate } from "../../shared/hooks";
import {
  MainTitle,
  HomeTestimonalsSlider,
  ScrollTopBtn,
  Hero,
} from "../../shared/components";

const Home = () => {
  const { t: key } = useTranslation();
  const role = JSON.parse(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "user") {
      navigate("/dashboard");
    }
  }, [role, navigate]);

  useEffect(() => {
    AOS.init({ disable: "mobile" });
  }, []);

  return (
    <>
      <ScrollTopBtn />
      <Hero />
      <About />
      <section className="my-5 over">
        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <MainTitle title={key("packages")} />
          <h5 className="mb-5 mt-3 fw-bold h2">{key("choosePackage")}</h5>
          <Packages />
        </div>
      </section>

      <section className={styles.Testimonials}>
        <MainTitle title={key("testimonials")} />
        <HomeTestimonalsSlider />
      </section>
      <div data-aos="fade-up" data-aos-duration="1000" className="my-5">
        <Contact />
      </div>
    </>
  );
};

export default Home;
