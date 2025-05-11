import { mainFormsHandlerTypeRaw } from "../../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../../shared/index";
import {
  faSpinner,
  toast,
  object,
  string,
  ref,
} from "../../../../shared/constants";
import {
  useMutation,
  useSelector,
  useTranslation,
  useValidation,
} from "../../../../shared/hooks";
import { InputErrorMessage, ButtonOne } from "../../../../shared/components";

const SecurityForm = ({ LogOutProcess }) => {
  const { t: key } = useTranslation();
  const { passwordValidation } = useValidation();
  const token = useSelector((state) => state.userInfo.token);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  };

  const onSubmit = (values, { resetForm }) => {
    mutate(
      {
        formData: values,
        token: token,
        method: "patch",
        type: `users/me/password`,
      },
      {
        onSuccess: (data) => {
<<<<<<< HEAD
          console.log(data);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
          if (data?.status === "success") {
            notifySuccess(key("updatedSucc"));
            resetForm();
            LogOutProcess();
          } else {
            notifyError(key("wrong"));
          }
        },
        onError: (error) => {
          console.log(error);
          notifyError(key("wrong"));
        },
      }
    );
  };

  const validationSchema = object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    passwordConfirm: string()
      .oneOf([ref("newPassword"), null], `${key("passwordMismatch")}`)
      .required(`${key("fieldReq")}`),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <div className="field">
          <Field
            type="password"
            name="currentPassword"
            placeholder={key("currentPassword")}
          />
          <ErrorMessage name="currentPassword" component={InputErrorMessage} />
        </div>

        <div className="field">
          <Field
            type="password"
            name="newPassword"
            placeholder={key("newPassword")}
          />
          <ErrorMessage name="newPassword" component={InputErrorMessage} />
        </div>

        <div className="field">
          <Field
            type="password"
            name="passwordConfirm"
            placeholder={key("passwordConfirm")}
          />
          <ErrorMessage name="passwordConfirm" component={InputErrorMessage} />
        </div>

        <div className="text-center my-4 px-5">
          <ButtonOne type={isPending ? "button" : "submit"} borderd={true} classes="w-100">
            {isPending ? (
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
            ) : (
              key("update")
            )}
          </ButtonOne>
        </div>
      </Form>
    </Formik>
  );
};

export default SecurityForm;
