import { mainFormsHandlerTypeFormData } from "../../../../util/Http";
import styles from "../../Admin.module.css";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../../shared/index";
import {
  faSpinner,
  faImage,
  toast,
  object,
} from "../../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useFileHandler,
  useSelector,
  useValidation,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const AddTestimonial = ({ hideModal, refetch }) => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const {mainReqValidation,messageValidation}=useValidation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    name: "",
    title: "",
    comment: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    formData.append("name", values.name);
    formData.append("title", values.title);
    formData.append("comment", values.comment);
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "post",
            type: `testimonials`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (data?.status === "success") {
                await refetch();
                resolve();
                resetForm();
                hideModal();
              } else {
                reject();
              }
            },
            onError: (error) => {
              console.log(error);
              reject();
            },
          }
        );
      }),
      {
        pending: key(key("saving")),
        success: key("addedSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    name: mainReqValidation,
    title: mainReqValidation,
    comment: messageValidation,
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <Row className="g-3 over">
          <Col sm={6}>
            <div className="field">
              <label htmlFor="name">
                {key("name")} {requiredLabel}
              </label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="title">
                {key("job")} {requiredLabel}
              </label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage name="title" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={12}>
            <div className="field">
              <label htmlFor="comment">
                {key("comment")} {requiredLabel}
              </label>
              <Field
                as="textarea"
                className="text_area"
                id="comment"
                name="comment"
              />
              <ErrorMessage name="comment" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={12}>
            <div className={styles.photo_field}>
              <h6 className="mb-3">{key("avatar")}</h6>
              <label
                className={
                  imagePreviewUrl ? styles.photo_label_img : styles.photo_label
                }
                htmlFor="image"
              >
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded_image"
                    className={styles.image_preview}
                  />
                ) : (
                  <FontAwesomeIcon className={styles.img_icon} icon={faImage} />
                )}
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
            </div>
          </Col>

          <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
            <button onClick={hideModal} className="cancel_btn my-2">
              {key("cancel")}
            </button>

            <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("add")
              )}
            </button>
          </div>
        </Row>
      </Form>
    </Formik>
  );
};

export default AddTestimonial;
