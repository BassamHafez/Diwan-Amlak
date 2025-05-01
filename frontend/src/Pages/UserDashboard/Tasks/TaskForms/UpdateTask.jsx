import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import {
  prioritysOptions,
  taskTypeOptions,
} from "../../../../Components/Logic/StaticLists";
import { formattedDate } from "../../../../Components/Logic/LogicFun";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../../shared/index";
import { faSpinner, toast, object, string } from "../../../../shared/constants";
import {
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

const UpdateTask = ({ hideModal, refetch, task, propId, compId }) => {
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
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    title: task.title || "",
    description: task.description || "",
    date: formattedDate(task.date) || "",
    compound: task.compound
      ? compoundsOptions?.find((comp) => comp.value === task.compound._id) || ""
      : "",
    estate: task.estate
      ? estatesOptions?.find((estate) => estate.value === task.estate._id) || ""
      : "",
    contact: task.contact
      ? servicesOptions?.find(
          (contact) => contact.value === task.contact._id
        ) || ""
      : "",
    type: isArLang
      ? taskTypeOptions["ar"]?.find(
          (taskOption) => taskOption.value === task.type?.trim()
        )
      : taskTypeOptions["en"]?.find(
          (taskOption) => taskOption.value === task.type?.trim()
        ) || "",
    cost: task.cost || "",
    priority: isArLang
      ? prioritysOptions["ar"]?.find((pri) => pri.value === task.priority)
      : prioritysOptions["en"]?.find((pri) => pri.value === task.priority) ||
        "",
  };


  const onSubmit = (values, { resetForm }) => {
    const updatedValues = {
      title: values.title,
      date: values.date,
      type: values.type.value,
      cost: values.cost.toString(),
      priority: values.priority.value,
    };

    if (task.estate && values.estate) {
      updatedValues.estate = values.estate.value;
    }
    if (task.compound && values.compound) {
      updatedValues.compound = values.compound.value;
    }

    if (values.contact) {
      updatedValues.contact = values.contact.value;
    }
    if (values.description) {
      updatedValues.description = values.description;
    }

    console.log(updatedValues);

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "patch",
            type: `tasks/${task._id}`,
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
        success: key("updatedSucc"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object({
    title: mainReqValidation,
    date: dateValidation,
    estate: selectOptionValidationTypeString.nullable(),
    compound: selectOptionValidationTypeString.nullable(),
    contact: selectOptionValidationTypeString.nullable(),
    type: selectOptionValidationTypeString.required(key("fieldReq")),
    cost: positiveNumbersValidation.required(key("fieldReq")),
    priority: selectOptionValidationTypeString.required(key("fieldReq")),
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
                <label htmlFor="contact">
                  {key("singleContactType")} {requiredLabel}
                </label>
                <Select
                  id="contact"
                  name="contact"
                  value={values.contact}
                  options={servicesOptions}
                  onChange={(val) => setFieldValue("contact", val ? val : null)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="contact" component={InputErrorMessage} />
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
                  value={values.type}
                  options={
                    isArLang ? taskTypeOptions["ar"] : taskTypeOptions["en"]
                  }
                  onChange={(val) => setFieldValue("type", val || null)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="type" component={InputErrorMessage} />
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
              <div className="field mb-1">
                <label htmlFor="priority">
                  {key("priority")} {requiredLabel}
                </label>
                <Select
                  id="priority"
                  name="priority"
                  value={values.priority}
                  options={
                    isArLang ? prioritysOptions["ar"] : prioritysOptions["en"]
                  }
                  onChange={(val) => setFieldValue("priority", val || null)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="priority" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              {task.compound ? (
                <div className="field mb-1">
                  <label htmlFor="compound">
                    {key("compound")} {requiredLabel}
                  </label>
                  <Select
                    id="compound"
                    name="compound"
                    value={values.compound}
                    options={compoundsOptions}
                    onChange={(val) => setFieldValue("compound", val || null)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                    isDisabled={compId}
                  />
                  <ErrorMessage name="compound" component={InputErrorMessage} />
                </div>
              ) : (
                <div className="field mb-1">
                  <label htmlFor="estate">{key("theUnit")}</label>
                  <Select
                    id="estate"
                    name="estate"
                    options={estatesOptions}
                    value={values.estate}
                    onChange={(val) => setFieldValue("estate", val || null)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                    isDisabled={propId}
                  />
                  <ErrorMessage name="estate" component={InputErrorMessage} />
                </div>
              )}
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
                  key("update")
                )}
              </button>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateTask;
