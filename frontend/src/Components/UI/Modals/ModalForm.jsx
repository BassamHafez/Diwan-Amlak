import styles from "./MainModal.module.css";
import Modal from "react-bootstrap/Modal";

const ModalForm = ({show, onHide, children,modalSize,isStatic}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={modalSize?modalSize:"xl"}
      fullscreen="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
      backdrop={isStatic?false:true}
    >
      <Modal.Body className={`${styles.modal_body} ${styles.rounded_modal_body} text-center`}>
        {children}
      </Modal.Body>
    </Modal>
  )
}

export default ModalForm
