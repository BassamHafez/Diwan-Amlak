import styles from "./UserProfile.module.css";
import UpdateUserData from "./ProfileForms/UpdateUserData";
import { Row, Col, Alert } from "../../../shared/bootstrap";
import { useState, useTranslation } from "../../../shared/hooks";
import { EdietPenIcon, ModalForm } from "../../../shared/components";
import { avatar } from "../../../shared/images";

const UserDetailsBlock = ({ profileInfo, isProfile }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();

  return (
    <>
      <div className={`${styles.container} d-flex align-items-center`}>
        <div className={styles.avatar}>
          <img
            src={
              profileInfo?.photo
                ? `${import.meta.env.VITE_Host}${profileInfo?.photo}`
                : avatar
            }
            alt="profile_pic"
          />
        </div>
        <div className={isArLang ? "me-3" : "ms-3"}>
          <h5 className="m-0 fw-bold">{profileInfo?.name}</h5>
          <span className="mini_word">{profileInfo?.email}</span>
        </div>
      </div>
      <div className={styles.container}>
        {isProfile && <EdietPenIcon onClick={() => setShowUpdateModal(true)} />}
        <h4>{key("personalInfo")}</h4>
        <Row>
          <Col md={4}>
            <div className={styles.info}>
              <span>{key("name")}</span>
              <h6>{profileInfo?.name}</h6>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.info}>
              <span>{key("phone")}</span>
              <h6>{profileInfo?.phone}</h6>
            </div>
          </Col>
          <Col md={4}>
            <div className={styles.info}>
              <span>{key("email")}</span>
              <h6>{profileInfo?.email}</h6>
            </div>
          </Col>
          {!isProfile && (
            <>
              <Col md={6}>
                <div className={styles.info}>
                  <span>{key("accountID")}</span>
                  <h6>{profileInfo?.account}</h6>
                </div>
              </Col>
              {profileInfo?.phoneVerified === false && (
                <Col md={12}>
                  {<Alert variant="warning">{key("phoneNotVerified")}</Alert>}
                </Col>
              )}
            </>
          )}
        </Row>
      </div>
      {showUpdateModal && (
        <ModalForm
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          modalSize="lg"
        >
          <UpdateUserData
            hideModal={() => setShowUpdateModal(false)}
            profileInfo={profileInfo}
          />
        </ModalForm>
      )}
    </>
  );
};

export default UserDetailsBlock;
