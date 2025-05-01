import styles from "./PropertyForms.module.css";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import {
  citiesByRegion,
  citiesByRegionAr,
  SaudiRegion,
  SaudiRegionAr,
} from "../../../Components/Logic/StaticLists";
import fetchAccountData from "../../../Store/accountInfo-actions";
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
  useTagsOption,
  useCompoundOptions,
  useValidation,
  useSelector,
} from "../../../shared/hooks";
import {
  CheckMySubscriptions,
  InputErrorMessage,
} from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const AddEstate = ({ hideModal, refetch, compId }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const { selectedFile, imagePreviewUrl, handleFileChange } = useFileHandler();
  const { tagsOptions, refetchTags } = useTagsOption();
  const { compoundsOptionsWithNot } = useCompoundOptions();
  const { positiveNumbersValidation, mainReqValidation, messageValidation } =
    useValidation();
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const token = useSelector((state) => state.userInfo.token);

  const { t: key } = useTranslation();
  const dispatch = useDispatch();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const requiredLabel = <span className="text-danger">*</span>;


  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeFormData,
  });

  const initialValues = {
    image: "",
    compound: compId || "",
    name: "",
    description: "",
    region: "",
    city: "",
    neighborhood: "",
    address: "",
    tags: [],
    price: "",
    area: "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    const formData = new FormData();

    if (values.compound) {
      if (values.compound !== "not") {
        formData.append("compound", values.compound);
      }
    }

    if (values.compound === "not") {
      if (!values.region) {
        notifyError(key("regionReq"));
        return;
      }
      if (!values.city) {
        notifyError(key("cityReq"));
        return;
      }
      formData.append("city", values.city);
      formData.append("region", values.region);
      formData.append("neighborhood", values.neighborhood || "not specified");
    }

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (values.address) {
      formData.append("address", values.address);
    }

    if (values.tags?.length > 0) {
      values.tags.forEach((obj, index) => {
        formData.append(`tags[${index}]`, obj.value);
      });
    }

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("area", values.area);

    mutate(
      {
        formData: formData,
        token: token,
        method: "post",
        type: "estates",
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data?.status === "success") {
            refetch();
            dispatch(fetchAccountData(token));
            if (values.tags?.length > 0) {
              refetchTags();
            }
            notifySuccess(key("addedSuccess"));
            resetForm();
            hideModal();
          } else if (
            data.response.data.message ===
            "Max estates reached for this compound"
          ) {
            notifyError(key("maxEstatesInCompoundError"));
          } else {
            notifyError(key("wrong"));
          }
        },
        onError: (error) => {
          console.log(error);
          notifyError(key("wrong"));
        },
      }
    );
  };

  const validationSchema = object().shape({
    compound: mainReqValidation,
    name: mainReqValidation,
    description: messageValidation,
    region: string(),
    city: string(),
    address: string(),
    neighborhood: string(),
    price: positiveNumbersValidation.required(key("fieldReq")),
    area: positiveNumbersValidation.required(key("fieldReq")),
  });

  const handleRegionChange = (selectedRegion, setFieldValue) => {
    setFieldValue("region", selectedRegion || "");
    setFieldValue("city", "");
    let cities;
    if (isArLang) {
      cities = citiesByRegionAr[selectedRegion] || [];
    } else {
      cities = citiesByRegion[selectedRegion] || [];
    }
    setCityOptions(cities);
  };

  const clearReigonsField = (val, setFieldValue) => {
    if (val !== "not") {
      setFieldValue("region", "");
      setFieldValue("city", "");
      setFieldValue("neighborhood", "");
    }
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
            <Col sm={6}>
              <div className="field mb-1">
                <label htmlFor="compound">
                  {key("compound")} {requiredLabel}
                </label>
                <Select
                  id="compound"
                  name="compound"
                  options={compoundsOptionsWithNot}
                  onChange={(val) => {
                    setFieldValue("compound", val ? val.value : "not");
                    clearReigonsField(val ? val.value : "not", setFieldValue);
                  }}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  isDisabled={compId ? true : false}
                  placeholder={
                    compId
                      ? compoundsOptionsWithNot?.find(
                          (comp) => comp.value === compId
                        )?.label || ""
                      : ""
                  }
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
                  value={
                    (isArLang ? SaudiRegionAr : SaudiRegion).find(
                      (opt) => opt.value === values.region
                    ) || null
                  }
                  onChange={(selected) =>
                    handleRegionChange(selected?.value || null, setFieldValue)
                  }
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  isDisabled={
                    (values.compound && values.compound !== "not") || compId
                  }
                  placeholder=""
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
                    compId ||
                    (values.compound && values.compound !== "not")
                  }
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
                <Field
                  disabled={
                    compId || (values.compound && values.compound !== "not")
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
                <label htmlFor="tags">{key("searchKeys")}</label>
                <CreatableSelect
                  isClearable
                  options={tagsOptions}
                  isMulti
                  onChange={(val) => setFieldValue("tags", val)}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder=""
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

          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
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
  );
};

export default AddEstate;
