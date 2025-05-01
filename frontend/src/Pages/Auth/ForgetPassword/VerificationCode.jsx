import { signFormsHandler } from "../../../util/Http";
import ResetPassword from "./ResetPassword";
import styles from "./ForgetPassword.module.css";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../shared/index";
import { toast, object, string, faYinYang } from "../../../shared/constants";
import { useMutation, useState, useTranslation } from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Modal } from "../../../shared/bootstrap";

const VerificationCode = ({ show, onHide }) => {
  const [isCodeWrong, setIsCodeWrong] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t: key } = useTranslation();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.status === "Success") {
        setIsCodeWrong(false);
        setShowModal(true);
        onHide();
      } else {
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "Invalid reset code or expired") {
        setIsCodeWrong(true);
        notifyError(key("wrongVerificationCode"));
      } else {
        setIsCodeWrong(false);
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    resetCode: "",
  };

  const onSubmit = (values) => {
    mutate({
      formData: values,
      type: "verifyResetCode",
    });
  };

  const validationSchema = object({
    resetCode: string().required(key("codeRec")),
  });

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.modal_container}
      >
        <Modal.Body className={styles.modal_body}>
          <h4>{key("enterCode")}</h4>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <div className={styles.verify_form}>
                <Field
                  type="text"
                  id="forgetPasswordEmail"
                  name="resetCode"
                  placeholder="######"
                />
                {isCodeWrong && (
                  <InputErrorMessage text={key("resetInvalid")} />
                )}
                <ErrorMessage name="resetCode" component={InputErrorMessage} />
              </div>

              <div className="d-flex justify-content-center align-items-center mt-3 px-2">
                <button className="submit_btn" type={isPending ? "button" : "submit"}>
                  {isPending ? (
                    <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                  ) : (
                    key("verify")
                  )}
                </button>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>

      <ResetPassword
        show={showModal}
        onHide={() => setShowModal(true)}
        notifySuccess={notifySuccess}
        notifyError={notifyError}
      />
    </>
  );
};

export default VerificationCode;
