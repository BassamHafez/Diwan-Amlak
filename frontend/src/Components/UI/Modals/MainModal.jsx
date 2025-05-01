import styles from "./MainModal.module.css";
import Modal from "react-bootstrap/Modal";
import ButtonOne from "../Buttons/ButtonOne";

const MainModal = ({
  show,
  onHide,
  title,
  children,
  okBtn,
  cancelBtn,
  modalSize,
  confirmFun,
}) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={modalSize}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      {title && (
        <Modal.Header
          closeButton
          className={`${isArLang ? "modal_header_ar" : ""} ${
            styles.modal_header
          }`}
        >
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body
        className={`${styles.modal_body} ${title ? "" : styles.rounded_body} ${
          !cancelBtn && !okBtn && styles.rounded_modal_body
        } text-center`}
      >
        {children}
      </Modal.Body>
      {(cancelBtn || okBtn) && (
        <Modal.Footer className={`${styles.modal_footer}`}>
          {cancelBtn && (
            <div className={isArLang ? styles.close_btn_ar : styles.close_btn}>
              <ButtonOne classes="bg-secondary" borderd={true} onClick={onHide}>
                {cancelBtn}
              </ButtonOne>
            </div>
          )}
          {okBtn && (
            <div
              className={isArLang ? styles.confirm_btn_ar : styles.confirm_btn}
            >
              <ButtonOne classes="bg-dark" borderd={true} onClick={confirmFun}>
                {okBtn}
              </ButtonOne>
            </div>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default MainModal;
