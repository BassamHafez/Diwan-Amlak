import { mainFormsHandlerTypeRaw } from "../../../../util/Http";
import {
  ErrorMessage,
  Form,
  Formik,
  FontAwesomeIcon,
  CreatableSelect,
} from "../../../../shared/index";
import { faSpinner, toast, object, array } from "../../../../shared/constants";
import {
  useMutation,
  useTranslation,
  useSelector,
} from "../../../../shared/hooks";
import { InputErrorMessage } from "../../../../shared/components";
import { useEffect, useState } from "react";

const UpdateTermsForm = ({ hideModal, termsData, refetch }) => {
  const [termsArOptions, setTermsArOptions] = useState([]);
  const [termsEnOptions, setTermsEnOptions] = useState([]);
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  useEffect(() => {
    const arOptions = termsData?.ar?.map((term) => {
      return { label: term, value: term };
    });
    const enOptions = termsData?.en?.map((term) => {
      return { label: term, value: term };
    });

    setTermsArOptions(arOptions);
    setTermsEnOptions(enOptions);
  }, [termsData]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const initialValues = {
    termsAr: termsArOptions || [],
    termsEn: termsEnOptions || [],
  };

  const onSubmit = (values, { resetForm }) => {
    const convertedEnTerms = values.termsEn?.map((term) => term.value) || [];
    const convertedArTerms = values.termsAr?.map((term) => term.value) || [];

    const terms = {
      en: convertedEnTerms,
      ar: convertedArTerms,
    };
<<<<<<< HEAD
    console.log(terms);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
    toast.promise(
      new Promise((resolve, reject) => {
        mutate(
          {
            formData: terms,
            token: token,
            method: "put",
            type: `terms`,
          },
          {
            onSuccess: async (data) => {
<<<<<<< HEAD
              console.log(data);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
              if (data?.status === "success") {
                if (refetch) {
                  refetch();
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

  const arrValidation = array()
    .min(1, key("termValidation"))
    .required(key("fieldReq"));

  const validationSchema = object({
    termsAr: arrValidation,
    termsEn: arrValidation,
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
            <label htmlFor="termsAr">{key("termsAr")}</label>
            <CreatableSelect
              isClearable
              options={termsArOptions}
              isMulti
              onChange={(val) => setFieldValue("termsAr", val)}
              value={values.termsAr}
              className="text-end"
              isRtl={true}
              placeholder=""
              formatCreateLabel={(inputValue) =>
                isArLang ? `إضافة "${inputValue}"` : `Add "${inputValue}"`
              }
            />
            <ErrorMessage name="termsAr" component={InputErrorMessage} />
          </div>
          <div className="field" dir="ltr">
            <label
              className={isArLang ? "text-end" : "text-start"}
              htmlFor="termsEn"
            >
              {key("termsEn")}
            </label>
            <CreatableSelect
              isClearable
              options={termsEnOptions}
              isMulti
              onChange={(val) => setFieldValue("termsEn", val)}
              value={values.termsEn}
              className="text-start"
              isRtl={false}
              placeholder=""
              formatCreateLabel={(inputValue) =>
                isArLang ? `إضافة "${inputValue}"` : `Add "${inputValue}"`
              }
            />
            <ErrorMessage name="termsEn" component={InputErrorMessage} />
          </div>
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

export default UpdateTermsForm;
