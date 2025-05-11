import styles from "./Hero.module.css";
import { imgHash } from "../Logic/StaticLists";
import { Row, Col } from "../../shared/bootstrap";
import { ButtonTwo, ImgComponent } from "../../shared/components";
import { circles, dash } from "../../shared/images";
import { useTranslation, useNavigate } from "../../shared/hooks";

const Hero = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className={styles.home_header}>
      <Row className={styles.row_div}>
        <Col
          lg={6}
          className="d-flex justify-content-center align-items-center"
        >
          <div className={styles.caption}>
            <h1>
              {!isArLang && <span>M</span>}
              {key("homeTitle")}
            </h1>
            <p>{key("homeSubTitle")}</p>
            <ButtonTwo
              onClick={() => navigate("/login")}
              text={key("getStarted")}
            />
          </div>
        </Col>
        <Col lg={6} className={styles.header_imgs}>
          <img className={styles.cirlces} src={circles} alt="cirlce_shape" />
          <img className={styles.dash} src={dash} alt="cirlce_shape" />
          <div className={styles.img1_position}>
            <div className={styles.header1_img}>
              <div className={styles.overlay}></div>
              <ImgComponent
                src={`${import.meta.env.VITE_Host}/designs/banner1.webp`}
                width="20.625rem"
                height="25rem"
                hash={imgHash.hero1}
                alt="heroBuilding"
                lazyLoad={false}
              />
            </div>
          </div>

          <div className={styles.img2_position}>
            <div className={styles.header2_img}>
              <div className={styles.overlay}></div>
              <ImgComponent
                src={`${import.meta.env.VITE_Host}/designs/banner2.webp`}
                width="25rem"
                height="18.75rem"
                hash={imgHash.hero2}
                alt="heroBuilding2"
                lazyLoad={false}
              />
            </div>
          </div>
        </Col>
      </Row>
      <div className={styles.waves}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d39833"
            fillOpacity="0.1"
            d="M0,224L48,229.3C96,235,192,245,288,245.3C384,245,480,235,576,245.3C672,256,768,288,864,266.7C960,245,1056,171,1152,154.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </header>
  );
};

export default Hero;
