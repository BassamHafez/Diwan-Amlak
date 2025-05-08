import { formattedDate } from "../../../Components/Logic/LogicFun";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../shared/index";
import { faSpinner, toast, object, date } from "../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useParams,
  useValidation,
  useSelector,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const ExtendContract = ({
  hideModal,
  refetch,
  refetchDetails,
  contractDetails,
}) => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const { noFutureDateValidation } = useValidation();
  const requiredLabel = <span className="text-danger">*</span>;
  const { propId } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    endContract: formattedDate(contractDetails?.endDate) || "",
    newEndDate: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      endDate: values.newEndDate,
    };
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "put",
            type: `estates/${propId}/contracts/${contractDetails?._id}/extend`,
          },
          {
            onSuccess: async (data) => {
              if (data?.status === "success") {
                await refetch();
                await refetchDetails();
                resetForm();
                resolve(key("updatedSucc"));
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
    endContract: date(),
    newEndDate: noFutureDateValidation.test(
      "is-greater",
      key("endDateValidation2"),
      function (value) {
        const { endContract } = this.parent;
        return value > endContract;
      }
    ),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <Row>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="endContract">{key("endContract")}</label>
              <Field type="date" id="endContract" name="endContract" disabled />
            </div>
          </Col>
          <Col sm={6}>
            <div className="field">
              <label htmlFor="newEndDate">
                {key("newEndDate")} {requiredLabel}
              </label>
              <Field type="date" id="newEndDate" name="newEndDate" />
              <ErrorMessage name="newEndDate" component={InputErrorMessage} />
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
              key("update")
            )}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default ExtendContract;
