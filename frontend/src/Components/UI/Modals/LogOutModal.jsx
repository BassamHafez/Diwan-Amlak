import styles from "./MainModal.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSignOut from "../../../hooks/useSignOut";

const LogOutModal = ({ onClose, onHide, show }) => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const signOutHandler = () => {
    signOut();
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
