import styles from "./PropertyForms.module.css";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import {
  citiesByRegion,
  citiesByRegionAr,
  SaudiRegion,
  SaudiRegionAr,
} from "../../../Components/Logic/StaticLists";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  Select,
  CreatableSelect,
} from "../../../shared/index";
import { faSpinner, toast, object, string } from "../../../shared/constants";
import {
  useEffect,
  useState,
  useMutation,
  useQueryClient,
  useTranslation,
  useFileHandler,
  useTagsOption,
  useContactsOptions,
  useAddContactInForms,
  useValidation,
  useSelector,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const UpdateCompound = ({ compoundData, hideModal, refetch }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const {
    positiveNumbersValidation,
    elecCountValidation,
    waterCountValidation,
    messageValidation,
    mainReqValidation,
  } = useValidation();
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const { tagsOptions, refetchTags } = useTagsOption();
  const { brokersOptions, landlordOptions, refetchBroker, refetchLandlord } =
    useContactsOptions();
  const { addBrokersAndLandLords } = useAddContactInForms({
    refetchBroker,
    refetchLandlord,
  });
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.userInfo.token);

  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    name: compoundData?.name || "",
    description: compoundData?.description || "",
    region: compoundData?.region || "",
    city: compoundData?.city || "",
    neighborhood:
      (compoundData?.neighborhood !== "not specified"
        ? compoundData?.neighborhood
        : "") || "",
    address: compoundData?.address || "",
    tags:
      compoundData?.tags.map((tag) => {
        return { label: tag, value: tag };
      }) || [],
    broker: compoundData?.broker?._id || "",
    commissionPercentage: compoundData?.commissionPercentage || 0,
    landlord: compoundData?.landlord?._id || "",
    waterAccountNumber: compoundData?.waterAccountNumber || "",
    electricityAccountNumber: compoundData?.electricityAccountNumber || "",
  };

  const onSubmit = (values, { resetForm }) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("city", values.city);
    formData.append("region", values.region);
    formData.append("neighborhood", values.neighborhood || "not specified");

    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    if (values.address) {
      formData.append("address", values.address);
    }
    if (values.landlord) {
      formData.append("landlord", values.landlord);
    }
    if (values.broker) {
      formData.append("broker", values.broker);
      formData.append("commissionPercentage", values.commissionPercentage || 0);
    }
    if (values.waterAccountNumber) {
      formData.append(
        "waterAccountNumber",
        values.waterAccountNumber.toString()
      );
    }
    if (values.electricityAccountNumber) {
      formData.append(
        "electricityAccountNumber",
        values.electricityAccountNumber.toString()
      );
    }
    if (Array.isArray(values.tags)) {
      values.tags.forEach((obj, index) => {
        formData.append(`tags[${index}]`, obj.value);
      });
    }

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "patch",
            type: `compounds/${compoundData._id}`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (data?.status === "success") {
                await refetch();
                if (values.tags?.length > 0) {
                  refetchTags();
                }
                queryClient.invalidateQueries(["compounds", token]);
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
        success: key("updatedSucc"),
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
    broker: string(),
    lessor: string(),
    waterAccountNumber: waterCountValidation,
    electricityAccountNumber: elecCountValidation,
    commissionPercentage: positiveNumbersValidation,
  });

  useEffect(() => {
    const settingCityAndDistrictOptionsOptions = () => {
      let cities;
      if (isArLang) {
        cities = citiesByRegionAr[compoundData.region] || [];
      } else {
        cities = citiesByRegion[compoundData.region] || [];
      }

      setCityOptions(cities);
    };

    settingCityAndDistrictOptionsOptions();
  }, [compoundData, isArLang, key]);

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
        enableReinitialize
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
                    onChange={(val) => setFieldValue("city", val?.value || "")}
                    value={
                      cityOptions.find((opt) => opt.value === values.city) ||
                      null
                    }
                    isDisabled={!values.region}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder=""
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
              </Col>
              <Col sm={6}>
                <div className="field mb-1">
                  <label htmlFor="address">{key("address")}</label>
                  <Field type="text" id="address" name="address" />
                  <ErrorMessage name="address" component={InputErrorMessage} />
                </div>
                <div className="field mb-1">
                  <label htmlFor="tags">{key("searchKeys")}</label>
                  <CreatableSelect
                    isClearable
                    options={tagsOptions}
                    isMulti
                    onChange={(val) => setFieldValue("tags", val || [])}
                    value={values.tags}
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
                    value={
                      brokersOptions?.find(
                        (broker) => broker.value === values.broker
                      ) || null
                    }
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
                    value={
                      landlordOptions?.find(
                        (landlord) => landlord.value === values.landlord
                      ) || null
                    }
                    onChange={(val) => setFieldValue("landlord", val.value)}
                    className={`${isArLang ? "text-end" : "text-start"}`}
                    isRtl={isArLang ? true : false}
                    placeholder={isArLang ? "" : "select"}
                  />
                  <ErrorMessage name="landlord" component={InputErrorMessage} />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="electricityAccountNumber">
                    {key("elecAccount")}
                  </label>
                  <Field
                    type="number"
                    id="electricityAccountNumber"
                    name="electricityAccountNumber"
                  />
                  <ErrorMessage
                    name="electricityAccountNumber"
                    component={InputErrorMessage}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <div className="field">
                  <label htmlFor="waterAccountNumber">
                    {key("waterAccount")}
                  </label>
                  <Field
                    type="number"
                    id="waterAccountNumber"
                    name="waterAccountNumber"
                  />
                  <ErrorMessage
                    name="waterAccountNumber"
                    component={InputErrorMessage}
                  />
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
                    className={styles.photo_label_img}
                    htmlFor="compoundImage"
                  >
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Uploaded Preview"
                        className={styles.image_preview}
                      />
                    ) : (
                      <img
                        src={`${import.meta.env.VITE_Host}${
                          compoundData.image
                        }`}
                        alt="old_image_Preview"
                        className={styles.image_preview}
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
    </>
  );
};

export default UpdateCompound;
