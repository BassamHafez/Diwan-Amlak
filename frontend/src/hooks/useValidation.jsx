import { string, ref, number, object, date, array } from "../shared/constants";
import { useMemo, useTranslation } from "../shared/hooks";

const useValidation = () => {
  const { t: key } = useTranslation();

  //general
  const mainReqValidation = useMemo(
    () => string().required(`${key("fieldReq")}`),
    [key]
  );

  //user data
  const nameValidation = useMemo(
    () =>
      string()
        .min(3, `${key("nameValidation1")}`)
        .max(20, `${key("nameValidation2")}`)
        .required(`${key("nameValidation3")}`),
    [key]
  );

  const phoneValidation = useMemo(
    () => string().matches(/^05\d{8}$/, key("invalidPhone")),
    [key]
  );

  const emailValidation = useMemo(
    () =>
      string()
        .email(`${key("emailValidation1")}`)
        .required(`${key("emailValidation2")}`),
    [key]
  );

  const passwordValidation = useMemo(
    () =>
      string()
        .min(5, key("min5"))
        .required(key("fieldReq"))
        .matches(/[A-Z]+/, key("validationUpperCase"))
        .matches(/[a-z]+/, key("validationLowerCase"))
        .matches(/[0-9]+/, key("validationNumber")),
    [key]
  );

  const confirmPasswordValidation = useMemo(
    () =>
      string()
        .oneOf([ref("password"), null], `${key("passwordMismatch")}`)
        .required(`${key("fieldReq")}`),
    [key]
  );

  //messages (text Area)
  const messageValidation = useMemo(
    () =>
      string()
        .min(5, key("min5"))
        .required(`${key("fieldReq")}`),
    [key]
  );
  const noteValidation = useMemo(() => string().min(5, key("min5")), [key]);

  //numbers
  const positiveNumbersValidation = useMemo(
    () => number().min(0, key("positiveValidation")),
    [key]
  );

  //date
  const dateValidation = useMemo(() => date().required(key("fieldReq")), [key]);

  const monthsValidation = useMemo(
    () =>
      number()
        .min(1, key("invalidMonth"))
        .max(12, key("invalidMonth"))
        .required(key("fieldReq")),
    [key]
  );
  const noFutureDateValidation = useMemo(
    () =>
      date()
        .required(key("fieldReq"))
        .test(
          "is-present-or-future",
          key("startDateValidation"),
          function (value) {
            if (!value) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return new Date(value) >= today;
          }
        ),
    [key]
  );

  const dateGreater = useMemo(
    () =>
      date()
        .required(key("fieldReq"))
        .test("is-greater", key("endDateValidation"), function (value) {
          const { startDate } = this.parent;
          return value > startDate;
        }),
    [key]
  );
  const endDateValidation = useMemo(
    () =>
      date()
        .test(
          "is-present-or-future",
          key("startDateValidation"),
          function (value) {
            if (!value) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return new Date(value) >= today;
          }
        )
        .required(key("fieldReq"))
        .test("is-greater", key("endDateValidation"), function (value) {
          const { startDate } = this.parent;
          return value > startDate;
        }),
    [key]
  );

  //select options
  const selectOptionValidationTypeNumber = useMemo(
    () =>
      object().shape({
        label: string(),
        value: number(),
      }),
    []
  );
  const selectOptionValidationTypeString = useMemo(
    () =>
      object().shape({
        label: string(),
        value: string(),
      }),
    []
  );
  const arrOfOptionsValidation = useMemo(
    () =>
      array().of(
        object().shape({
          label: string().required(key("labelReq")),
          value: string().required(key("valueReq")),
        })
      ),
    [key]
  );

  //additional data
  const waterCountValidation = useMemo(
    () => string().matches(/^\d{10}$/, key("waterMinValidation")),
    [key]
  );

  const elecCountValidation = useMemo(
    () => string().matches(/^\d{11}$/, key("elcMinValidation")),
    [key]
  );

  const commercialRecordValidation = useMemo(
    () => string().matches(/^\d{10}$/, key("CommercialValidation")),
    [key]
  );
  const taxNumberValidation = useMemo(
    () => string().matches(/^3\d{14}$/, key("taxNumberValidation")),
    [key]
  );

  return {
    mainReqValidation,
    phoneValidation,
    passwordValidation,
    confirmPasswordValidation,
    emailValidation,
    nameValidation,
    messageValidation,
    noteValidation,
    positiveNumbersValidation,
    selectOptionValidationTypeNumber,
    selectOptionValidationTypeString,
    dateValidation,
    monthsValidation,
    dateGreater,
    noFutureDateValidation,
    endDateValidation,
    waterCountValidation,
    elecCountValidation,
    arrOfOptionsValidation,
    commercialRecordValidation,
    taxNumberValidation,
  };
};

export default useValidation;
