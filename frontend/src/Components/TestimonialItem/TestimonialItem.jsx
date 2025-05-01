import styles from "./TestimonialItem.module.css";
import UpdateTestimonial from "../../Pages/Admin/AdminTestimonials/TestimonialsForms/UpdateTestimonial";
import { imgHash } from "../Logic/StaticLists";
import {
  useDeleteItem,
  useTranslation,
  useCallback,
  useState,
} from "../../shared/hooks";
import {
  ImgComponent,
  ModalForm,
  MainModal,
  ButtonOne,
} from "../../shared/components";
import { avatar } from "../../shared/images";

const TestimonialItem = ({ content, isAdmin, refetch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateTestimonialsModal, setShowUpdateTestmonialsModal] =
    useState(false);
  const deleteItem = useDeleteItem();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const deletePack = async () => {
    const formData = {
      itemId: content?._id,
      endPoint: `testimonials`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    deleteItem(formData);
  };

  const hideDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const showDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const hideUpdateModalHandler = useCallback(() => {
    setShowUpdateTestmonialsModal(false);
  }, []);

  const showUpdateModalHandler = useCallback(() => {
    setShowUpdateTestmonialsModal(true);
  }, []);

  return (
    <>
      <div
        className={`${styles.slide_content} ${
          isAdmin ? styles.admin_width : ""
        }`}
      >
        <div className={`${styles.slide_header} d-flex align-items-center`}>
          <div className={styles.person}>
            <ImgComponent
              src={
                content?.image
                  ? `${import.meta.env.VITE_Host}${content?.image}`
                  : avatar
              }
              width="4.375rem"
              height="4.375rem"
              hash={imgHash.hero1}
              alt="avatar"
            />
          </div>
          <div
            className={`${styles.slide_header_caption} d-flex flex-column  ${
              isArLang ? "me-3" : "ms-3"
            }`}
          >
            <h5 className={styles.person_name}>{content?.name}</h5>
            <span className={styles.person_date}>{content?.title}</span>
          </div>
        </div>
        <div
          className={`${styles.person_comment} ${
            isAdmin ? styles.dashed_border : ""
          }`}
        >
          <p>{content?.comment}</p>
        </div>

        {isAdmin && (
          <div
            className={`${styles.controller_div} d-flex justify-content-between align-items-center flex-wrap position-relative mt-3`}
          >
            <ButtonOne
              text={key("delete")}
              classes="bg-danger m-2"
              borderd={true}
              onClick={showDeleteModalHandler}
            />

            <ButtonOne
              text={key("ediet")}
              classes="bg-navy m-2"
              borderd={true}
              onClick={showUpdateModalHandler}
            />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={hideDeleteModalHandler}
          confirmFun={deletePack}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}

      {showUpdateTestimonialsModal && (
        <ModalForm
          show={showUpdateTestimonialsModal}
          onHide={hideUpdateModalHandler}
        >
          <UpdateTestimonial
            refetch={refetch}
            hideModal={hideUpdateModalHandler}
            content={content}
          />
        </ModalForm>
      )}
    </>
  );
};

export default TestimonialItem;
