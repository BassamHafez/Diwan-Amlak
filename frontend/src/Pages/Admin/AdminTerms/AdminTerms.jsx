import {
  ButtonOne,
  LoadingOne,
  MainTitle,
  ModalForm,
} from "../../../shared/components";
import {
  useTranslation,
  useCallback,
  useState,
  useQuery,
  useSelector,
  useMemo,
} from "../../../shared/hooks";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import styles from "../Admin.module.css";
import UpdateTermsForm from "./AdminTermsForm/UpdateTermsForm";

const AdminTerms = ({ isUserPage }) => {
  const token = useSelector((state) => state.userInfo.token);

  const {
    data: terms,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["terms", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "terms",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const [showUpdateermsModal, setShowUpdateTermsModal] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const containerClasses = `${styles.terms_container} ${
    isUserPage ? styles.transpatent_color : ""
  }`;

  const termsData = terms?.data || {};

  const ArabicContent = useMemo(() => {
    return (
      <div dir="rtl" className={containerClasses}>
        <div className="mb-3">
          <MainTitle colored={true} title={key("termsAr")} />
        </div>
        <ol className={styles.terms_list}>
          {termsData?.ar?.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ol>
      </div>
    );
  }, [termsData?.ar, containerClasses, key]);

  const EnglishContent = useMemo(() => {
    return (
      <div dir="ltr" className={containerClasses}>
        <div className="mb-3">
          <MainTitle colored={true} title={key("termsEn")} />
        </div>
        <ol className={styles.terms_list}>
          {termsData?.en?.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ol>
      </div>
    );
  }, [termsData?.en, containerClasses, key]);

  const handleShowModal = useCallback(() => setShowUpdateTermsModal(true), []);
  const handleHideModal = useCallback(() => setShowUpdateTermsModal(false), []);

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {(!terms || isFetching) && <LoadingOne />}
        {!isUserPage && (
          <div className="d-flex justify-content-end align-items-center position-relative my-3 p-2">
            <div>
              <ButtonOne
                onClick={handleShowModal}
                borderd={true}
                text={key("update")}
              />
            </div>
          </div>
        )}
        {isUserPage ? (isArLang ? ArabicContent : null) : ArabicContent}
        {isUserPage ? (isArLang ? null : EnglishContent) : EnglishContent}
      </div>

      {showUpdateermsModal && (
        <ModalForm show={showUpdateermsModal} onHide={handleHideModal}>
          <UpdateTermsForm
            termsData={termsData}
            hideModal={handleHideModal}
            refetch={refetch}
          />
        </ModalForm>
      )}
    </>
  );
};

export default AdminTerms;
