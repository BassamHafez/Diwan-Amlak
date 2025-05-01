import styles from "./Footer.module.css";
import { logo, mada, masterCard, visa, applePay } from "../../shared/images";
import { Link, FontAwesomeIcon } from "../../shared/index";
import {
  faInstagram,
  faWhatsapp,
  faXTwitter,
  faEnvelope,
} from "../../shared/constants";
import { useSelector, useTranslation } from "../../shared/hooks";
import { Col, Row } from "../../shared/bootstrap";

const MainFooter = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const configs = useSelector((state) => state.configs);

  return (
    <footer className={styles.footer}>
      <div className="container w-100 pb-4">
        <Row>
          <Col lg={4}>
            <div className={styles.footer_logo}>
              <img src={logo} alt="footerLogo" width="100%" />
            </div>
          </Col>
          <Col lg={4}>
            <div className={styles.footer_head}>
              <h4>{key("pages")}</h4>
            </div>
            <div className={styles.links_Box}>
              <div>
                <Link to={"/"} className={styles.footer_link}>
                  {key("home")}
                </Link>
                <Link to={"/about"} className={styles.footer_link}>
                  {key("about")}
                </Link>
                <Link to={"/contact"} className={styles.footer_link}>
                  {key("contact")}
                </Link>
                <Link to={"/packages"} className={styles.footer_link}>
                  {key("packages")}
                </Link>
              </div>
              <div
                className={`${isArLang ? "me-5" : "ms-5"} ${styles.second_row}`}
              >
                <Link to={"/terms-conditions"} className={styles.footer_link}>
                  {key("terms")}
                </Link>
                <Link to={"/help"} className={styles.footer_link}>
                  {key("help")}
                </Link>
              </div>
            </div>
          </Col>
          <Col
            lg={4}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <div className={styles.footer_head}>
              <h4>Contact Us</h4>
            </div>
            <div>
              <div className={styles.footer_links}>
                {configs?.whatsappNumber && (
                  <Link
                    target="_blank"
                    to={`https://wa.me/${configs?.whatsappNumber}`}
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </Link>
                )}
                {configs?.instagramLink && (
                  <Link target="_blank" to={`${configs?.instagramLink}`}>
                    <FontAwesomeIcon icon={faInstagram} />
                  </Link>
                )}

                {configs?.email && (
                  <Link target="_blank" to={`mailto:${configs?.email}`}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </Link>
                )}
                {configs?.twitterLink && (
                  <Link target="_blank" to={`${configs?.twitterLink}`}>
                    <FontAwesomeIcon icon={faXTwitter} />
                  </Link>
                )}
              </div>

              <div className={styles.footer_payment}>
                <div className={styles.icon_div}>
                  <img src={mada} alt="mada" />
                  <img src={masterCard} alt="masterCard" />
                  <img src={visa} alt="visa" />
                  <img src={applePay} alt="applePay" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.footer_p}>
        <p> © 2025 {key("copyRights")}</p>
      </div>
    </footer>
  );
};

export default MainFooter;
