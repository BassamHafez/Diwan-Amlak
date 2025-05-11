import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { revenueTypeOptions } from "../../../Components/Logic/StaticLists";

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
  useTranslation,
  useParams,
  useTenantsOptions,
  useAddContactInForms,
  useSelector,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const AddRevenue = ({ hideModal, refetch, refetchDetails }) => {
  const { tenantsOptions, refetchTenants } = useTenantsOptions();
  const { AddTenants } = useAddContactInForms({ refetchTenants });
  const {
    positiveNumbersValidation,
    mainReqValidation,
    noFutureDateValidation,
    noteValidation,
  } = useValidation();
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const { propId } = useParams();

  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    tenant: "",
    amount: "",
    dueDate: "",
    note: "",
    type: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      tenant: values.tenant,
      amount: Number(values.amount),
      dueDate: values.dueDate,
      type: values.type,
    };
<<<<<<< HEAD
    console.log(values);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
    if (values.note) {
      updatedValues.note = values.note;
    }

<<<<<<< HEAD
    console.log(updatedValues);

=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "post",
            type: `estates/${propId}/revenues`,
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

  const validationSchema = object().shape({
    tenant: mainReqValidation,
    amount: positiveNumbersValidation.required(key("fieldReq")),
    dueDate: noFutureDateValidation,
    type: mainReqValidation,
    note: noteValidation,
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
            <div className="d-flex justify-content-end align items-center">
              {AddTenants}
            </div>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="tenant">
                  {key("tenant")} {requiredLabel}
                </label>
                <Select
                  id="tenant"
                  name="tenant"
                  options={tenantsOptions}
                  onChange={(val) => setFieldValue("tenant", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="tenant" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="amount">
                  {key("amount")} {requiredLabel}
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
                      ? revenueTypeOptions["ar"]
                      : revenueTypeOptions["en"]
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
                  {key("dueDate")}
                  {requiredLabel}
                </label>
                <Field type="date" id="dueDate" name="dueDate" />
                <ErrorMessage name="dueDate" component={InputErrorMessage} />
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

export default AddRevenue;
