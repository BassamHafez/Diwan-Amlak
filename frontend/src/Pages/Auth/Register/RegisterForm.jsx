import styles from "../Auth.module.css";
import { signFormsHandler } from "../../../util/Http";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Link,
} from "../../../shared/index";
import { toast, object, faSpinner } from "../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useNavigate,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage, ButtonOne } from "../../../shared/components";

const RegisterForm = () => {
  const { t: key } = useTranslation();
  const {
    phoneValidation,
    passwordValidation,
    confirmPasswordValidation,
    emailValidation,
    nameValidation,
  } = useValidation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,

    onSuccess: (response) => {
      if (response.data.status === "success") {
        notifySuccess(key("registeredSuccess"));
        navigate("/login");
      } else {
        notifyError("wrong");
      }
    },
    onError(error) {
      console.log(error);
      if (error.status === 500) {
        if (
          error.data.message ===
          "connection <monitor> to 15.185.166.107:27017 timed out"
        ) {
          notifyError(key("timeout"));
        } else {
          notifyError(key("existError"));
        }
      } else if (error.data.message.split(" ")[0] === "Duplicate") {
        notifyError(key("duplicate"));
      } else {
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  };

  const onSubmit = (values) => {
    mutate({ type: "signup", formData: values });
  };

  const validationSchema = object({
    name: nameValidation,
    email: emailValidation,
    phone: phoneValidation.required(key("fieldReq")),
    password: passwordValidation,
    passwordConfirm: confirmPasswordValidation,
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.login_form_content}>
          <div className="field mb-2">
            <Field type="text" name="name" placeholder={key("name")} />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field type="email" name="email" placeholder={`${key("email")}`} />
            <ErrorMessage name="email" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field
              type="tel"
              id="phoneInput"
              name="phone"
              placeholder={key("phone")}
              className={isArLang ? "ar_direction" : ""}
            />
            <ErrorMessage name="phone" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field
              type="password"
              name="password"
              placeholder={key("password")}
            />
            <ErrorMessage name="password" component={InputErrorMessage} />
          </div>

          <div className="field mb-2">
            <Field
              type="password"
              name="passwordConfirm"
              placeholder={key("passwordConfirm")}
            />
            <ErrorMessage
              name="passwordConfirm"
              component={InputErrorMessage}
            />
          </div>

          <div className="text-center my-4 px-5 position-relative">
            <ButtonOne type={isPending ? "button" : "submit"} borderd={true} classes="w-100">
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("register")
              )}
            </ButtonOne>
          </div>

          <div className={styles.form_options}>
            <span>
              {key("haveAcc")} <Link to={"/login"}>{key("login")}</Link>
            </span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default RegisterForm;
