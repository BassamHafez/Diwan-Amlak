import { signFormsHandler } from "../../../util/Http";
import styles from "./ForgetPassword.module.css";
import VerificationCode from "./VerificationCode";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Link,
} from "../../../shared/index";
import { toast, object, faYinYang } from "../../../shared/constants";
import {
  useMutation,
  useState,
  useTranslation,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";
import { forgetPassImg } from "../../../shared/images";

const ForgetPassword = () => {
  const [isRightEmail, setIsRightEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t: key } = useTranslation();
  const { emailValidation } = useValidation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.status === "Success") {
        setIsRightEmail(false);
        notifySuccess(key("checkResetPass"));
        setShowModal(true);
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "There is no user with email provided") {
        setIsRightEmail(true);
      } else {
        setIsRightEmail(false);
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    email: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      type: "forgotPassword",
    });
  };

  const validationSchema = object({
    email:emailValidation,
  });

  return (
    <>
      <div
        style={{ backgroundColor: "var(--sub_light)", minHeight: "88vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Row className={`${styles.row_container} my-5 mx-4`}>
          <Col
            sm={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              <Form>
                <div className={styles.form_header}>
                  <h3>{key("forgetTitle")}</h3>
                  <span className="mini_word">
                    {key("enterEmailToSendCode")}
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="getPassEmail">{key("email")}</label>
                  <Field type="email" id="getPassEmail" name="email" />
                  {isRightEmail && <InputErrorMessage text={key("noAcc")} />}
                  <ErrorMessage name="email" component={InputErrorMessage} />
                </div>

                <div className="d-flex justify-content-center align-items-center mt-4 px-2">
                  <button type={isPending ? "button" : "submit"} className="submit_btn bg-main">
                    {isPending ? (
                      <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                    ) : (
                      key("sendEmail")
                    )}
                  </button>
                </div>

                <div className={styles.options}>
                  <span className="or_span mb-4">{key("or")}</span>

                  <span className="mini_word">
                    {key("youCanCreateAcc")}{" "}
                    <Link to={"/register"} className="text-primary">
                      {key("register")}
                    </Link>
                  </span>
                </div>
              </Form>
            </Formik>
          </Col>
          <Col
            sm={6}
            className="d-flex justify-content-center align-items-center"
          >
            <div className={styles.img_side}>
              <img className="w-100" src={forgetPassImg} alt="forgetPassImg" />
            </div>
          </Col>
        </Row>
      </div>
      {showModal && (
        <VerificationCode show={showModal} onHide={() => setShowModal(true)} />
      )}
    </>
  );
};

export default ForgetPassword;
