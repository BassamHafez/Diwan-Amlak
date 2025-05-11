import styles from "./PropertyForms.module.css";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
  CreatableSelect,
} from "../../../shared/index";
import {
  faImage,
  faSpinner,
  toast,
  object,
  string,
} from "../../../shared/constants";
import {
  useState,
  useMutation,
  useTranslation,
  useDispatch,
  useFileHandler,
  useContactsOptions,
  useTagsOption,
  useAddContactInForms,
  useValidation,
  useSelector,
} from "../../../shared/hooks";
import {
  CheckMySubscriptions,
  InputErrorMessage,
} from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import {
  citiesByRegion,
  citiesByRegionAr,
  SaudiRegion,
  SaudiRegionAr,
} from "../../../Components/Logic/StaticLists";
import fetchAccountData from "../../../Store/accountInfo-actions";

const AddCompound = ({ hideModal, refetch }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const { tagsOptions, refetchTags } = useTagsOption();
  const { brokersOptions, landlordOptions, refetchLandlord, refetchBroker } =
    useContactsOptions();
  const { addBrokersAndLandLords } = useAddContactInForms({
    refetchBroker,
    refetchLandlord,
  });
  const { positiveNumbersValidation, mainReqValidation, messageValidation } =
    useValidation();
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const token = useSelector((state) => state.userInfo.token);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  const dispatch = useDispatch();
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const notifyError = (message) => toast.error(message);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    name: "",
    description: "",
    region: "",
    city: "",
    neighborhood: "",
    address: "",
    tags: [],
    broker: "",
    commissionPercentage: 0,
    landlord: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    if (!selectedFile) {
      notifyError(key("uploadPhoto"));
      return;
    }
    if (values.broker && !values.commissionPercentage) {
      formData.append("commissionPercentage", 0);
    }
    formData.append("image", selectedFile);
    Object.entries(values).forEach(([key, value]) => {
      if (key === "tags" && Array.isArray(value)) {
        value.forEach((tag, index) =>
          formData.append(`tags[${index}]`, tag.value)
        );
      } else if (value) {
        formData.append(key, value);
      }
    });

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "post",
            type: "compounds",
          },
          {
            onSuccess: async (data) => {
<<<<<<< HEAD
              console.log(data);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
              if (data?.status === "success") {
                await refetch();
                dispatch(fetchAccountData(token));
                if (values.tags?.length > 0) {
                  refetchTags();
                }
                resolve();
                resetForm();
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
    name: mainReqValidation,
    description: messageValidation,
    city: mainReqValidation,
    region: mainReqValidation,
    neighborhood: string(),
    address: string(),
    lessor: string(),
    broker: string(),
    commissionPercentage: positiveNumbersValidation,
  });

  const handleRegionChange = (selectedRegion, setFieldValue) => {
    setFieldValue("region", selectedRegion?.value || "");
    setFieldValue("city", "");
    let cities;
    if (isArLang) {
      cities = citiesByRegionAr[selectedRegion?.value] || [];
    } else {
      cities = citiesByRegion[selectedRegion?.value] || [];
    }

    setCityOptions(cities);
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
              <Col sm={12}>{addBrokersAndLandLords}</Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="name">
                    {key("name")} {requiredLabel}
                  </label>
                  <Field type="text" id="name" name="name" />
                  <ErrorMessage name="name" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="tags">{key("searchKeys")}</label>
                  <CreatableSelect
                    isClearable
                    options={tagsOptions}
                    isMulti
                    onChange={(val) => setFieldValue("tags", val)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                    formatCreateLabel={(inputValue) =>
                      isArLang ? `إضافة "${inputValue}"` : `Add "${inputValue}"`
                    }
                  />
                  <ErrorMessage name="tags" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="region">
                    {key("region")} {requiredLabel}
                  </label>
                  <Select
                    id="region"
                    name="region"
                    options={isArLang ? SaudiRegionAr : SaudiRegion}
                    onChange={(selected) =>
                      handleRegionChange(selected, setFieldValue)
                    }
                    value={
                      (isArLang ? SaudiRegionAr : SaudiRegion).find(
                        (opt) => opt.value === values.region
                      ) || null
                    }
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                  />
                  <ErrorMessage name="region" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label>
                    {key("city")} {requiredLabel}
                  </label>
                  <Select
                    options={cityOptions}
                    onChange={(selected) =>
                      setFieldValue("city", selected?.value || "")
                    }
                    value={
                      cityOptions.find((opt) => opt.value === values.city) ||
                      null
                    }
                    isDisabled={!values.region}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                  />
                  <ErrorMessage name="city" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="neighborhood">{key("district")}</label>
                  <Field type="text" id="neighborhood" name="neighborhood" />
                  <ErrorMessage
                    name="neighborhood"
                    component={InputErrorMessage}
                  />
                </div>
                <div className="field mb-1">
                  <label htmlFor="address">{key("address")}</label>
                  <Field type="text" id="address" name="address" />
                  <ErrorMessage name="address" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="description">
                    {key("description")} {requiredLabel}
                  </label>
                  <Field
                    className="text_area"
                    as="textarea"
                    id="description"
                    name="description"
                  />
                  <ErrorMessage
                    name="description"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="broker">{key("agent")}</label>
                  <Select
                    id="broker"
                    name="broker"
                    options={brokersOptions}
                    onChange={(val) => setFieldValue("broker", val.value)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                  />
                  <ErrorMessage name="broker" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="landlord">{key("theLandlord")}</label>
                  <Select
                    id="landlord"
                    name="landlord"
                    options={landlordOptions}
                    onChange={(val) => setFieldValue("landlord", val.value)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                  />
                  <ErrorMessage name="landlord" component={InputErrorMessage} />
                </div>
              </Col>
              {values.broker && (
                <Col sm={6}>
                  <div className="field mb-1">
                    <label htmlFor="commissionPercentage">
                      {key("commissionPercentage")} (%)
                    </label>
                    <Field
                      type="number"
                      id="commissionPercentage"
                      name="commissionPercentage"
                    />
                    <ErrorMessage
                      name="commissionPercentage"
                      component={InputErrorMessage}
                    />
                  </div>
                </Col>
              )}
              <Col sm={12}>
                <div className={styles.photo_field}>
                  <h6 className="mb-3">{key("compoundImage")}</h6>
                  <label
                    className={
                      imagePreviewUrl
                        ? styles.photo_label_img
                        : styles.photo_label
                    }
                    htmlFor="compoundImage"
                  >
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Uploaded_image"
                        className={styles.image_preview}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className={styles.img_icon}
                        icon={faImage}
                      />
                    )}
                  </label>
                  <input
                    type="file"
                    id="compoundImage"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="d-none"
                  />
                  <ErrorMessage name="image" component={InputErrorMessage} />
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center flex-wrap mt-3 px-3">
              <button onClick={hideModal} className="cancel_btn my-2">
                {key("cancel")}
              </button>
              <CheckMySubscriptions
                name="allowedEstates"
                type="number"
                accountInfo={accountInfo}
              >
                <button className="submit_btn my-2" type={isPending ? "button" : "submit"}>
                  {isPending ? (
                    <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                  ) : (
                    key("add")
                  )}
                </button>
              </CheckMySubscriptions>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddCompound;
