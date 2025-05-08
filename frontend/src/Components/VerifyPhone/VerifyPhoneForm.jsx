import { mainFormsHandlerTypeRaw } from "../../util/Http";
import fetchProfileData from "../../Store/profileInfo-actions";
import {
  FontAwesomeIcon,
  ErrorMessage,
  Form,
  Formik,
  Field,
} from "../../shared/index";
import { toast, object, string, faSpinner } from "../../shared/constants";
import {
  useMutation,
  useTranslation,
  useDispatch,
  useSelector,
} from "../../shared/hooks";
import { InputErrorMessage } from "../../shared/components";

const VerifyPhoneForm = ({ hideModal }) => {
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    verificationCode: "",
  };

  const onSubmit = (values, { resetForm }) => {
    mutate(
      {
        formData: values,
        token: token,
        type: "users/verify-phone",
        method: "post",
      },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            dispatch(fetchProfileData(token));
            notifySuccess(key("phoneVerifiedSuccess"));
            resetForm();
            hideModal();
          } else if (
            data?.response?.data?.message === "Verification code is wrong"
          ) {
            notifyError(key("verificationCodeWrong"));
          } else {
            notifyError(key("verifyCodeFailResend"));
          }
        },
        onError: (error) => {
          console.log(error);
          notifyError(key("verifyCodeFailResend"));
        },
      }
    );
  };

  const validationSchema = object({
    verificationCode: string().required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <div className="field">
          <label htmlFor="verifyCode">{key("sendMsgVerify")}</label>
          <Field type="text" id="verifyCode" name="verificationCode" />
          <ErrorMessage name="verificationCode" component={InputErrorMessage} />
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button
            className="submit_btn my-2"
            type={isPending ? "button" : "submit"}
          >
            {isPending ? (
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
            ) : (
              key("confirm")
            )}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default VerifyPhoneForm;
