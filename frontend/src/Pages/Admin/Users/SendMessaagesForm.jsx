import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../shared/index";
import {
  faEnvelope,
  faSquareWhatsapp,
  toast,
  object,
  faImage,
} from "../../../shared/constants";
import {
  useFileHandler,
  useMutation,
  useSelector,
  useTranslation,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import styles from "../Admin.module.css";

const SendMessaagesForm = ({
  selectedUsers,
  allUsers,
  clearSelectedUsersIds,
  hideModal,
}) => {
  const { t: key } = useTranslation();
  const { messageValidation, mainReqValidation } = useValidation();
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const token = useSelector((state) => state.userInfo.token);
  const myIds = selectedUsers?.length > 0 ? selectedUsers : allUsers;

  const { mutate,isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    emailSubject: "",
    message: "",
    type: "email",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    myIds.forEach((val, index) => {
      formData.append(`usersIds[${index}]`, val);
    });

    formData.append("emailSubject", values.emailSubject);
    formData.append("message", values.message);
    formData.append("type", values.type);

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "post",
            type: "users/messages",
          },
          {
            onSuccess: (data) => {
              if (data?.status === "success") {
                clearSelectedUsersIds();
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
        pending: key("sending"),
        success: key("sentSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    emailSubject: mainReqValidation,
    message: messageValidation,
    type: mainReqValidation,
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <div className={styles.photo_field}>
          <h6 className="mb-3">{key("poster")}</h6>
          <label
            className={
              imagePreviewUrl ? styles.photo_label_img : styles.photo_label
            }
            htmlFor="poster"
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
            id="poster"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
          <ErrorMessage name="image" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="emailSubject">{key("subject")}</label>
          <Field type="text" id="emailSubject" name="emailSubject" />
          <ErrorMessage name="emailSubject" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="message">{key("message")}</label>
          <Field
            as="textarea"
            className="text_area"
            id="message"
            name="message"
          />
          <ErrorMessage name="message" component={InputErrorMessage} />
        </div>
        <div className="d-flex flex-column align-items-start my-4">
          <h6 className="mx-1">{key("sendingMethod")}</h6>
          <div className="btn-group flex-wrap">
            <Field
              type="radio"
              name="type"
              value="email"
              id="email_val"
              className="btn-check"
            />
            <label
              htmlFor="email_val"
              className="btn btn-outline-dark m-2 rounded"
            >
              <FontAwesomeIcon className="mx-1" icon={faEnvelope} />{" "}
              {key("email")}
            </label>

            <Field
              type="radio"
              name="type"
              value="whatsapp"
              id="whatsapp_val"
              className="btn-check"
            />
            <label
              htmlFor="whatsapp_val"
              className="btn btn-outline-dark m-2 rounded"
            >
              <FontAwesomeIcon className="mx-1" icon={faSquareWhatsapp} />{" "}
              {key("WHATSAPP")}
            </label>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
            {key("send")}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default SendMessaagesForm;
