import styles from "./TaskForms.module.css";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import {
  prioritysOptions,
  taskTypeOptions,
} from "../../../../Components/Logic/StaticLists";
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
  faBuilding,
  faCouch,
  toast,
  object,
  string,
} from "../../../../shared/constants";
import {
  useState,
  useMutation,
  useQueryClient,
  useTranslation,
  useEstatesOptions,
  useCompoundOptions,
  useServicesContact,
  useAddContactInForms,
  useValidation,
  useSelector,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const AddTask = ({ hideModal, refetch, propId, compId }) => {
  const [isCompound, setIsCompound] = useState(compId ? true : false);

  const estatesOptions = useEstatesOptions();
  const { compoundsOptions } = useCompoundOptions();
  const { servicesOptions, refetchServices } = useServicesContact();
  const { AddServices } = useAddContactInForms({ refetchServices });
  const {
    positiveNumbersValidation,
    dateValidation,
    mainReqValidation,
    selectOptionValidationTypeString,
  } = useValidation();
  const queryClient = useQueryClient();
  const { t: key } = useTranslation();

  const token = useSelector((state) => state.userInfo.token);
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    title: "",
    description: "",
    date: "",
    compound: compId
      ? compoundsOptions?.find((comp) => comp.value === compId) || ""
      : "",
    estate: propId
      ? estatesOptions?.find((estate) => estate.value === propId) || ""
      : "",
    contact: "",
    type: "",
    cost: "",
    priority: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      ...values,
    };

    if (!isCompound && updatedValues.estate) {
      updatedValues.estate = updatedValues.estate.value;
      updatedValues.compound = "";
    } else if (isCompound && updatedValues.compound) {
      updatedValues.compound = updatedValues.compound.value;
      updatedValues.estate = "";
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
            type: `tasks`,
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                if (refetch) {
                  refetch();
                }
                if (compId || propId) {
                  queryClient.invalidateQueries(["tasks", token]);
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
        success: key("addedSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    title: mainReqValidation,
    date: dateValidation,
    estate: selectOptionValidationTypeString.nullable(),
    compound: selectOptionValidationTypeString.nullable(),
    contact: string().nullable(),
    type: mainReqValidation,
    cost: positiveNumbersValidation.required(key("fieldReq")),
    priority: mainReqValidation,
    description: string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            {AddServices}
            <Col sm={12}>
              <div className="field">
                <label htmlFor="title">
                  {key("title")} {requiredLabel}
                </label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={12}>
              <div className="field">
                <label htmlFor="taskDate">
                  {key("taskDate")} {requiredLabel}
                </label>
                <Field type="date" id="taskDate" name="date" />
                <ErrorMessage name="date" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="taskType">
                  {key("taskType")} {requiredLabel}
                </label>
                <Select
                  id="taskType"
                  name="type"
                  options={
                    isArLang ? taskTypeOptions["ar"] : taskTypeOptions["en"]
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
              <div className="field mb-1">
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
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="priority">
                  {key("priority")} {requiredLabel}
                </label>
                <Select
                  id="priority"
                  name="priority"
                  options={
                    isArLang ? prioritysOptions["ar"] : prioritysOptions["en"]
                  }
                  onChange={(val) => setFieldValue("priority", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="priority" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="cost">
                  {key("cost")} ({key("sarSmall")}) {requiredLabel}
                </label>
                <Field type="number" id="cost" name="cost" />
                <ErrorMessage name="cost" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
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
                    isDisabled={propId}
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
                      setFieldValue("compound", val ? val : null)
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                    isClearable
                    isDisabled={compId}
                  />
                  <ErrorMessage name="compound" component={InputErrorMessage} />
                </div>
              )}
            </Col>
            <Col
              md={6}
              className={`d-flex align-items-center ${
                compId || propId ? "d-none" : ""
              }`}
            >
              <ul className="h-100 d-flex flex-column justify-content-end">
                <li
                  onClick={() => setIsCompound(true)}
                  className={`my-1 ${
                    isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("compound")}
                </li>
                <li
                  onClick={() => setIsCompound(false)}
                  className={`my-1 ${
                    !isCompound ? styles.active : styles.unActive_choice
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCouch}
                    className={isArLang ? "ms-1" : "me-1"}
                  />
                  {key("theUnit")}
                </li>
              </ul>
            </Col>
            <Col sm={12}>
              <div className="field">
                <label htmlFor="description">{key("description")}</label>
                <Field
                  as="textarea"
                  className="text_area"
                  id="description"
                  name="description"
                />
                <ErrorMessage
                  name="description"
                  component={InputErrorMessage}
                />
              </div>
            </Col>

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

export default AddTask;
