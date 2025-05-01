import styles from "./About.module.css";
import AOS from "aos";
import { imgHash } from "../../Components/Logic/StaticLists";
import { useTranslation, useEffect, useMemo } from "../../shared/hooks";
import {
  ImgComponent,
  MainTitle,
  ScrollTopBtn,
  AccordionContent,
} from "../../shared/components";
import { Row, Col, Accordion } from "../../shared/bootstrap";
import { cityImg, logoWithCaption } from "../../shared/images";

const About = () => {
  const { t: key } = useTranslation();

  useEffect(() => {
    AOS.init({ disable: "mobile" });
  }, []);

  const accodionContentArr = useMemo(() => {
    const content = [
      { title: "section1Title1", desc: "section1Desc1" },
      { title: "section1Title2", desc: "section1Desc2" },
      { title: "section1Title3", desc: "section1Desc3" },
      { title: "section1Title4", desc: "section1Desc4" },
      { title: "section1Title5", desc: "section1Desc5" },
    ];
    return content?.map((item) => ({
      ...item,
      title: key(item.title),
      desc: key(item.desc),
    }));
  }, [key]);

  return (
    <>
      <ScrollTopBtn />

      <section className="my-5 py-4 over">
        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <MainTitle title={key("aboutUsTitle")} />
          <h2 className="mb-3 mt-3  fw-bold">{key("aboutPlatform")}</h2>
          <Row className="py-5">
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div
                className="w-100"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <ul className="text-start">
                  <li className={styles.sec2_list_item}>{key("sec2Li1")}</li>
                  <li className={styles.sec2_list_item}>{key("sec2Li2")}</li>
                </ul>
              </div>
            </Col>

            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.section2_img_side}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div className={styles.section2_logo_img}>
                  <img src={logoWithCaption} alt="logo" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section className="my-5 over">
        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <MainTitle title={key("features")} />
          <h2 className="mb-5 mt-3 fw-bold">{key("whuChooseUs")}</h2>
          <Row dir="ltr">
            <Col md={6}>
              <div className={styles.section1_img_side}>
                <div className={styles.section1_img}>
                  <ImgComponent
                    src={cityImg}
                    width="380px"
                    height="15.8125rem"
                    lazyLoad={true}
                    hash={imgHash.about2}
                    alt="cityImg"
                  />
                </div>
              </div>
            </Col>
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center p-4"
            >
              <div
                className="w-100"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <Accordion defaultActiveKey="0">
                  {accodionContentArr?.map((item, index) => (
                    <AccordionContent
                      key={index}
                      title={item.title}
                      eventKey={`${index}`}
                    >
                      <p className={styles.acc_p}>{item.desc}</p>
                    </AccordionContent>
                  ))}
                </Accordion>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default About;
