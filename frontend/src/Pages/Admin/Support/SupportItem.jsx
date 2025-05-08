import styles from "../Admin.module.css";
import UpdateSupport from "./SupportForm/UpdateSupport";
import { formatWhatsAppLink } from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon, Link } from "../../../shared/index";
import {
  faCaretDown,
  faEnvelope,
  faSquareWhatsapp,
} from "../../../shared/constants";
import {
  useTranslation,
  useState,
  useCallback,
  useDeleteItem,
} from "../../../shared/hooks";
import { ModalForm, MainModal, ButtonOne } from "../../../shared/components";
import { Col } from "../../../shared/bootstrap";
import { noAvatar } from "../../../shared/images";
import SubscribeVip from "./SupportForm/SubscribeVip";

const SupportItem = ({ msgData, refetch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const deleteItem = useDeleteItem();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { t: key } = useTranslation();

  const deleteMessage = async () => {
    setShowDeleteModal(false);
    const formData = {
      itemId: msgData?._id,
      endPoint: `support/messages`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    deleteItem(formData);
  };

  const getStatusBgColor = useCallback((status) => {
    switch (status) {
      case "pending":
        return styles.yellow;
      case "processing":
        return styles.blue;
      case "completed":
        return styles.green;
      case "archived":
        return styles.red;
      default:
        return "";
    }
  }, []);

  const whatsappLink = formatWhatsAppLink(msgData?.phone);

  const showDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const hideDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const showUpdateModalHandler = useCallback(() => {
    setShowUpdateModal(true);
  }, []);

  const hideUpdateModalHandler = useCallback(() => {
    setShowUpdateModal(false);
  }, []);

  const showSubscribeModalHandler = useCallback(() => {
    setShowSubscribeModal(true);
  }, []);

  const hideSubscribeModalHandler = useCallback(() => {
    setShowSubscribeModal(false);
  }, []);

  return (
    <>
      <Col sm={12}>
        <div className={styles.item}>
          <div className="d-flex justify-content-between flex-wrap mb-4">
            <div className={styles.header}>
              <img src={noAvatar} alt="noAvatar" />
              <div>
                <h5>{msgData?.name}</h5>
                <span>{msgData?.email}</span>
              </div>
            </div>
            <div>
              <span
                className={`${styles.status_badge} ${getStatusBgColor(
                  msgData?.status
                )}`}
              >
                {key(msgData?.status)}
              </span>
            </div>
          </div>
          <div className="text-center mb-1">
            <h5 className="m-0">{msgData?.subject}</h5>
            <FontAwesomeIcon className="color-main" icon={faCaretDown} />
          </div>

          <div className={styles.message_div}>
            <p className="m-0">{msgData.message}</p>
            <div className="d-flex justify-content-end align-items-center mt-2">
              {msgData?.phone && (
                <>
                  <Link
                    className={styles.support_links}
                    target="_blank"
                    to={whatsappLink}
                    rel="noopener noreferrer"
                    title={key("whatsapp")}
                  >
                    <FontAwesomeIcon icon={faSquareWhatsapp} />
                  </Link>
                </>
              )}
              <Link
                className={styles.support_links}
                target="_blank"
                to={`mailto:${msgData?.email}`}
                title={key("email")}
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </Link>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center position-relative flex-wrap px-1 mt-4">
            <ButtonOne
              text={key("delete")}
              classes="bg-danger m-1"
              borderd={true}
              onClick={showDeleteModalHandler}
            />
            <div
              className={`${
                isArLang ? "me-auto" : "ms-auto"
              } d-flex flex-wrap align-items-center`}
            >
              <ButtonOne
                onClick={showSubscribeModalHandler}
                text={key("subscribe")}
                borderd={true}
                classes="m-1 bg-secondary"
              />

              <ButtonOne
                onClick={showUpdateModalHandler}
                text={key("update")}
                borderd={true}
                classes="m-1"
              />
            </div>
          </div>
        </div>
      </Col>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={hideDeleteModalHandler}
          confirmFun={deleteMessage}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}

      {showUpdateModal && (
        <ModalForm
          show={showUpdateModal}
          onHide={hideUpdateModalHandler}
          modalSize="md"
        >
          <UpdateSupport
            refetch={refetch}
            hideModal={hideUpdateModalHandler}
            msgStatus={msgData?.status}
            msgId={msgData?._id}
          />
        </ModalForm>
      )}

      {showSubscribeModal && (
        <ModalForm show={showSubscribeModal} onHide={hideSubscribeModalHandler} modalSize="md">
          <SubscribeVip
            refetch={refetch}
            hideModal={hideSubscribeModalHandler}
            accountId={msgData?.account?._id}
          />
        </ModalForm>
      )}
    </>
  );
};

export default SupportItem;
