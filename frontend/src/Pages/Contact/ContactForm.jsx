import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { ErrorMessage, Field, Form, Formik } from "../../shared/index";
import { toast, object } from "../../shared/constants";
import {
  useMutation,
  useTranslation,
  useSelector,
  useValidation,
} from "../../shared/hooks";
import { InputErrorMessage, ButtonTwo } from "../../shared/components";
import { Row, Col } from "../../shared/bootstrap";
import { cleanUpData } from "../../Components/Logic/LogicFun";

const ContactForm = ({ isVip, hideModal }) => {
  const token = useSelector((state) => state.userInfo.token);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const { t: key } = useTranslation();
  const {
    mainReqValidation,
    phoneValidation,
    emailValidation,
    nameValidation,
    messageValidation,
  } = useValidation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: profileInfo?.name || "",
    email: profileInfo?.email || "",
    phone: profileInfo?.phone || "",
    subject: isVip ? "VIP Package" : "",
    message: isVip ? key("eliteIntialMessage") : "",
  };

  const onSubmit = (values, { resetForm }) => {
    const cleanedValues = cleanUpData({ ...values });
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: cleanedValues,
            token: token,
            method: "post",
            type: `support/messages`,
          },
          {
            onSuccess: (data) => {
              if (data?.status === "success") {
                resetForm();
                if (hideModal && isVip) {
                  hideModal();
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
        pending: key(key("sendingMessage")),
        success: isVip ? key("weWillContactYou") : key("sentSuccess"),
        error: key("wrong"),
      }
    );
  };

  const validationSchema = object().shape({
    name: nameValidation,
    email: emailValidation,
    subject: mainReqValidation,
    message: messageValidation,
    phone: phoneValidation,
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
          <Col md={6}>
            <div className="field">
              <label htmlFor="name">
                {key("name")} {requiredLabel}
              </label>
              <Field id="name" type="text" name="name" />
              <ErrorMessage name="name" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={6}>
            <div className="field">
              <label htmlFor="email">
                {key("email")} {requiredLabel}
              </label>
              <Field id="email" type="email" name="email" />
              <ErrorMessage name="email" component={InputErrorMessage} />
            </div>
          </Col>
          <Col md={6}>
            <div className="field">
              <label htmlFor="phoneInput">{key("phone")}</label>
              <Field
                type="tel"
                id="phoneInput"
                name="phone"
                placeholder="05XXXXXXXX"
              />
              <ErrorMessage name="phone" component={InputErrorMessage} />
            </div>
          </Col>
          {!isVip && (
            <Col md={6}>
              <div className="field">
                <label htmlFor="subject">
                  {key("subject")} {requiredLabel}
                </label>
                <Field id="subject" type="text" name="subject" />
                <ErrorMessage name="subject" component={InputErrorMessage} />
              </div>
            </Col>
          )}
          <Col md={12}>
            <div className="field">
              <label htmlFor="message">
                {key("message")} {requiredLabel}
              </label>
              <Field
                id="message"
                as="textarea"
                className="text_area"
                name="message"
                rows="3"
              />
              <ErrorMessage name="message" component={InputErrorMessage} />
            </div>
          </Col>
        </Row>

        <div className="text-center">
          <ButtonTwo
            type={isPending ? "button" : "submit"}
            text={key("sendMsg")}
          />
        </div>
      </Form>
    </Formik>
  );
};

export default ContactForm;
