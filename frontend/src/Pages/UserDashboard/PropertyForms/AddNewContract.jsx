import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { unitOptions } from "../../../Components/Logic/StaticLists";
import {
  calculateRevenues,
  filterTimeUnitDpendsOnDaysDifference,
  generatePeriodOptions,
} from "../../../Components/Logic/LogicFun";
import ContractRevenues from "../PropertyDetails/ContractRevenues";
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
  useEffect,
  useState,
  useMutation,
  useQueryClient,
  useTranslation,
  useParams,
  useTenantsOptions,
  useAddContactInForms,
  useSelector,
  useValidation,
} from "../../../shared/hooks";
import { InputErrorMessage, MainModal } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const AddNewContract = ({ hideModal, refetch, refetchDetails }) => {
  const [paymentPeriodUnit, setPaymentPeriodUnit] = useState("");
  const [paymentPeriodValueOptions, setPaymentPeriodValueOptions] = useState(
    []
  );
  const [paymentPeriodUnitOptions, setPaymentPeriodUnitOptions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenues, setRevenues] = useState([]);
  const [showRevenuesTable, setShowRevenuesTable] = useState(false);

  const { tenantsOptions, refetchTenants } = useTenantsOptions();
  const { AddTenants } = useAddContactInForms({ refetchTenants });
  const {
    positiveNumbersValidation,
    mainReqValidation,
    endDateValidation,
    dateValidation,
  } = useValidation();
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const { propId } = useParams();
  const queryClient = useQueryClient();

  const notifyError = (message) => toast.error(message);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const requiredLabel = <span className="text-danger">*</span>;

  useEffect(() => {
    if (startDate && endDate) {
      const filteredUnits = filterTimeUnitDpendsOnDaysDifference(
        unitOptions,
        startDate,
        endDate,
        isArLang
      );

      setPaymentPeriodUnitOptions(filteredUnits);

      if (!filteredUnits.some((unit) => unit.value === paymentPeriodUnit)) {
        setPaymentPeriodUnit("");
        setPaymentPeriodValueOptions([]);
      }
    }
  }, [startDate, endDate, isArLang, paymentPeriodUnit]);

  useEffect(() => {
    if (paymentPeriodUnit && startDate && endDate) {
      setPaymentPeriodValueOptions(
        generatePeriodOptions(
          paymentPeriodUnit,
          startDate,
          endDate,
          key(paymentPeriodUnit),
          key(`plural${paymentPeriodUnit}`),
          key("every")
        )
      );
    }
  }, [paymentPeriodUnit, startDate, endDate, key]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    tenant: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
    paymentPeriodValue: "",
    paymentPeriodUnit: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    console.log(values);
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: values,
            token: token,
            method: "post",
            type: `estates/${propId}/contracts`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (
                data?.response?.data?.message ===
                "There is an contract overlapping with the selected dates"
              ) {
                reject();
              }
              if (data?.status === "success") {
                await refetch();
                await refetchDetails();
                queryClient.invalidateQueries(["estates", token]);
                queryClient.invalidateQueries(["compounds", token]);
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
        error: key("contractOverlapping"),
      }
    );
  };

  const validationSchema = object({
    tenant: mainReqValidation,
    startDate: dateValidation,
    endDate: endDateValidation,
    totalAmount: positiveNumbersValidation.required(key("fieldReq")),
    paymentPeriodValue: mainReqValidation,
    paymentPeriodUnit: mainReqValidation,
  });

  const showCalculatedRevenues = (values) => {
    const {
      totalAmount,
      paymentPeriodValue,
      paymentPeriodUnit,
      startDate,
      endDate,
    } = values;

    if (
      totalAmount &&
      paymentPeriodValue &&
      paymentPeriodUnit &&
      startDate &&
      endDate
    ) {
      const myRevenues =
        calculateRevenues(
          Number(totalAmount),
          Number(paymentPeriodValue),
          paymentPeriodUnit,
          startDate,
          endDate
        ) || [];
      setRevenues(myRevenues);
      setShowRevenuesTable(true);
    } else {
      notifyError("fillReq");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Row>
              <Col sm={12}>
                <div className="d-flex justify-content-end align-items-center mb-3">
                  <button
                    className="submit_btn bg-navy mx-2"
                    type="button"
                    onClick={() => showCalculatedRevenues(values)}
                    disabled={
                      !values.startDate ||
                      !values.endDate ||
                      !values.totalAmount ||
                      !values.paymentPeriodValue ||
                      !values.paymentPeriodUnit
                    }
                  >
                    {key("showRevenues")}
                  </button>

                  {AddTenants}
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="tenant">
                    {key("theTenant")}
                    {requiredLabel}
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
                <div className="field mb-1">
                  <label htmlFor="totalAmount">
                    {key("price")}
                    {requiredLabel} ({key("sar")})
                  </label>
                  <Field type="number" id="totalAmount" name="totalAmount" />
                  <ErrorMessage
                    name="totalAmount"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>

              <Col sm={6}>
                <div className="field">
                  <label htmlFor="startDate">
                    {key("startContract")}
                    {requiredLabel}
                  </label>
                  <Field
                    type="date"
                    id="startDate"
                    name="startDate"
                    onChange={(e) => {
                      setFieldValue("startDate", e.target.value);
                      setStartDate(e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name="startDate"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="endDate">
                    {key("endContract")}
                    {requiredLabel}
                  </label>
                  <Field
                    type="date"
                    id="endDate"
                    name="endDate"
                    onChange={(e) => {
                      setFieldValue("endDate", e.target.value);
                      setEndDate(e.target.value);
                    }}
                  />
                  <ErrorMessage name="endDate" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="paymentPeriodUnit">
                    {key("timeUnit")}
                    {requiredLabel}
                  </label>
                  <Select
                    id="paymentPeriodUnit"
                    name="paymentPeriodUnit"
                    options={paymentPeriodUnitOptions}
                    onChange={(val) => {
                      setFieldValue("paymentPeriodUnit", val.value);
                      setPaymentPeriodUnit(val.value);
                    }}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={""}
                    isDisabled={!startDate || !endDate}
                  />
                  <ErrorMessage
                    name="paymentPeriodUnit"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="endDate">
                    {key("paymentPeriodValue")}
                    {requiredLabel}
                  </label>
                  <Select
                    id="paymentPeriodValue"
                    name="paymentPeriodValue"
                    options={paymentPeriodValueOptions}
                    onChange={(val) =>
                      setFieldValue("paymentPeriodValue", val.value)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={""}
                    isDisabled={!paymentPeriodUnit}
                  />
                  <ErrorMessage
                    name="paymentPeriodValue"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
              <button onClick={hideModal} className="cancel_btn my-2">
                {key("cancel")}
              </button>

              <button className="submit_btn bg-main my-2" type={isPending ? "button" : "submit"}>
                {isPending ? (
                  <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                ) : (
                  `${key("add")} ${key("contract")}`
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <MainModal
        show={showRevenuesTable}
        onHide={() => setShowRevenuesTable(false)}
        cancelBtn={key("confirm")}
        modalSize={"lg"}
      >
        <ContractRevenues revenues={revenues} />
      </MainModal>
    </>
  );
};

export default AddNewContract;
