import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import CheckPermissions from "../../../../Components/CheckPermissions/CheckPermissions";
import { cleanUpData } from "../../../../Components/Logic/LogicFun";

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
  toast,
  object,
  string,
  array,
} from "../../../../shared/constants";
import {
  useMutation,
  useSelector,
  useTranslation,
  useValidation,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const CompoundsReportForm = ({
  compoundsOptions,
  landlordOptions,
  getSearchData,
  type,
}) => {
  const { t: key } = useTranslation();
  const {
    dateGreater,
    dateValidation,
    mainReqValidation,
    selectOptionValidationTypeString,
  } = useValidation();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const token = JSON.parse(localStorage.getItem("token"));
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const requiredLabel = <span className="text-danger">*</span>;
  const isDetails = type === "compoundDetailsReport";

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const myInitalValues = isDetails
    ? { compoundId: "", startDate: "", endDate: "" }
    : { landlord: "", compoundsIds: [], startDate: "", endDate: "" };

  const initialValues = myInitalValues;

  const onSubmit = (values) => {
    let updatedValues = { ...values };
    if (updatedValues.landlord) {
      updatedValues.landlord = updatedValues.landlord.value;
    }
    if (updatedValues.compoundsIds) {
      updatedValues.compoundsIds = updatedValues.compoundsIds.map(
        (comp) => comp.value
      );
    }

    const cleanedValues = cleanUpData({ ...updatedValues });
    const endPoint = isDetails ? "compound-details" : "compounds";

    const printDataValues = { ...updatedValues };
    if (printDataValues.landlord) {
      printDataValues.landlord = values.landlord?.label;
    }
    if (printDataValues.compoundId) {
      printDataValues.compoundId = printDataValues.compoundId.label;
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
              if (data?.status === "success") {
                if (isDetails) {
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

  const myValidationSchema = isDetails
    ? object({
        compoundId: mainReqValidation,
        startDate: dateValidation,
        endDate: dateGreater,
      })
    : object({
        landlord: selectOptionValidationTypeString.nullable(),
        compoundsIds: array()
          .of(
            object().shape({
              label: string().required(key("labelReq")),
              value: string().required(key("valueReq")),
            })
          )
          .nullable(),
        startDate: dateValidation,
        endDate: dateGreater,
      });

  const validationSchema = myValidationSchema;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ setFieldValue }) => (
        <Form>
          <Row>
            <Col sm={isDetails ? 12 : 6}>
              {isDetails ? (
                <div className="field">
                  <label htmlFor="compoundId">
                    {key("compound")} {requiredLabel}
                  </label>
                  <Select
                    isClearable
                    options={compoundsOptions}
                    onChange={(val) =>
                      setFieldValue("compoundId", val ? val.value : "")
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder=""
                  />
                  <ErrorMessage
                    name="compoundId"
                    component={InputErrorMessage}
                  />
                </div>
              ) : (
                <div className="field">
                  <label htmlFor="compoundsIds">{key("compounds")}</label>
                  <Select
                    isClearable
                    options={compoundsOptions}
                    isMulti
                    onChange={(val) => setFieldValue("compoundsIds", val)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder=""
                  />
                  <ErrorMessage
                    name="compoundsIds"
                    component={InputErrorMessage}
                  />
                </div>
              )}
            </Col>
            {!isDetails && (
              <Col lg={6}>
                <div className="field">
                  <label htmlFor="landlord">{key("theLandlord")}</label>
                  <Select
                    id="landlord"
                    name="landlord"
                    options={landlordOptions}
                    onChange={(val) =>
                      setFieldValue("landlord", val ? val : "")
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder=""
                    isClearable
                  />
                  <ErrorMessage name="landlord" component={InputErrorMessage} />
                </div>
              </Col>
            )}
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

            <div className="d-flex  align-items-center mt-3 px-4">
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["COMPOUNDS_REPORTS"]}
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

export default CompoundsReportForm;
