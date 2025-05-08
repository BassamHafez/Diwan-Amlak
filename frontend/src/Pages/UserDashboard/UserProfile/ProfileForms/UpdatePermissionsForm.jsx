import fetchAccountData from "../../../../Store/accountInfo-actions";
import { mainFormsHandlerTypeRaw } from "../../../../util/Http";

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FontAwesomeIcon,
  CreatableSelect,
} from "../../../../shared/index";
import { faSpinner, toast, object, string } from "../../../../shared/constants";
import {
  useEffect,
  useState,
  useMutation,
  useTranslation,
  useDispatch,
  useSelector,
  useCompoundOptions,
  useValidation,
} from "../../../../shared/hooks";
import {
  CheckMySubscriptions,
  InputErrorMessage,
} from "../../../../shared/components";
import { Row } from "../../../../shared/bootstrap";

const UpdatePermissionsForm = ({
  hideModal,
  allPermissions,
  userPermissions,
  userId,
  permittedCompoundsArr,
  tag,
}) => {
  const [permissionsOptions, setPermissionsOptions] = useState([]);
  const { compoundsOptions } = useCompoundOptions();
  const { arrOfOptionsValidation } = useValidation();
  const token = useSelector((state) => state.userInfo.token);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const dispatch = useDispatch();

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    if (allPermissions) {
      setPermissionsOptions(
        Array.from(new Set(allPermissions)).map((perm, index) => ({
          label: key(perm) || index,
          value: perm,
        }))
      );
    }
  }, [allPermissions, key]);

  const { mutate, isPending } = useMutation({
    mutationFn: mainFormsHandlerTypeRaw,
  });

  const myPermittedCompoundsOptions = compoundsOptions?.filter((comp) =>
    permittedCompoundsArr.includes(comp.value)
  );
  const myPermissionsOptions = userPermissions?.map((perm, index) => ({
    label: key(perm) || index,
    value: perm,
  }));

  const initialValues = {
    permissions: myPermissionsOptions || [],
    permittedCompounds: myPermittedCompoundsOptions || [],
    tag: tag || "",
  };

  const onSubmit = (values) => {
    const updatedValues = {
      permissions: values.permissions.map((perm) => `${perm.value}`),
      permittedCompounds: values.permittedCompounds.map(
        (perm) => `${perm.value}`
      ),
    };

    if (values.tag) {
      updatedValues.tag = values.tag;
    }

    mutate(
      {
        formData: updatedValues,
        token: token,
        method: "patch",
        type: `accounts/${accountInfo?.account?._id}/members/${userId}`,
      },
      {
        onSuccess: (data) => {
          if (data?.status === "success") {
            dispatch(fetchAccountData(token));
            notifySuccess(key("updatedSucc"));
            hideModal();
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
    tag: string(),
    permissions: arrOfOptionsValidation
      .min(1, key("permissionsMin"))
      .required(key("fieldReq")),
    permittedCompounds: arrOfOptionsValidation.nullable(),
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
          <Row>
            <CheckMySubscriptions
              name="isUserPermissionsAllowed"
              accountInfo={accountInfo}
            >
              <div className="field">
                <label htmlFor="permissions">{key("permissions")}</label>
                <CreatableSelect
                  isClearable
                  options={permissionsOptions}
                  isMulti
                  onChange={(val) => setFieldValue("permissions", val)}
                  value={values.permissions}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? true : false}
                  placeholder={isArLang ? "" : "select"}
                  formatCreateLabel={(inputValue) =>
                    isArLang ? `إضافة "${inputValue}"` : `Add "${inputValue}"`
                  }
                />
                <ErrorMessage
                  name="permissions"
                  component={InputErrorMessage}
                />
              </div>
            </CheckMySubscriptions>

            <div className="field">
              <label htmlFor="permittedCompounds">
                {key("permittedCompounds")}
              </label>
              <CreatableSelect
                isClearable
                options={compoundsOptions}
                isMulti
                onChange={(val) => setFieldValue("permittedCompounds", val)}
                value={values.permittedCompounds}
                className={`${isArLang ? "text-end" : "text-start"}`}
                isRtl={isArLang ? true : false}
                placeholder={isArLang ? "" : "select"}
                formatCreateLabel={(inputValue) =>
                  isArLang ? `إضافة "${inputValue}"` : `Add "${inputValue}"`
                }
              />
              <ErrorMessage
                name="permittedCompounds"
                component={InputErrorMessage}
              />
            </div>

            <div className="field">
              <label htmlFor="tag">{key("tag")}</label>
              <Field
                type="text"
                id="tag"
                name="tag"
                className={isArLang ? "ar_direction" : ""}
              />
              <ErrorMessage name="tag" component={InputErrorMessage} />
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
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePermissionsForm;
