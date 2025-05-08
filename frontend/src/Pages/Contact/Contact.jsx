import styles from "./Contact.module.css";
import ContactForm from "./ContactForm";
import { FontAwesomeIcon } from "../../shared/index";
import {
  faCaretDown,
  faEnvelope,
  faMapMarkedAlt,
  faPhoneFlip,
} from "../../shared/constants";
import { useTranslation, useSelector } from "../../shared/hooks";
import { ContactsIcon } from "../../shared/components";
import { Row, Col } from "../../shared/bootstrap";

const Contact = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const configs = useSelector((state) => state.configs);

  return (
    <section className="over my-5" id="Contact">
      <Row>
        <Col md={5} className={styles.contact_info}>
          <div className={`${styles.contact_info_layer} p-4`}>
            <div
              className={
                isArLang ? styles.contact_links_ar : styles.contact_links
              }
            >
              <div className="d-flex mb-3">
                <div className={isArLang ? "ms-3" : "me-3"}>
                  <FontAwesomeIcon
                    className={styles.contact_info_icon}
                    icon={faPhoneFlip}
                  />
                </div>
                <div className="d-flex flex-column">
                  <h6 className={styles.data_link_h6}>{key("phone")} :</h6>
                  <p className={styles.data_link_p}>
                    {isArLang
                      ? `${configs?.whatsappNumber}+`
                      : `+${configs?.whatsappNumber}`}
                  </p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className={isArLang ? "ms-3" : "me-3"}>
                  <FontAwesomeIcon
                    className={styles.contact_info_icon}
                    icon={faEnvelope}
                  />
                </div>
                <div className="d-flex flex-column">
                  <h6 className={styles.data_link_h6}>{key("email")} :</h6>
                  <p className={styles.data_link_p}>{configs?.email}</p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className={isArLang ? "ms-3" : "me-3"}>
                  <FontAwesomeIcon
                    className={styles.contact_info_icon}
                    icon={faMapMarkedAlt}
                  />
                </div>
                <div className="d-flex flex-column">
                  <h6 className={styles.data_link_h6}>{key("address")} :</h6>
                  <p className={styles.data_link_p}>
                    4655 Elwehda Street, Imbaba, Illinois <br />
                    4961 Wescam Court, Reno, Nevada
                  </p>
                </div>
              </div>

              <div className={styles.contact_info_icons}>
                <ContactsIcon type="two" />
              </div>
            </div>
          </div>
        </Col>
        <Col md={7} className="py-5">
          <div className="special_main_color text-center m-auto my-5">
            <h6 className={styles.sub_title}>{key("getInTouch")}</h6>
            <h2 className={styles.form_title}>{key("contactUs")}</h2>
            <FontAwesomeIcon icon={faCaretDown} />
          </div>
          <ContactForm />
        </Col>
      </Row>
    </section>
  );
};

export default Contact;
