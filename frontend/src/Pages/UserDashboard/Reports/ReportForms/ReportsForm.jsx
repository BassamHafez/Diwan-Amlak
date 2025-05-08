import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import styles from "./ReportForm.module.css";
import { contractStatusOptions } from "../../../../Components/Logic/StaticLists";
import CheckPermissions from "../../../../Components/CheckPermissions/CheckPermissions";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../../shared/index";
import {
  faSpinner,
  faBuilding,
  faCouch,
  toast,
  object,
  string,
} from "../../../../shared/constants";
import {
  useState,
  useMutation,
  useTranslation,
  useValidation,
  useSelector,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";
import { cleanUpData } from "../../../../Components/Logic/LogicFun";

const ReportsForm = ({
  compoundsOptions,
  estatesOptions,
  landlordOptions,
  getSearchData,
  type,
}) => {
  const [isCompound, setIsCompound] = useState(false);
  const { t: key } = useTranslation();
  const { dateGreater, dateValidation, selectOptionValidationTypeString } =
    useValidation();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const token = JSON.parse(localStorage.getItem("token"));
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const currentLang = isArLang ? "ar" : "en";
  const permissionArr =
    type !== "contractsReport" ? "FINANCIAL_REPORTS" : "CONTRACTS_REPORTS";
  const requiredLabel = <span className="text-danger">*</span>;

  const paymentStatusOptions = [
    { label: key("paid"), value: "paid" },
    { label: key("pending"), value: "pending" },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    landlord: "",
    estate: "",
    compound: "",
    startDate: "",
    endDate: "",
    status: "",
  };

  const onSubmit = (values) => {
    let updatedValues;
    if (type === "paymentsReport" || type === "contractsReport") {
      updatedValues = {
        startDueDate: values.startDate,
        endDueDate: values.endDate,
      };
    } else {
      updatedValues = {
        startDate: values.startDate,
        endDate: values.endDate,
      };
    }

    if (!isCompound && values.estate) {
      updatedValues.estate = values.estate.value;
    } else if (isCompound && values.compound) {
      updatedValues.compound = values.compound.value;
    }

    if (values.landlord) {
      updatedValues.landlord = values.landlord.value;
    }

    if (values.status) {
      updatedValues.status = values.status;
    }

    console.log(updatedValues);
    const cleanedValues = cleanUpData({ ...updatedValues });

    let endPoint = "income";

    switch (type) {
      case "incomeReport":
        endPoint = "income";
        break;
      case "incomeReportDetails":
        endPoint = "income-details";
        break;
      case "paymentsReport":
        endPoint = "payments";
        break;
      case "contractsReport":
        endPoint = "contracts";
        break;

      default:
        break;
    }

    const printDataValues = {
      ...updatedValues,
    };
    if (values.landlord) {
      printDataValues.landlord = values.landlord?.label;
    }
    if (!isCompound && values.estate) {
      printDataValues.estate = values.estate?.label;
    } else if (isCompound && values.compound) {
      printDataValues.compound = values.compound?.label;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: cleanedValues,
            token: token,
            method: "post",
            type: `reports/${endPoint}`,
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                if (type === "contractsReport") {
                  getSearchData(data?.data, printDataValues);
                } else {
                  getSearchData(
                    data.data?.expenses,
                    data.data?.revenues,
                    printDataValues
                  );
                }
                resolve();
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
        pending: key(key("searching")),
        success: key("searchSucc"),
        error: key("searchFailed"),
      }
    );
  };

  const validationSchema = object({
    landlord: selectOptionValidationTypeString.nullable(),
    estate: selectOptionValidationTypeString.nullable(),
    compound: selectOptionValidationTypeString.nullable(),
    startDate: dateValidation,
    endDate: dateGreater,
    status: string().nullable(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            <Col lg={6} className="position-relative">
              <ul
                className={` d-flex flex-column flex-sm-row justify-content-center position-absolute top-0 mt-0 mt-sm-2 z-3 ${
                  isArLang ? styles.ar_icon : styles.en_icon
                } `}
              >
                <li
                  onClick={() => setIsCompound(true)}
                  className={`mx-2 ${
                    isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("estate")}
                </li>
                <li
                  onClick={() => setIsCompound(false)}
                  className={`mx-2 ${
                    !isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCouch}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("unit")}
                </li>
              </ul>
              {!isCompound ? (
                <div className="field mb-1">
                  <label htmlFor="estate">{key("theUnit")}</label>
                  <Select
                    id="estate"
                    name="estate"
                    options={estatesOptions}
                    value={values.estate}
                    onChange={(val) =>
                      setFieldValue("estate", val ? val : null)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                    isClearable
                  />
                  <ErrorMessage name="estate" component={InputErrorMessage} />
                </div>
              ) : (
                <div className="field mb-1">
                  <label htmlFor="compound">{key("compound")}</label>
                  <Select
                    id="compound"
                    name="compound"
                    options={compoundsOptions}
                    value={values.compound}
                    onChange={(val) =>
                      setFieldValue("compound", val ? val : "")
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                    isClearable
                  />
                  <ErrorMessage name="compound" component={InputErrorMessage} />
                </div>
              )}
            </Col>
            <Col lg={6}>
              <div className="field">
                <label htmlFor="landlord">{key("theLandlord")}</label>
                <Select
                  id="landlord"
                  name="landlord"
                  options={landlordOptions}
                  onChange={(val) => setFieldValue("landlord", val ? val : "")}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                  isClearable
                />
                <ErrorMessage name="landlord" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="startDate">
                  {key("startDate")}
                  {requiredLabel}
                </label>
                <Field type="date" id="startDate" name="startDate" />
                <ErrorMessage name="startDate" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="endDate">
                  {key("endDate")}
                  {requiredLabel}
                </label>
                <Field type="date" id="endDate" name="endDate" />
                <ErrorMessage name="endDate" component={InputErrorMessage} />
              </div>
            </Col>

            {type === "paymentsReport" ||
              (type === "contractsReport" && (
                <Col lg={6}>
                  <div className="field">
                    <label htmlFor="status">{key("status")}</label>
                    <Select
                      id="status"
                      name="status"
                      options={
                        type === "contractsReport"
                          ? contractStatusOptions[currentLang]
                          : paymentStatusOptions
                      }
                      onChange={(val) =>
                        setFieldValue("status", val ? val.value : "")
                      }
                      className={`${isArLang ? "text-end" : "text-start"}`}
                      isRtl={isArLang ? true : false}
                      placeholder={isArLang ? "" : "select"}
                      isClearable
                    />
                    <ErrorMessage name="status" component={InputErrorMessage} />
                  </div>
                </Col>
              ))}

            <div className="d-flex  align-items-center mt-3 px-4">
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={[permissionArr]}
              >
                <button className="submit_btn" type={isPending ? "button" : "submit"}>
                  {isPending ? (
                    <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                  ) : (
                    key("getReport")
                  )}
                </button>
              </CheckPermissions>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default ReportsForm;
