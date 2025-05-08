import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import { Field, Form, Formik } from "../../../../shared/index";
import { toast, object, string } from "../../../../shared/constants";
import {
  useMutation,
  useSelector,
  useTranslation,
} from "../../../../shared/hooks";

const UpdateSupport = ({ msgStatus, msgId, refetch, hideModal }) => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();

  const { mutate,isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    status: msgStatus || "",
  };

  const onSubmit = (values) => {
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "patch",
            type: `support/messages/${msgId}`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
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
        success: key("updatedSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    status: string().required(key("fieldReq")),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className="d-flex flex-column align-items-start my-4">
          <h4>
            {key("update")} {key("status")}
          </h4>
          <div className="btn-group flex-wrap w-100 my-3">
            <Field
              type="radio"
              name="status"
              value="completed"
              id="completed"
              className="btn-check"
            />
            <label
              htmlFor="completed"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("completed")}
            </label>

            <Field
              type="radio"
              name="status"
              value="processing"
              id="processing"
              className="btn-check"
            />
            <label
              htmlFor="processing"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("processing")}
            </label>
            <Field
              type="radio"
              name="status"
              value="pending"
              id="pending"
              className="btn-check"
            />
            <label
              htmlFor="pending"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("pending")}
            </label>
            <Field
              type="radio"
              name="status"
              value="archived"
              id="archived"
              className="btn-check"
            />
            <label
              htmlFor="archived"
              className="btn btn-outline-dark m-2 rounded"
            >
              {key("archived")}
            </label>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
          <button onClick={hideModal} className="cancel_btn my-2">
            {key("cancel")}
          </button>

          <button className="submit_btn bg-main my-2" type={isPending ? "button" : "submit"}>
            {key("update")}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default UpdateSupport;
