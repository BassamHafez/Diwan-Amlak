import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import DateField from "../../../../Components/Fields/DateField";
import {
  countriesOptions,
  tenantTypeOptions,
} from "../../../../Components/Logic/StaticLists";
import {
  cleanUpData,
  formattedDate,
} from "../../../../Components/Logic/LogicFun";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../../shared/index";
import { faSpinner, toast, object, string } from "../../../../shared/constants";
import { useMutation, useSelector, useTranslation, useValidation } from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const UpdateContactForm = ({
  hideModal,
  contactType,
  refetch,
  refetchAllContacts,
  contact,
}) => {

  const { phoneValidation, mainReqValidation,noteValidation } = useValidation();
  const { t: key } = useTranslation();

  const token = useSelector((state) => state.userInfo.token);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const notifyError = (message) => toast.error(message);
  const requiredLabel = <span className="text-danger">*</span>;
  const currenLang = isArLang ? "ar" : "en";

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    name: contact?.name || "",
    phone: contact?.phone || "",
    phone2: contact?.phone2 || "",
    notes: contact?.notes || "",
    type: contact?.type || "",
    nationalId: contact?.nationalId || "",
    address: contact?.address || "",
    commercialRecord: contact?.commercialRecord || "",
    taxNumber: contact?.taxNumber || "",
    contactType: contactType || "",
    nationality:
      countriesOptions[currenLang]?.find(
        (country) => country.value === contact?.nationality
      ) || "",
    birthDate: formattedDate(contact?.birthDate) || "",
  };

  const onSubmit = (values, { resetForm }) => {
    const {
      contactType,
      commercialRecord,
      taxNumber,
      nationality,
      birthDate,
      ...updatedValues
    } = values;

    if (commercialRecord)
      updatedValues.commercialRecord = String(commercialRecord);
    if (taxNumber) updatedValues.taxNumber = String(taxNumber);
    if (nationality) {
      updatedValues.nationality = nationality.value;
    }

    if (birthDate) {
      const today = new Date();
      const selectedDate = new Date(birthDate);
      const age = today.getFullYear() - selectedDate.getFullYear();
      const isBirthdayPassed =
        today.getMonth() > selectedDate.getMonth() ||
        (today.getMonth() === selectedDate.getMonth() &&
          today.getDate() >= selectedDate.getDate());

      if (selectedDate > today) {
        notifyError(key("noFutureDate"));
        return;
      }
      if (age < 18 || (age === 18 && !isBirthdayPassed)) {
        notifyError(key("atLeast18"));
        return;
      }

      updatedValues.birthDate = birthDate;
    }

    const cleanedValues = cleanUpData(updatedValues);

    if ("type" in cleanedValues) {
      delete cleanedValues.type;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: cleanedValues,
            token: token,
            method: "patch",
            type: `contacts/${contactType}s/${contact._id}`,
          },
          {
            onSuccess: (data) => {
              if (data?.status === "success") {
                if (refetch) {
                  refetch();
                }
                refetchAllContacts();
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

  const validationSchema = object().shape({
    name:mainReqValidation,
    phone:phoneValidation.required(key("fieldReq")),
    phone2:phoneValidation,
    notes: noteValidation,
    nationalId: string().when("type", {
      is: (type) => type === "individual",
      then: (schema) =>
        schema
          .matches(/^(1|2)\d{9}$/, key("nationalIdValidation"))
          .required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
    address: string().when("type", {
      is: (type) => type === "organization",
      then: (schema) => schema.required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
    commercialRecord: string().when("type", {
      is: (type) => type === "organization",
      then: (schema) =>
        schema
          .matches(/^\d{10}$/, key("CommercialValidation"))
          .required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
    taxNumber: string().when("type", {
      is: (type) => type === "organization",
      then: (schema) =>
        schema
          .matches(/^3\d{14}$/, key("taxNumberValidation"))
          .required(key("fieldReq")),
      otherwise: (schema) => schema,
    }),
    nationality: object()
      .shape({
        label: string(),
        value: string(),
      })
      .when("type", {
        is: (type) => type === "individual",
        then: (schema) => schema.required(key("fieldReq")),
        otherwise: (schema) => schema,
      }),
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
          <div className="field">
            <label htmlFor="name">
              {key("name")} {requiredLabel}
            </label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component={InputErrorMessage} />
          </div>
          {contactType === "tenant" && (
            <>
              <div className="field mb-1">
                <label htmlFor="tenantType">
                  {key("tenantType")} {requiredLabel}
                </label>
                <Select
                  id="tenantType"
                  name="type"
                  options={tenantTypeOptions[currenLang]}
                  onChange={(val) => setFieldValue("type", val.value)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                  value={tenantTypeOptions[currenLang]?.find(
                    (val) => val.value === contact.type
                  )}
                  isDisabled={true}
                />
                <ErrorMessage name="type" component={InputErrorMessage} />
              </div>

              {contact?.type === "individual" && (
                <Row>
                  <Col sm={6}>
                    <div className="field">
                      <label htmlFor="nationalId">
                        {key("nationalId")} {requiredLabel}
                      </label>
                      <Field type="text" id="nationalId" name="nationalId" />
                      <ErrorMessage
                        name="nationalId"
                        component={InputErrorMessage}
                      />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="field">
                      <label htmlFor="nationality">
                        {key("nationality")} {requiredLabel}
                      </label>
                      <Select
                        id="nationality"
                        name="nationality"
                        value={values.nationality}
                        options={countriesOptions[currenLang]}
                        onChange={(val) =>
                          setFieldValue("nationality", val ? val : null)
                        }
                        className={isArLang ? "text-end" : "text-start"}
                        isRtl={isArLang ? true : false}
                        placeholder=""
                      />
                      <ErrorMessage
                        name="nationality"
                        component={InputErrorMessage}
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="field">
                      <DateField
                        setFieldValue={setFieldValue}
                        value="birthDate"
                        defaultVal={values.birthDate}
                        labelText={key("dob")}
                      />
                    </div>
                  </Col>
                </Row>
              )}
              {contact?.type === "organization" && (
                <Row>
                  <Col sm={6}>
                    <div className="field">
                      <label htmlFor="address">
                        {key("address")} {requiredLabel}
                      </label>
                      <Field type="text" id="address" name="address" />
                      <ErrorMessage
                        name="address"
                        component={InputErrorMessage}
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="field">
                      <label htmlFor="commercialRecord">
                        {key("commercialRecord")} {requiredLabel}
                      </label>
                      <Field
                        type="number"
                        placeholder="XXXXXXXXXX"
                        id="commercialRecord"
                        name="commercialRecord"
                      />
                      <ErrorMessage
                        name="commercialRecord"
                        component={InputErrorMessage}
                      />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="field">
                      <label htmlFor="taxNumber">
                        {key("taxNumber")} {requiredLabel}
                      </label>
                      <Field
                        type="number"
                        placeholder="3XXXXXXXXXXXXXX"
                        id="taxNumber"
                        name="taxNumber"
                      />
                      <ErrorMessage
                        name="taxNumber"
                        component={InputErrorMessage}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </>
          )}

          <div className="field">
            <label htmlFor="phoneInput">
              {key("phone")} {requiredLabel}
            </label>
            <Field
              type="tel"
              id="phoneInput"
              name="phone"
              placeholder="05XXXXXXXX"
            />
            <ErrorMessage name="phone" component={InputErrorMessage} />
          </div>
          <div className="field">
            <label htmlFor="phoneInput2">{key("phone2")}</label>
            <Field
              type="tel"
              id="phoneInput2"
              name="phone2"
              placeholder="05XXXXXXXX"
            />
            <ErrorMessage name="phone2" component={InputErrorMessage} />
          </div>
          {contactType !== "tenant" && (
            <div className="field">
              <label htmlFor="notes">{key("notes")}</label>
              <Field
                as="textarea"
                className="text_area"
                id="notes"
                name="notes"
              />
              <ErrorMessage name="notes" component={InputErrorMessage} />
            </div>
          )}

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
      )}
    </Formik>
  );
};

export default UpdateContactForm;
