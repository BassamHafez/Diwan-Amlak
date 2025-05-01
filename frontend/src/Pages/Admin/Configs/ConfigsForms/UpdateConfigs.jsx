import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import fetchConfigs from "../../../../Store/configs-actions";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
} from "../../../../shared/index";
import {
  faSpinner,
  faSquare,
  toast,
  object,
  string,
  number,
} from "../../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useDispatch,
  useSelector,
} from "../../../../shared/hooks";
import { InputErrorMessage, LoadingOne } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const UpdateConfigs = () => {
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const requiredLabel = <span className="text-danger">*</span>;
  const dispatch = useDispatch();
  const configs = useSelector((state) => state.configs);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    MAIN_COLOR: configs?.mainColor || "",
    SECONDRY_COLOR: configs?.subColor || "",
    INSTAGRAM: configs?.instagramLink || "",
    TWITTER: configs?.twitterLink || "",
    WHATSAPP: configs?.whatsappNumber || "",
    EMAIL: configs?.email || "",
    VAT: Number(configs?.VAT?.trim()) || 0,
    TRIAL_DAYS:Number(configs?.TRIAL_DAYS?.trim())||0
  };

  const onSubmit = (values, { resetForm }) => {
    const updatedValues = { ...values };
    updatedValues.VAT = updatedValues.VAT?.toString();
    updatedValues.TRIAL_DAYS = updatedValues.TRIAL_DAYS?.toString();
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: updatedValues,
            token: token,
            method: "patch",
            type: "configs",
          },
          {
            onSuccess: (data) => {
              console.log(data);
              if (data?.status === "success") {
                dispatch(fetchConfigs());
                resolve();
                resetForm();
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
    MAIN_COLOR: string()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, key("invalidHex"))
      .required(key("fieldReq")),
    SECONDRY_COLOR: string()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, key("invalidHex"))
      .required(key("fieldReq")),
    TWITTER: string()
      .matches(
        /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(\w+)$/,
        key("invalidTwitterUrl")
      )
      .nullable(),
    INSTAGRAM: string()
      .matches(
        /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/,
        key("invalidInstagramUrl")
      )
      .nullable(),

    WHATSAPP: string().nullable(),
    EMAIL: string().email(key("invalidEmail")).nullable(),
    VAT: number().min(0, key("positiveValidation")).nullable(),
    TRIAL_DAYS: number().min(0, key("positiveValidation")).nullable(),
  });
  // .matches(/^((966)|00966)?5\d{8}$/, key("invalidWhatsApp"))
  return (
    <>
      {!configs && <LoadingOne />}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        <Form>
          <Row>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="MAIN_COLOR">
                  <FontAwesomeIcon
                    icon={faSquare}
                    className="mx-1"
                    style={{ color: `${configs?.mainColor}` }}
                  />
                  {key("MAIN_COLOR")} {requiredLabel}
                </label>
                <Field type="text" id="MAIN_COLOR" name="MAIN_COLOR" />
                <ErrorMessage name="MAIN_COLOR" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="SECONDRY_COLOR">
                  <FontAwesomeIcon
                    icon={faSquare}
                    className="mx-1"
                    style={{ color: `${configs?.subColor}` }}
                  />
                  {key("SECONDRY_COLOR")} {requiredLabel}
                </label>
                <Field type="text" id="SECONDRY_COLOR" name="SECONDRY_COLOR" />
                <ErrorMessage
                  name="SECONDRY_COLOR"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="INSTAGRAM">{key("INSTAGRAM")}</label>
                <Field type="text" id="INSTAGRAM" name="INSTAGRAM" />
                <ErrorMessage name="INSTAGRAM" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="TWITTER">{key("TWITTER")}</label>
                <Field type="text" id="TWITTER" name="TWITTER" />
                <ErrorMessage name="TWITTER" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="EMAIL">{key("EMAIL")}</label>
                <Field type="text" id="EMAIL" name="EMAIL" />
                <ErrorMessage name="EMAIL" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="WHATSAPP">{key("WHATSAPP")}</label>
                <Field type="text" id="WHATSAPP" name="WHATSAPP" />
                <ErrorMessage name="WHATSAPP" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="VAT">{key("VAT")} (%)</label>
                <Field type="number" id="VAT" name="VAT" />
                <ErrorMessage name="VAT" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field ltr_input">
                <label htmlFor="TRIAL_DAYS">{key("freeTrial")} ({key("inDays")})</label>
                <Field type="number" id="TRIAL_DAYS" name="TRIAL_DAYS" />
                <ErrorMessage name="TRIAL_DAYS" component={InputErrorMessage} />
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end align-items-center mt-3">
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
    </>
  );
};

export default UpdateConfigs;
