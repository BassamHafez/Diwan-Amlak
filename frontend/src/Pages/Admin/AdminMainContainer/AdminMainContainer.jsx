import { useTranslation, useState, useCallback } from "../../../shared/hooks";
import {
  AdminNav,
  MainFooter,
  LogOutModal,
  ButtonOne,
  LanguageChanger,
} from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const AdminMainContainer = (props) => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const hideLogoutModalHandler = useCallback(() => {
    setLogoutModalShow(false);
  }, []);

  const showLogoutModalHandler = useCallback(() => {
    setLogoutModalShow(true);
  }, []);

  return (
    <>
      <div
        className=" py-2 px-3"
        style={{
          backgroundColor: "var(--sub_white)",
          minHeight: "100vh",
        }}
      >
        <Row>
          <Col lg={2} md={3}>
            <AdminNav />
          </Col>
          <Col lg={10} md={9}>
            <div className=" d-flex justify-content-between align-items-center flex-wrap mb-2 px-2">
              <div
                className={`d-flex align-items-center flex-wrap ${
                  isArLang ? "me-auto" : "ms-auto"
                }`}
              >
                <LanguageChanger />
                <ButtonOne
                  onClick={showLogoutModalHandler}
                  classes="m-2 bg-danger"
                  text={key("logout")}
                  borderd={true}
                />
              </div>
            </div>
            <div className="admin_body height_container">{props.children}</div>
          </Col>
        </Row>
      </div>
      <MainFooter />

      {logoutModalShow && (
        <LogOutModal show={logoutModalShow} onHide={hideLogoutModalHandler} />
      )}
    </>
  );
};

export default AdminMainContainer;
