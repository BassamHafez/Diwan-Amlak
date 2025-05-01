import Row from "react-bootstrap/esm/Row";
import EdietPenIcon from "../../../Components/UI/Buttons/EdietPenIcon";
import Col from "react-bootstrap/esm/Col";
import styles from "./UserProfile.module.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import UpdateAccountData from "./ProfileForms/UpdateAccountData";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import officeImg from "../../../assets/office.webp";

const Office = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  let myAccount = accountInfo?.account;

  return (
    <>
      {myAccount?.name ? (
        <>
          <div className={`${styles.container} d-flex align-items-center`}>
            <div className={styles.office_icon}>
              <FontAwesomeIcon icon={faBuildingColumns} />
            </div>
            <div className={isArLang ? "me-3" : "ms-3"}>
              <h5 className="m-0 fw-bold">{myAccount?.name}</h5>
            </div>
          </div>
          <div className={styles.container}>
            <EdietPenIcon onClick={() => setShowUpdateModal(true)} />
            <h4>{key("officeInfo")}</h4>
            <Row>
              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("name")}</span>
                  <h6>{myAccount?.name || key("notExist")}</h6>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.info}>
                  <span>{key("phone")}</span>
                  <h6>{myAccount?.phone || key("notExist")}</h6>
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("region")}</span>
                  <h6>{myAccount?.region || key("notExist")}</h6>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.info}>
                  <span>{key("city")}</span>
                  <h6>{myAccount?.city || key("notExist")}</h6>
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("address")}</span>
                  <h6>{myAccount?.address || key("notExist")}</h6>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.info}>
                  <span>{key("taxNumber")}</span>
                  <h6>{myAccount?.taxNumber || key("notExist")}</h6>
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("commercialRecord")}</span>
                  <h6>
                    {myAccount?.commercialRecord
                      ? myAccount?.commercialRecord
                      : key("notExist")}
                  </h6>
                </div>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <div className="d-flex align-items-center justify-content-center flex-column">
          <img className={styles.officeImg} src={officeImg} alt="officeImg" />
          <h5 className="my-4 text-secondary">{key("updateYourOffice")}</h5>
          <ButtonOne
            text={`${key("update")} ${key("office")}`}
            onClick={() => setShowUpdateModal(true)}
          />
        </div>
      )}

      {showUpdateModal && (
        <ModalForm
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          modalSize="lg"
        >
          <UpdateAccountData
            hideModal={() => setShowUpdateModal(false)}
            accountInfo={accountInfo}
          />
        </ModalForm>
      )}
    </>
  );
};

export default Office;
