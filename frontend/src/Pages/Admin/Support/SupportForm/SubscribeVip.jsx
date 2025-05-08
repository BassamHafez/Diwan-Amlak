import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import { ErrorMessage, Field, Form, Formik } from "../../../../shared/index";
import { toast, object } from "../../../../shared/constants";
import {
  useMutation,
  useSelector,
  useTranslation,
  useValidation,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";

const SubscribeVip = ({ accountId, hideModal, refetch }) => {
  const { positiveNumbersValidation, monthsValidation } = useValidation();
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();

  const { mutate,isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    price: "",
    months: "",
  };

  const onSubmit = (values) => {
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "post",
            type: `accounts/${accountId}/vip`,
          },
          {
            onSuccess: async (data) => {
              if (data?.status === "success") {
                await refetch();
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
        success: key("subSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    price: positiveNumbersValidation.required(key("fieldReq")),
    months: monthsValidation,
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <div className="field">
          <label htmlFor="price">{key("price")}</label>
          <Field type="number" name="price" id="price" />
          <ErrorMessage name="price" component={InputErrorMessage} />
        </div>

        <div className="field">
          <label htmlFor="months">{key("months")}</label>
          <Field type="number" name="months" id="months" />
          <ErrorMessage name="months" component={InputErrorMessage} />
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn bg-main my-2" type={isPending ? "button" : "submit"}>
            {key("subscribe")}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default SubscribeVip;
