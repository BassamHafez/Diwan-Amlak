import { paymentMethodOptions } from "../../../Components/Logic/StaticLists";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../shared/index";
import { faSpinner, toast, object } from "../../../shared/constants";
import {
  useMutation,
  useQueryClient,
  useTranslation,
  useParams,
  useValidation,
  useSelector,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";

const SettleContract = ({
  contractDetails,
  refetch,
  refetchDetails,
  hideModal,
}) => {
  const token = useSelector((state) => state.userInfo.token);
  const { positiveNumbersValidation, mainReqValidation } = useValidation();
  const { propId } = useParams();
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";
  const requiredLabel = <span className="text-danger">*</span>;
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    paymentMethod: "",
    // paidAt: formattedDate(new Date()),
    settlementAmount: "",
  };

  const onSubmit = (values, { resetForm }) => {
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "put",
            type: `estates/${propId}/contracts/${contractDetails?._id}/settle`,
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
                await queryClient.invalidateQueries(["estates", token]);
                await queryClient.invalidateQueries(["compounds", token]);
                resetForm();
                resolve(key("setteledSucc"));
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
        success: key("setteledSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    paymentMethod: mainReqValidation,
    settlementAmount: positiveNumbersValidation.required(key("fieldReq")),
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
          <div className="field">
            <label htmlFor="settlementAmount">{key("settlementAmount")}</label>
            <Field
              type="number"
              id="settlementAmount"
              name="settlementAmount"
            />
            <ErrorMessage
              name="settlementAmount"
              component={InputErrorMessage}
            />
          </div>
          <div className="field">
            <label htmlFor="paymentMethod">
              {key("paymentMethod")} {requiredLabel}
            </label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              options={paymentMethodOptions[currentLang]}
              onChange={(val) => setFieldValue("paymentMethod", val.value)}
              className={`${isArLang ? "text-end" : "text-start"}`}
              isRtl={isArLang ? true : false}
              placeholder=""
            />
            <ErrorMessage name="paymentMethod" component={InputErrorMessage} />
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

export default SettleContract;
