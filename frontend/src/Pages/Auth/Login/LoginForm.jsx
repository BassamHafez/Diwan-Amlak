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
import {
  toast,
  object,
  faEye,
  faEyeSlash,
  faSpinner,
} from "../../../shared/constants";
import {
  useMutation,
  useState,
  useTranslation,
  useSaveLoginData,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage, ButtonOne } from "../../../shared/components";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const saveDataIntoRedux = useSaveLoginData();
  const { phoneValidation, passwordValidation } = useValidation();
  const { t: key } = useTranslation();
  const notifyError = (message) => toast.error(message);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { mutate, isPending } = useMutation({
    mutationFn: signFormsHandler,
    onSuccess: (response) => {
      let res = response.data;
      if (res.status === "success") {
<<<<<<< HEAD
        console.log("res", res);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
        if (res?.data.user) {
          saveDataIntoRedux(res);
        }
      } else {
        console.log(res);
        notifyError(key("wrong"));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.data.message === "Incorrect phone or password") {
        notifyError(key("noPhone"));
      } else {
        console.log(error);
        notifyError(key("wrong"));
      }
    },
  });

  const initialValues = {
    phone: "",
    password: "",
  };

  const onSubmit = (values) => {
    mutate({ type: "login", formData: values });
  };

  const validationSchema = object({
    phone: phoneValidation.required(key("fieldReq")),
    password: passwordValidation,
  });

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const eyeShape = showPassword ? faEye : faEyeSlash;
  const passwordType = showPassword ? "text" : "password";

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className={styles.login_form_content}>
          <div className="field">
            <label htmlFor="phoneInput">{key("phone")}</label>
            <Field
              type="tel"
              id="phoneInput"
              name="phone"
              placeholder="05XXXXXXXX"
            />
            <ErrorMessage name="phone" component={InputErrorMessage} />
          </div>
          <div className="field position-relative">
            <label htmlFor="passwordInput">{key("password")}</label>
            <Field
              type={passwordType}
              id="passwordInput"
              name="password"
              placeholder="*****"
            />
            <ErrorMessage name="password" component={InputErrorMessage} />
            <FontAwesomeIcon
              onClick={toggleShowPassword}
              className={
                isArLang ? styles.show_pass_eye_ar : styles.show_pass_eye
              }
              icon={eyeShape}
            />
          </div>
          <div className="text-center my-4 px-5 position-relative">
            <ButtonOne type={isPending ? "button" : "submit"} borderd={true} classes="w-100">
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("login")
              )}
            </ButtonOne>
          </div>

          <div className={styles.form_options}>
            <span>
              <Link to={"/forget-password"}>{key("forgotPass")}</Link>
            </span>
            <span>
              {key("creatAcc")} <Link to={"/register"}>{key("register")}</Link>
            </span>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default LoginForm;
