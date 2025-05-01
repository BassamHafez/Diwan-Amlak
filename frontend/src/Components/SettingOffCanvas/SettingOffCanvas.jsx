import styles from "./SettingOffCanvas.module.css";
import { avatar } from "../../shared/images";
import { Link, FontAwesomeIcon } from "../../shared/index";
import {
  faArrowRightFromBracket,
  faBalanceScale,
  faCircleInfo,
  faEnvelope,
  faGears,
} from "../../shared/constants";
import {
  useSelector,
  useTranslation,
  useCallback,
  useMemo,
  useState,
  useNavigate,
} from "../../shared/hooks";
import { Offcanvas } from "../../shared/bootstrap";
import { LogOutModal, ContactsIcon } from "../../shared/components";

const SettingOffCanvas = ({ show, handleClose }) => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const navigate = useNavigate();
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const navigateToProfilePage = () => {
    handleClose();
    navigate(`profile/${profileInfo?._id}`);
  };

  const menuLinks = useMemo(
    () => [
      { to: `profile/${profileInfo?._id}`, label: "accSetting", icon: faGears },
      { to: "/about", label: "about", icon: faCircleInfo },
      { to: "/contact", label: "contact", icon: faEnvelope },
      { to: "/help", label: "Help", icon: faCircleInfo },
      { to: "/terms-conditions", label: "terms", icon: faBalanceScale },
    ],
    [profileInfo?._id]
  );

  const handleShowAddModal = useCallback(() => setLogoutModalShow(true), []);
  const handleHideAddModal = useCallback(() => setLogoutModalShow(false), []);

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className={styles.side_bar}
      >
        <Offcanvas.Header
          className={`${styles.header} ${
            isArLang ? "ar_canvas_header" : "canvas_header"
          }`}
          closeButton
        >
          <Offcanvas.Title>
            <div
              onClick={navigateToProfilePage}
              className={`${styles.profile_content} d-flex align-items-center`}
              title="view profile"
            >
              <img
                src={
                  profileInfo?.photo
                    ? `${import.meta.env.VITE_Host}${profileInfo?.photo}`
                    : avatar
                }
                className={styles.profile_pic}
                alt="avatar"
              />

              <div
                className={`${
                  isArLang ? "me-3" : "ms-3"
                } d-flex justify-content-center flex-column`}
              >
                <span className={styles.profile_name}>{profileInfo?.name}</span>
                <span className={styles.user_email}>{profileInfo?.email}</span>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className={styles.contact_list}>
            {menuLinks?.map(({ to, label, icon }, index) => (
              <Link to={to} key={index}>
                <li className={styles.contact_list_item} onClick={handleClose}>
                  {key(label)}
                  <FontAwesomeIcon className={styles.list_icons} icon={icon} />
                </li>
              </Link>
            ))}
            <li
              className={styles.contact_list_item}
              onClick={handleShowAddModal}
            >
              {key("logout")}
              <FontAwesomeIcon
                className={styles.list_icons}
                icon={faArrowRightFromBracket}
              />
            </li>
          </ul>

          <ContactsIcon type="two" />

          <p className={`${styles.slide_footer} mt-5 text-center`}>
            © 2025 {key("copyRights")}
          </p>
        </Offcanvas.Body>
      </Offcanvas>

      {logoutModalShow && (
        <LogOutModal
          show={logoutModalShow}
          onHide={handleHideAddModal}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default SettingOffCanvas;
