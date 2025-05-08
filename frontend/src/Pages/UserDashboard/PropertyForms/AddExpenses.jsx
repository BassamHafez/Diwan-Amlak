import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { expensesTypeOptions } from "../../../Components/Logic/StaticLists";
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
} from "../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useParams,
  useServicesContact,
  useAddContactInForms,
  useSelector,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";
import { cleanUpData } from "../../../Components/Logic/LogicFun";

const AddExpenses = ({ hideModal, refetch, isCompound, refetchDetails }) => {
  const { servicesOptions, refetchServices } = useServicesContact();
  const { AddServices } = useAddContactInForms({ refetchServices });
  const {
    positiveNumbersValidation,
    mainReqValidation,
    noteValidation,
    dateValidation,
  } = useValidation();
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const params = useParams();

  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const myParam = isCompound ? params.compId : params.propId;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    amount: "",
    dueDate: "",
    note: "",
    type: "",
    contact: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      amount: values.amount,
      dueDate: values.dueDate,
      type: values.type,
    };

    if (!isCompound) {
      updatedValues.estate = myParam;
    } else {
      updatedValues.compound = myParam;
    }
    if (values.contact) {
      updatedValues.contact = values.contact;
    }
    if (values.note) {
      updatedValues.note = values.note;
    }
    const cleanedValues = cleanUpData({ ...updatedValues });

    console.log(cleanedValues);

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: cleanedValues,
            token: token,
            method: "post",
            type: `expenses`,
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
        success: key("addedSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    amount: positiveNumbersValidation.required(key("fieldReq")),
    dueDate: dateValidation,
    type: mainReqValidation,
    note: noteValidation,
    contact: string().nullable(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
        <Form>
          <Row>
            {AddServices}
            <Col sm={6}>
              <div className="field">
                <label htmlFor="amount">
                  {key("amount")} ({key("sarSmall")}) {requiredLabel}
                </label>
                <Field type="number" id="amount" name="amount" />
                <ErrorMessage name="amount" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="type">
                  {key("type")} {requiredLabel}
                </label>
                <Select
                  id="type"
                  name="type"
                  options={
                    isArLang
                      ? expensesTypeOptions["ar"]
                      : expensesTypeOptions["en"]
                  }
                  onChange={(val) => setFieldValue("type", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="type" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="dueDate">
                  {key("dueDate2")}
                  {requiredLabel}
                </label>
                <Field type="date" id="dueDate" name="dueDate" />
                <ErrorMessage name="dueDate" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="contact">{key("singleContactType")}</label>
                <Select
                  id="contact"
                  name="contact"
                  options={servicesOptions}
                  onChange={(val) =>
                    setFieldValue("contact", val ? val.value : "")
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                  isClearable
                />
                <ErrorMessage name="contact" component={InputErrorMessage} />
              </div>
            </Col>
            <div className="field">
              <label htmlFor="notes">{key("notes")}</label>
              <Field
                as="textarea"
                className="text_area"
                id="notes"
                name="note"
              />
              <ErrorMessage name="note" component={InputErrorMessage} />
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
              <button onClick={hideModal} className="cancel_btn my-2">
                {key("cancel")}
              </button>

              <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
                {isPending ? (
                  <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                ) : (
                  key("add")
                )}
              </button>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default AddExpenses;
