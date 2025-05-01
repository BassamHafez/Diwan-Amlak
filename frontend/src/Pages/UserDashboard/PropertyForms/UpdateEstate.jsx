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
import {
  faImage,
  faSpinner,
  toast,
  object,
  string,
} from "../../../shared/constants";
import {
  useEffect,
  useState,
  useMutation,
  useQueryClient,
  useTranslation,
  useFileHandler,
  useParams,
  useTagsOption,
  useContactsOptions,
  useCompoundOptions,
  useAddContactInForms,
  useValidation,
  useSelector,
} from "../../../shared/hooks";
import { InputErrorMessage } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const UpdateEstate = ({
  hideModal,
  refetch,
  estateData,
  estateParentCompound,
}) => {
  const [cityOptions, setCityOptions] = useState([]);
  const { compoundsOptionsWithNot } = useCompoundOptions();
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const { tagsOptions, refetchTags } = useTagsOption();
  const { brokersOptions, landlordOptions, refetchBroker, refetchLandlord } =
    useContactsOptions();
  const { addBrokersAndLandLords } = useAddContactInForms({
    refetchBroker,
    refetchLandlord,
  });
  const {
    positiveNumbersValidation,
    elecCountValidation,
    waterCountValidation,
    messageValidation,
    mainReqValidation,
  } = useValidation();
  const queryClient = useQueryClient();
  const notifyError = (message) => toast.error(message);
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  const requiredLabel = <span className="text-danger">*</span>;
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { propId } = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const estateParent = estateParentCompound ? estateParentCompound : estateData;

  const initialValues = {
    image: "",
    compound: compoundsOptionsWithNot?.find(
      (option) => option.value === estateParentCompound?._id
    ) || { label: key("notSpecified"), value: "not" },
    name: estateData?.name || "",
    description: estateData?.description || "",
    region: estateParent?.region || "",
    city: estateParent?.city || "",
    neighborhood:
      (estateParent?.neighborhood !== "not specified"
        ? estateParent?.neighborhood
        : "") || "",
    address: estateData?.address || "",
    tags:
      estateData?.tags.map((tag) => {
        return { label: tag, value: tag };
      }) || [],
    price: estateData?.price || "",
    area: estateData?.area || "",
    waterAccountNumber: estateData?.waterAccountNumber || "",
    electricityAccountNumber: estateData?.electricityAccountNumber || "",
    broker: estateParent?.broker?._id || "",
    landlord: estateParent?.landlord?._id || "",
    commissionPercentage: estateParent?.commissionPercentage || 0,
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    const formData = new FormData();

    if (values.compound?.value === "not") {
      if (!values.region) {
        notifyError(key("regionReq"));
        return;
      }
      if (!values.city) {
        notifyError(key("cityReq"));
        return;
      }
      console.log("hi");
      formData.append("city", values.city);
      formData.append("region", values.region);
      formData.append("neighborhood", values.neighborhood || "not specified");
    }

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("area", values.area);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    if (values.address) {
      formData.append("address", values.address);
    }

    const isTagsExist = values.tags?.length > 0;
    if (isTagsExist) {
      values.tags.forEach((obj, index) => {
        formData.append(`tags[${index}]`, obj.value);
      });
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

    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: formData,
            token: token,
            method: "patch",
            type: `estates/${propId}`,
          },
          {
            onSuccess: async (data) => {
              console.log(data);
              if (data?.status === "success") {
                await refetch();
                if (isTagsExist) {
                  refetchTags();
                }
                queryClient.invalidateQueries(["estates", token]);
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
    compound: string()
      .nullable()
      .transform((value) => (value?.value ? value.value : value)),
    name: mainReqValidation,
    description: messageValidation,
    region: string(),
    city: string(),
    address: string(),
    neighborhood: string(),
    price: positiveNumbersValidation.required(key("fieldReq")),
    area: positiveNumbersValidation.required(key("fieldReq")),
    broker: string(),
    commissionPercentage: positiveNumbersValidation,
    lessor: string(),
    waterAccountNumber: waterCountValidation,
    electricityAccountNumber: elecCountValidation,
  });

  useEffect(() => {
    const settingCityAndDistrictOptionsOptions = () => {
      let cities;
      if (isArLang) {
        cities = citiesByRegionAr[estateParent.region] || [];
      } else {
        cities = citiesByRegion[estateParent.region] || [];
      }

      setCityOptions(cities);
    };

    settingCityAndDistrictOptionsOptions();
  }, [estateParent, isArLang, key]);

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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Row>
            {values.compound && values.compound?.value !== "not" ? null : (
              <Col sm={12}>{addBrokersAndLandLords}</Col>
            )}
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="compound">{key("compound")}</label>
                <Select
                  id="compound"
                  name="compound"
                  value={values.compound}
                  options={compoundsOptionsWithNot}
                  onChange={(val) => setFieldValue("compound", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  isDisabled={true}
                />
                <ErrorMessage name="compound" component={InputErrorMessage} />
              </div>
            </Col>
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
                  isDisabled={
                    values.compound && values.compound?.value !== "not"
                  }
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
                    cityOptions.find((opt) => opt.value === values.city) || null
                  }
                  isDisabled={
                    !values.region ||
                    (values.compound && values.compound?.value !== "not")
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                />
                <ErrorMessage name="city" component="div" className="error" />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="neighborhood">{key("district")}</label>
                <Field
                  disabled={
                    !values.city ||
                    (values.compound && values.compound?.value !== "not")
                  }
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                />
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
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="broker">{key("broker")}</label>
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
                  isDisabled={
                    values.compound && values.compound?.value !== "not"
                  }
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
                  isDisabled={
                    values.compound && values.compound?.value !== "not"
                  }
                />
                <ErrorMessage name="landlord" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              {values.broker && (
                <div className="field mb-1">
                  <label htmlFor="commissionPercentage">
                    {key("commissionPercentage")} (%)
                  </label>
                  <Field
                    type="number"
                    id="commissionPercentage"
                    name="commissionPercentage"
                    disabled={
                      values.compound && values.compound?.value !== "not"
                    }
                  />
                  <ErrorMessage
                    name="commissionPercentage"
                    component={InputErrorMessage}
                  />
                </div>
              )}
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="price">
                  {key("unitPrice")} ({key("sar")}) {requiredLabel}
                </label>
                <Field type="number" id="price" name="price" />
                <ErrorMessage name="price" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="area">
                  {key("area")} ({key("areaUnit")}) {requiredLabel}
                </label>
                <Field type="number" id="area" name="area" />
                <ErrorMessage name="area" component={InputErrorMessage} />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field mb-1">
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
            <Col sm={6}>
              <div className="field mb-1">
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
            <Col sm={12}>
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
            <Col sm={12}>
              <div className={styles.photo_field}>
                <h6 className="mb-3 text-start">{key("estateImage")}</h6>
                <label
                  className={
                    imagePreviewUrl ||
                    (estateData.image &&
                      estateData.image !== "/estates/default-estate.png")
                      ? styles.photo_label_img
                      : styles.photo_label
                  }
                  htmlFor="compoundImage"
                >
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Uploaded Preview"
                      className={styles.image_preview}
                    />
                  ) : estateData.image &&
                    estateData.image !== "/estates/default-estate.png" ? (
                    <img
                      src={`${import.meta.env.VITE_Host}${estateData.image}`}
                      alt="old_image_Preview"
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

          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
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

export default UpdateEstate;
