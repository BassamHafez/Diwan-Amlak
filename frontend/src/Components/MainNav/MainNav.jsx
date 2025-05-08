import styles from "./MainNav.module.css";
import CheckPermissions from "../CheckPermissions/CheckPermissions";
import { NavLink, FontAwesomeIcon } from "../../shared/index";
import {
  faCircleInfo,
  faEnvelope,
  faHouse,
  faBuilding,
  faLayerGroup,
  faClipboard,
  faUsers,
  faScroll,
} from "../../shared/constants";
import {
  useSelector,
  useTranslation,
  useCallback,
  useMemo,
  useState,
  useNavigate,
} from "../../shared/hooks";
import { Container, Navbar, Nav } from "../../shared/bootstrap";
import {
  SettingOffCanvas,
  ButtonOne,
  LanguageChanger,
} from "../../shared/components";
import { logo, avatar } from "../../shared/images";

const MainNav = () => {
  const [showSetting, setShowSetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const generalLinks = useMemo(
    () => [
      { to: "/", label: "home", icon: faHouse },
      { to: "/about", label: "about", icon: faCircleInfo },
      { to: "/contact", label: "contact", icon: faEnvelope },
      { to: "/packages", label: "packages", icon: faLayerGroup },
    ],
    []
  );

  const loggedInLinks = useMemo(
    () => [
      { to: "/dashboard", label: "dashboard", icon: faHouse },
      { to: "/properties", label: "compounds", icon: faBuilding },
      { to: "/contacts", label: "contacts", icon: faUsers },
      { to: "/tasks", label: "tasks", icon: faClipboard },
      { to: "/packages", label: "packages", icon: faLayerGroup },
    ],
    []
  );

  const handleShowAddModal = useCallback(() => setShowSetting(true), []);
  const handleHideAddModal = useCallback(() => setShowSetting(false), []);

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary main_navbar"
        onToggle={(expanded) => setIsCollapsed(expanded)}
        expanded={isCollapsed}
      >
        <Container fluid>
          <Navbar.Brand href="/">
            <img src={logo} className={styles.logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className={styles.nav_collapse}>
            <Nav
              className={`${isArLang ? "ms-auto" : "me-auto"} my-lg-0 ${
                styles.nav_list
              }`}
              navbarScroll
            >
              {isLogin ? (
                <>
                  {loggedInLinks?.map((link, index) => (
                    <NavLink
                      key={`${link.to}_${index}`}
                      onClick={() => isCollapsed && setIsCollapsed(false)}
                      className={({ isActive }) =>
                        isActive ? styles.active : undefined
                      }
                      to={link.to}
                      end
                    >
                      <span>
                        <FontAwesomeIcon
                          className={`${styles.nav_icon} ${
                            isArLang ? styles.ar_icon : styles.en_icon
                          }`}
                          icon={link.icon}
                        />
                        {t(link.label)}
                      </span>
                    </NavLink>
                  ))}

                  <CheckPermissions
                    btnActions={["CONTRACTS_REPORTS", "FINANCIAL_REPORTS"]}
                    noCheckingForExpired={true}
                    profileInfo={profileInfo}
                  >
                    <NavLink
                      onClick={() => isCollapsed && setIsCollapsed(false)}
                      className={({ isActive }) =>
                        isActive ? styles.active : undefined
                      }
                      to={"/reports"}
                    >
                      <span>
                        <FontAwesomeIcon
                          className={`${styles.nav_icon} ${
                            isArLang ? styles.ar_icon : styles.en_icon
                          }`}
                          icon={faScroll}
                        />
                        {t("reports")}
                      </span>
                    </NavLink>
                  </CheckPermissions>
                </>
              ) : (
                <>
                  {generalLinks?.map((link, index) => (
                    <NavLink
                      key={`${link.to}_${index}`}
                      onClick={() => isCollapsed && setIsCollapsed(false)}
                      className={({ isActive }) =>
                        isActive ? styles.active : undefined
                      }
                      to={link.to}
                      end
                    >
                      <span>
                        <FontAwesomeIcon
                          className={`${styles.nav_icon} ${
                            isArLang ? styles.ar_icon : styles.en_icon
                          }`}
                          icon={link.icon}
                        />
                        {t(link.label)}
                      </span>
                    </NavLink>
                  ))}
                </>
              )}
            </Nav>
            <div className={styles.nav_controller}>
              <LanguageChanger />
              {!isLogin ? (
                <div className="d-flex align-items-center justify-content-center flex-wrap">
                  <ButtonOne
                    onClick={() => {
                      navigate("register");
                      isCollapsed && setIsCollapsed(false);
                    }}
                    classes="m-2"
                    color="white"
                    text={t("register")}
                    borderd={true}
                  />
                  <ButtonOne
                    onClick={() => {
                      navigate("login");
                      isCollapsed && setIsCollapsed(false);
                    }}
                    classes="m-2"
                    text={t("login")}
                    borderd={true}
                  />
                </div>
              ) : (
                <div className={styles.avatar} onClick={handleShowAddModal}>
                  <img
                    src={
                      profileInfo?.photo
                        ? `${import.meta.env.VITE_Host}${profileInfo?.photo}`
                        : avatar
                    }
                    alt="profile_pic"
                  />
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showSetting && (
        <SettingOffCanvas show={showSetting} handleClose={handleHideAddModal} />
      )}
    </>
  );
};

export default MainNav;
