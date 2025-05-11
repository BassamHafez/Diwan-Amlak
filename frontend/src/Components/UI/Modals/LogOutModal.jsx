<<<<<<< HEAD
import { useDispatch } from "react-redux";
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
import styles from "./MainModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { userActions } from "../../../Store/userInfo-slice";
import { saveIsLoginState } from "../../../Store/userInfo-actions";
import { useTranslation } from "react-i18next";
import { profileActions } from "../../../Store/profileInfo-slice";

const LogOutModal = ({ onClose, onHide, show }) => {
  const dispatch = useDispatch();
=======
import { useTranslation } from "react-i18next";
import useSignOut from "../../../hooks/useSignOut";

const LogOutModal = ({ onClose, onHide, show }) => {
  const signOut = useSignOut();
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
  const navigate = useNavigate();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const signOutHandler = () => {
<<<<<<< HEAD
    localStorage.removeItem("userData");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("lastNotificationTime");
    dispatch(userActions.setRole(""));
    dispatch(userActions.setIsLogin(false));
    dispatch(saveIsLoginState(false));
    dispatch(userActions.setRole(""));
    dispatch(profileActions.setProfileInfo(null));
=======
    signOut();
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
    if (onClose) {
      onClose();
    }
    onHide();
    navigate("/");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body
        className={`${styles.modal_body} ${styles.rounded_body} text-center`}
      >
        <h4>{key("logoutText")}</h4>
      </Modal.Body>
      <Modal.Footer className={styles.modal_footer}>
        <Button
          variant="secondary"
          className={isArLang ? styles.close_btn_ar : styles.close_btn}
          onClick={onHide}
        >
          {key("cancel")}
        </Button>
        <Button
          variant="danger"
          className={isArLang ? styles.confirm_btn_ar : styles.confirm_btn}
          onClick={signOutHandler}
        >
          {key("logout")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogOutModal;
