import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { ErrorMessage, Field, Form, Formik } from "../../../shared/index";
import { toast, object} from "../../../shared/constants";
import {
  useMutation,
  useSelector,
  useTranslation,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";

const UpdateSubscriptions = ({ hideModal, refetch, sub }) => {
  const token = useSelector((state) => state.userInfo.token);
  const { positiveNumbersValidation } = useValidation();
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate,isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    price: Number(sub.price) || 0,
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      [sub.feature]: values.price,
    };

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "put",
            type: `subscriptions`,
          },
          {
            onSuccess: (data) => {
              if (data?.status === "success") {
                if (refetch) {
                  refetch();
                }
                resetForm();
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
        success: key("updatedSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    price: positiveNumbersValidation.required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className="field">
          <label htmlFor="price">
            {key(sub.feature)} {requiredLabel}
          </label>
          <Field type="text" id="price" name="price" />
          <ErrorMessage name="price" component={InputErrorMessage} />
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
            {key("update")}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default UpdateSubscriptions;
