import { paymentMethodOptions } from "../../../Components/Logic/StaticLists";
import { formattedDate } from "../../../Components/Logic/LogicFun";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../shared/index";
import {
  faSpinner,
  toast,
  object,
  string,
  date,
} from "../../../shared/constants";
import { useMutation, useTranslation, useParams, useSelector } from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";

const MainPayForm = ({ hideModal, refetch, type, Id, refetchDetails }) => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const param = useParams();

  const endPoint =
    type === "rev"
      ? `estates/${param.propId}/revenues/${Id}/pay`
      : `expenses/${Id}/pay`;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    paymentMethod: "",
    paidAt: `${formattedDate(new Date())}`,
  };

  const onSubmit = (values, { resetForm }) => {
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "patch",
            type: endPoint,
          },
          {
            onSuccess: async (data) => {
<<<<<<< HEAD
              console.log(data);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
              if (data?.status === "success") {
                await refetch();
                await refetchDetails();
                resetForm();
                resolve(key("paidSucc"));
                hideModal();
              } else {
                reject(key("wrong"));
              }
            },
            onError: (error) => {
              console.log(error);
              reject(key("wrong"));
            },
          }
        );
      }),
      {
        pending: key(key("saving")),
        success: key("paidSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    paymentMethod: string().required(key("fieldReq")),
    paidAt: date(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <Form>
          <div className="field mb-1">
            <label htmlFor="paymentMethod">
              {key("paymentMethod")} {requiredLabel}
            </label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              options={
                isArLang
                  ? paymentMethodOptions["ar"]
                  : paymentMethodOptions["en"]
              }
              onChange={(val) => setFieldValue("paymentMethod", val.value)}
              className={`${isArLang ? "text-end" : "text-start"}`}
              isRtl={isArLang ? true : false}
              placeholder=""
            />
            <ErrorMessage name="paymentMethod" component={InputErrorMessage} />
          </div>
          <div className="field">
            <label htmlFor="paidAt">
              {key("paidAt")} {requiredLabel}
            </label>
            <Field type="date" id="paidAt" name="paidAt" />
            <ErrorMessage name="paidAt" component={InputErrorMessage} />
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
            <button onClick={hideModal} className="cancel_btn my-2">
              {key("cancel")}
            </button>

            <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
              {isPending ? (
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
              ) : (
                key("confirm")
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MainPayForm;
