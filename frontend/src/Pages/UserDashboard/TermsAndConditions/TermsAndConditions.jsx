import AdminTerms from "../../Admin/AdminTerms/AdminTerms";
import { Row, Col } from "../../../shared/bootstrap";
import { terms } from "../../../shared/images";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ContactsIcon } from "../../../shared/components";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <div className="height_container">
      <Row>
        <Col md={8}>
          <div>
            <AdminTerms isUserPage={true} />
          </div>
        </Col>
        <Col
          md={4}
          className="d-flex align-items-center justify-content-center flex-column"
          style={{ backgroundColor: "#FFFCF5" }}
        >
          <div className="standard_img">
            <img src={terms} alt="terms" />
          </div>
          <span className="text-secondary text-center mini_word">
            {t("helpMsg")} <Link to={"/contact"}>{t("here")}</Link> <br />
            {t("or")} {t("contactUsLinks")}
          </span>
          <div className="mt-5">
            <ContactsIcon />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TermsAndConditions;
