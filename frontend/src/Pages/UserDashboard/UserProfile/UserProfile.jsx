import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import styles from "./UserProfile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownShortWide,
  faBuildingColumns,
  faShieldHalved,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

import { faUser, faStar } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import ProfileMain from "./ProfileMain";
import CustomPackages from "../../Packages/CustomPackages";
import { useState } from "react";
import Office from "./Office";
import MySubscription from "./MySubscription";
import ProfileSecurity from "./ProfileSecurity";
import Members from "./Members";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import { useSelector } from "react-redux";

const UserProfile = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const [activeLink, setActivePage] = useState("main");
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const iconMArginClass = isArLang ? "ms-2" : "me-2";

  const chooseActiveActive = (type) => {
    setActivePage(type);
  };

  return (
    <div
      className="height_container px-md-3 py-5"
      style={{ backgroundColor: "var(--sub_white)" }}
    >
      <Row className="g-3">
        <Col md={3} xl={2}>
          <div className={styles.filter_list}>
            <div className={styles.filter_title}>
              <FontAwesomeIcon
                className={isArLang ? "ms-2" : "me-2"}
                icon={faArrowDownShortWide}
              />
              <h5>{key("setting")}</h5>
            </div>
            <ul className={styles.list_links}>
              <li
                className={activeLink === "main" ? styles.active : ""}
                onClick={() => setActivePage("main")}
              >
                <FontAwesomeIcon className={iconMArginClass} icon={faUser} />
                <span>{key("main")}</span>
              </li>
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["UPDATE_ACCOUNT"]}
                noCheckingForExpired={true}
              >
                <li
                  className={activeLink === "office" ? styles.active : ""}
                  onClick={() => setActivePage("office")}
                >
                  <FontAwesomeIcon
                    className={iconMArginClass}
                    icon={faBuildingColumns}
                  />
                  <span>{key("office")}</span>
                </li>
                {accountInfo?.account?.owner === profileInfo?._id && (
                  <li
                    className={activeLink === "members" ? styles.active : ""}
                    onClick={() => setActivePage("members")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className={`${iconMArginClass} bi bi-people`}
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                    </svg>
                    <span>{key("admins")}</span>
                  </li>
                )}
                <li
                  className={activeLink === "subscription" ? styles.active : ""}
                  onClick={() => setActivePage("subscription")}
                >
                  <FontAwesomeIcon className={iconMArginClass} icon={faStar} />
                  <span>{key("customPackage")}</span>
                </li>
              </CheckPermissions>
              <li
                className={activeLink === "mySubscription" ? styles.active : ""}
                onClick={() => setActivePage("mySubscription")}
              >
                <FontAwesomeIcon
                  className={iconMArginClass}
                  icon={faUpRightFromSquare}
                />
                <span>{key("mySubscription")}</span>
              </li>
              <li
                className={activeLink === "security" ? styles.active : ""}
                onClick={() => setActivePage("security")}
              >
                <FontAwesomeIcon
                  className={iconMArginClass}
                  icon={faShieldHalved}
                />
                <span>{key("security")}</span>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9} xl={10} className={styles.content_container}>
          {activeLink === "main" && <ProfileMain />}
          {activeLink === "office" && <Office />}
          {activeLink === "mySubscription" && (
            <MySubscription chooseActiveActive={chooseActiveActive} />
          )}
          {activeLink === "subscription" && <CustomPackages />}
          {activeLink === "security" && <ProfileSecurity />}
          {activeLink === "members" && <Members />}
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
