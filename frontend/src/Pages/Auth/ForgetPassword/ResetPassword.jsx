import { signFormsHandler } from "../../../util/Http";
import styles from "./ForgetPassword.module.css";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../shared/index";
import { toast, object, faYinYang } from "../../../shared/constants";
import {
  useMutation,
  useNavigate,
  useState,
  useTranslation,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Modal } from "../../../shared/bootstrap";

const ResetPassword = ({ show, onHide }) => {
  const [isRightEmail, setIsRightEmail] = useState(false);
  const navigate = useNavigate();
  const { t: key } = useTranslation();
  const { emailValidation, passwordValidation } = useValidation();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
<<<<<<< HEAD
      console.log(data);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
      if (data.data.status === "success") {
        setIsRightEmail(false);
        notifySuccess(key("newPassSaved"));
        navigate("/login");
        onHide();
      } else {
        notifyError(key("newPassFaild"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "account with this email not found") {
        setIsRightEmail(true);
      } else {
        setIsRightEmail(false);
        notifyError(key("newPassFaild"));
      }
    },
  });

  const initialValues = {
    email: "",
    newPassword: "",
  };

  const onSubmit = (values) => {
<<<<<<< HEAD
    console.log(values);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
    mutate({
      formData: values,
      method: "put",
    });
  };

  const validationSchema = object({
    email: emailValidation,
    newPassword: passwordValidation,
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modal_container}
    >
      <Modal.Body className={styles.modal_body}>
        <h4>{key("resetPass")}</h4>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className="field">
              <label htmlFor="resetPasswordEmail">{key("email")}</label>
              <Field type="email" id="resetPasswordEmail" name="email" />
              {isRightEmail && <InputErrorMessage text={key("noAcc")} />}
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>

            <div className="field">
              <label htmlFor="newPassword">{key("newPassword")}</label>

              <Field type="password" id="newPassword" name="newPassword" />
              <ErrorMessage name="newPassword" component={InputErrorMessage} />
            </div>

            <div className="d-flex justify-content-center align-items-center mt-3 px-2">
              <button className="submit_btn" type={isPending ? "button" : "submit"}>
                {isPending ? (
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                ) : (
                  key("confirm")
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ResetPassword;
