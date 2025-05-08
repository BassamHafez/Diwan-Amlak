import { cleanUpData, formattedDate } from "../../../Components/Logic/LogicFun";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../shared/index";
import { faSpinner, faCoins, toast, object } from "../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useParams,
  useValidation,
  useSelector,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const SplitRevenue = ({
  hideModal,
  refetch,
  refetchDetails,
  revenueDetails,
}) => {
  const token = useSelector((state) => state.userInfo.token);
  const { positiveNumbersValidation, dateValidation, noteValidation } =
    useValidation();
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  const { propId } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    splitedAmount: "",
    dueDate: `${formattedDate(revenueDetails?.dueDate)}`,
    note: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const cleanedValues = cleanUpData({ ...values });
    console.log(cleanedValues);
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: cleanedValues,
            token: token,
            method: "put",
            type: `estates/${propId}/revenues/${revenueDetails?._id}/split`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (data?.status === "success") {
                await refetch();
                await refetchDetails();
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
        success: key("splitedSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    splitedAmount: positiveNumbersValidation.required(key("fieldReq")),
    dueDate: dateValidation,
    note: noteValidation,
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <div className="d-flex px-2">
          <span className="mb-4 text-secondary">
            <FontAwesomeIcon className="text-warning" icon={faCoins} />{" "}
            {key("totallyAmount")} ({revenueDetails?.amount}) {key("sarSmall")}
          </span>
        </div>

        <Row>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="splitedAmount">
                {key("splitedAmount")} ({key("sarSmall")}) {requiredLabel}
              </label>
              <Field type="number" id="splitedAmount" name="splitedAmount" />
              <ErrorMessage
                name="splitedAmount"
                component={InputErrorMessage}
              />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="dueDate">
                {key("dueDate")} {requiredLabel}
              </label>
              <Field type="date" id="dueDate" name="dueDate" />
              <ErrorMessage name="dueDate" component={InputErrorMessage} />
            </div>
          </Col>
          <Col sm={12}>
            <div className="field">
              <label htmlFor="note">{key("notes")}</label>
              <Field
                as="textarea"
                className="text_area"
                id="note"
                name="note"
              />
              <ErrorMessage name="note" component={InputErrorMessage} />
            </div>
          </Col>
        </Row>

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
    </Formik>
  );
};

export default SplitRevenue;
