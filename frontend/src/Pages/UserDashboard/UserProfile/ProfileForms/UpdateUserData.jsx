import { mainFormsHandlerTypeFormData } from "../../../../util/Http";
import styles from "./ProfileForms.module.css";
import fetchProfileData from "../../../../Store/profileInfo-actions";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../../shared/index";
import {
  faSpinner,
  faCamera,
  toast,
  object,
} from "../../../../shared/constants";
import {
  useDispatch,
  useMutation,
  useTranslation,
  useFileHandler,
  useValidation,
  useSelector,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";

const UpdateUserData = ({ profileInfo, hideModal }) => {
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const {
    mainReqValidation,
    emailValidation,
    phoneValidation,
  } = useValidation();
  const dispatch = useDispatch();
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);

  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    name: profileInfo.name || "",
    email: profileInfo.email || "",
    phone: profileInfo.phone || "",
    photo: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "patch",
            type: `users/me`,
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                dispatch(fetchProfileData(token));
                resetForm();
                resolve();
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
        success: key("updatedSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object().shape({
    name: mainReqValidation,
    email: emailValidation,
    phone: phoneValidation.required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className={styles.photo_field}>
          <h6 className="mb-3">{key("avatar")} (1/1)</h6>
          <label className={styles.photo_label_img} htmlFor="avatar">
            <FontAwesomeIcon title={key("changePhoto")} icon={faCamera} />
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Uploaded Preview"
                className={styles.image_preview}
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_Host}${profileInfo.photo}`}
                alt="old_image_Preview"
                className={styles.image_preview}
              />
            )}
          </label>
          <input
            type="file"
            id="avatar"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
          <ErrorMessage name="photo" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="name">
            {key("name")} {requiredLabel}
          </label>
          <Field type="text" id="name" name="name" />
          <ErrorMessage name="name" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="phoneInput">
            {key("phone")} {requiredLabel}
          </label>
          <Field
            type="tel"
            id="phoneInput"
            name="phone"
            placeholder="05XXXXXXXX"
          />
          <ErrorMessage name="phone" component={InputErrorMessage} />
        </div>
        <div className="field">
          <label htmlFor="email">
            {key("email")} {requiredLabel}
          </label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component={InputErrorMessage} />
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
            {isPending ? (
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
            ) : (
              key("update")
            )}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default UpdateUserData;
