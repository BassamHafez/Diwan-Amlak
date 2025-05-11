import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import {
  checkBoxCircle,
  maxEstatesInCompoundOriginalOptions,
  packagesDuration,
} from "../../../../Components/Logic/StaticLists";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
} from "../../../../shared/index";
import { faSpinner, toast, object } from "../../../../shared/constants";
import {
  useMutation,
  useSelector,
  useTranslation,
  useValidation,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { Row, Col } from "../../../../shared/bootstrap";

const UpdatePackages = ({ pack, refetch, hideModal }) => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const {
    mainReqValidation,
    positiveNumbersValidation,
    selectOptionValidationTypeNumber,
  } = useValidation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";

  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const findFeaturesValue = (labelName) => {
    const featureObj = pack?.features?.find(
      (feature) =>
        feature.label.trim().toLowerCase() === labelName.trim().toLowerCase()
    );
    return featureObj?.value;
  };

  const initialValues = {
    arTitle: pack.arTitle || "",
    enTitle: pack.enTitle || "",
    price: pack.price || 0,
    originalPrice: pack.originalPrice || 0,
    isBestOffer: pack.isBestOffer || false,
    isMostPopular: pack.isMostPopular || false,
    duration: packagesDuration[currentLang]?.find(
      (item) => item.value === pack?.duration
    ),
    usersCount:
      Number(findFeaturesValue("allowedUsers").toLowerCase().trim()) || 0,
    compoundsCount:
      Number(findFeaturesValue("allowedCompounds").trim().toLowerCase()) || 0,
    estatesCount: Number(findFeaturesValue("allowedEstates")) || 0,
    maxEstatesInCompound: {
      label: findFeaturesValue("maxEstatesInCompound"),
      value: Number(findFeaturesValue("maxEstatesInCompound")) || 0,
    },
    isFavoriteAllowed:
      findFeaturesValue("isFavoriteAllowed") === "true" || false,
    isRemindersAllowed:
      findFeaturesValue("isRemindersAllowed") === "true" || false,
    isAnalysisAllowed:
      findFeaturesValue("isAnalysisAllowed") === "true" || false,
    isCompoundsReportsAllowed:
      findFeaturesValue("isCompoundsReportsAllowed") === "true" || false,
    isFilesExtractAllowed:
      findFeaturesValue("isFilesExtractAllowed") === "true" || false,
    isFinancialReportsAllowed:
      findFeaturesValue("isFinancialReportsAllowed") === "true" || false,
    isOperationalReportsAllowed:
      findFeaturesValue("isOperationalReportsAllowed") === "true" || false,
    isServiceContactsAllowed:
      findFeaturesValue("isServiceContactsAllowed") === "true" || false,
    isTasksAllowed: findFeaturesValue("isTasksAllowed") === "true" || false,
    isUserPermissionsAllowed:
      findFeaturesValue("isUserPermissionsAllowed") === "true" || false,
  };

  const onSubmit = (values, { resetForm }) => {
    const featuresArr = [
      { label: "allowedUsers", value: `${values.usersCount || 0}` },
      { label: "allowedCompounds", value: `${values.compoundsCount || 0}` },
      { label: "allowedEstates", value: `${values.estatesCount || 0}` },
      {
        label: "maxEstatesInCompound",
        value: `${values.maxEstatesInCompound?.value || 0}`,
      },
      {
        label: "isFavoriteAllowed",
        value: `${values.isFavoriteAllowed || false}`,
      },
      {
        label: "isRemindersAllowed",
        value: `${values.isRemindersAllowed || false}`,
      },
      {
        label: "isAnalysisAllowed",
        value: `${values.isAnalysisAllowed || false}`,
      },
      {
        label: "isCompoundsReportsAllowed",
        value: `${values.isCompoundsReportsAllowed || false}`,
      },
      {
        label: "isOperationalReportsAllowed",
        value: `${values.isOperationalReportsAllowed || false}`,
      },
      {
        label: "isFinancialReportsAllowed",
        value: `${values.isFinancialReportsAllowed || false}`,
      },
      {
        label: "isFilesExtractAllowed",
        value: `${values.isFilesExtractAllowed || false}`,
      },
      {
        label: "isServiceContactsAllowed",
        value: `${values.isServiceContactsAllowed || false}`,
      },
      {
        label: "isTasksAllowed",
        value: `${values.isTasksAllowed || false}`,
      },
      {
        label: "isUserPermissionsAllowed",
        value: `${values.isUserPermissionsAllowed || false}`,
      },
    ];

    const updatedValues = {
      arTitle: values.arTitle,
      enTitle: values.enTitle,
      price: values.price,
      duration: values.duration?.value,
      originalPrice: values.originalPrice,
      isBestOffer: values.isBestOffer,
      isMostPopular: values.isMostPopular,
      features: featuresArr,
    };

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
            method: "patch",
            type: `packages/${pack._id}`,
          },
          {
            onSuccess: async (data) => {
<<<<<<< HEAD
              console.log(data);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
              if (data?.status === "success") {
                await refetch();
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
    arTitle: mainReqValidation.required(key("fieldReq")),
    enTitle: mainReqValidation.required(key("fieldReq")),
    price: positiveNumbersValidation.required(key("fieldReq")),
    originalPrice: positiveNumbersValidation,
    usersCount: positiveNumbersValidation,
    compoundsCount: positiveNumbersValidation,
    estatesCount: positiveNumbersValidation,
    duration: selectOptionValidationTypeNumber.required(key("fieldReq")),
    maxEstatesInCompound: selectOptionValidationTypeNumber.nullable(),
  });

  const listClasses = `checkbox-wrapper-15 my-3 ${
    isArLang ? "checkbox-wrapper_ar" : "checkbox-wrapper_en"
  }`;

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
            <Col sm={6}>
              <div className="field">
                <label htmlFor="arTitle">
                  {key("arTitle")} {requiredLabel}
                </label>
                <Field type="text" id="arTitle" name="arTitle" />
                <ErrorMessage name="arTitle" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="enTitle">
                  {key("enTitle")} {requiredLabel}
                </label>
                <Field type="text" id="enTitle" name="enTitle" />
                <ErrorMessage name="enTitle" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="price">
                  {key("newPrice")} {requiredLabel}
                </label>
                <Field type="number" id="price" name="price" />
                <ErrorMessage name="price" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="originalPrice">
                  {key("oldPrice")} {requiredLabel}
                </label>
                <Field type="number" id="originalPrice" name="originalPrice" />
                <ErrorMessage
                  name="originalPrice"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="usersCount">{key("usersCount")}</label>
                <Field type="number" id="usersCount" name="usersCount" />
                <ErrorMessage name="usersCount" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="compoundsCount">{key("compoundsCount")}</label>
                <Field
                  type="number"
                  id="compoundsCount"
                  name="compoundsCount"
                />
                <ErrorMessage
                  name="compoundsCount"
                  component={InputErrorMessage}
                />
              </div>
            </Col>

            <Col sm={6}>
              <div className="field">
                <label htmlFor="maxEstatesInCompound">
                  {key("maxEstatesInCompound")}
                </label>
                <Select
                  id="maxEstatesInCompound"
                  options={maxEstatesInCompoundOriginalOptions}
                  value={values.maxEstatesInCompound}
                  onChange={(val) =>
                    setFieldValue("maxEstatesInCompound", val ? val : null)
                  }
                  className={`${isArLang ? "text-end" : "text-start"} my-3`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                />
                <ErrorMessage
                  name="maxEstatesInCompound"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="packDuration">{key("packDuration")}</label>
                <Select
                  options={packagesDuration[currentLang]}
                  value={values.duration}
                  onChange={(val) =>
                    setFieldValue("duration", val ? val : null)
                  }
                  className={`${isArLang ? "text-end" : "text-start"} my-3`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
                  id="packDuration"
                />
                <ErrorMessage name="duration" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="estatesCount">{key("estatesCount")}</label>
                <Field type="number" id="estatesCount" name="estatesCount" />
                <ErrorMessage
                  name="estatesCount"
                  component={InputErrorMessage}
                />
              </div>
            </Col>
            <Col sm={12}>
              <Row>
                <Col sm={6}>
                  <ul className={`p-0 ${isArLang ? "text-end" : "text-start"}`}>
                    <li className={listClasses}>
                      <Field
                        name="isMostPopular"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isMostPopular"
                      />
                      <label className="cbx" htmlFor="isMostPopular">
                        {checkBoxCircle}
                        <span>{key("isMostPopular")}</span>
                      </label>
                    </li>

                    <li className={listClasses}>
                      <Field
                        name="isBestOffer"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isBestOffer"
                      />
                      <label className="cbx" htmlFor="isBestOffer">
                        {checkBoxCircle}
                        <span>{key("isBestOffer")}</span>
                      </label>
                    </li>

                    <li className={listClasses}>
                      <Field
                        name="isFavoriteAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isFavoriteAllowed"
                      />
                      <label className="cbx" htmlFor="isFavoriteAllowed">
                        {checkBoxCircle}
                        <span>
                          {key("add")} {key("bookmarked")}
                        </span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isRemindersAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isRemindersAllowed"
                      />
                      <label className="cbx" htmlFor="isRemindersAllowed">
                        {checkBoxCircle}
                        <span>{key("isRemindersAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isAnalysisAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isAnalysisAllowed"
                      />
                      <label className="cbx" htmlFor="isAnalysisAllowed">
                        {checkBoxCircle}
                        <span>{key("isAnalysisAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isTasksAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isTasksAllowed"
                      />
                      <label className="cbx" htmlFor="isTasksAllowed">
                        {checkBoxCircle}
                        <span>{key("isTasksAllowed")}</span>
                      </label>
                    </li>
                  </ul>
                </Col>
                <Col sm={6}>
                  <ul className={`p-0 ${isArLang ? "text-end" : "text-start"}`}>
                    <li className={listClasses}>
                      <Field
                        name="isCompoundsReportsAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isCompoundsReportsAllowed"
                      />
                      <label
                        className="cbx"
                        htmlFor="isCompoundsReportsAllowed"
                      >
                        {checkBoxCircle}
                        <span>{key("isCompoundsReportsAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isOperationalReportsAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isOperationalReportsAllowed"
                      />

                      <label
                        className="cbx"
                        htmlFor="isOperationalReportsAllowed"
                      >
                        {checkBoxCircle}
                        <span>{key("isOperationalReportsAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isFinancialReportsAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isFinancialReportsAllowed"
                      />

                      <label
                        className="cbx"
                        htmlFor="isFinancialReportsAllowed"
                      >
                        {checkBoxCircle}
                        <span>{key("isFinancialReportsAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isFilesExtractAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isFilesExtractAllowed"
                      />
                      <label className="cbx" htmlFor="isFilesExtractAllowed">
                        {checkBoxCircle}
                        <span>{key("isFilesExtractAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isServiceContactsAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isServiceContactsAllowed"
                      />
                      <label className="cbx" htmlFor="isServiceContactsAllowed">
                        {checkBoxCircle}
                        <span>{key("isServiceContactsAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <Field
                        name="isUserPermissionsAllowed"
                        type="checkbox"
                        className="inp-cbx d-none"
                        id="isUserPermissionsAllowed"
                      />
                      <label className="cbx" htmlFor="isUserPermissionsAllowed">
                        {checkBoxCircle}
                        <span>{key("isUserPermissionsAllowed")}</span>
                      </label>
                    </li>
                  </ul>
                </Col>
              </Row>
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

export default UpdatePackages;
