import styles from "./Packages.module.css";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { triangle, shape, crown, vip, logo } from "../../shared/images";
import { toast, faCircleCheck, faYinYang } from "../../shared/constants";
import { MainModal, ButtonThree, ModalForm } from "../../shared/components";
import {
  useSelector,
  useState,
  useNavigate,
  useTranslation,
} from "../../shared/hooks";
import { FontAwesomeIcon } from "../../shared/index";
import { Col } from "../../shared/bootstrap";
import ContactForm from "../Contact/ContactForm";

const PackageItem = ({ pack, type }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVipContactModal, setShowVipContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [showPackageData, setShowPackageData] = useState(false);
  const [subCost, setSubCost] = useState(0);
  const token = useSelector((state) => state.userInfo.token);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const isLogin = useSelector((state) => state.userInfo.isLogin);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();

  const notifyError = (message) => toast.error(message);

  const discount =
    Number(pack.originalPrice) !== 0
      ? Math.round(
          ((Number(pack.originalPrice) - Number(pack.price)) /
            Number(pack.originalPrice)) *
            100
        )
      : "0";

  const handlePackageErrors = (message) => {
    const errorMessages = {
      "Package compounds less than the existing compounds":
        key("subErrorCompound"),
      "Package estates less than the existing estates": key("subErrorEstates"),
      "Package users less than the existing members": key("subErrorUsers"),
      "Max estates in compound less than existing max estates":
        key("subErrorMaxEstate"),
      "VIP account can't subscribe": key("vipPrevent"),
    };

    notifyError(errorMessages[message] || key("wrong"));
  };

  const getReadyPackage = async () => {
    setIsLoading(true);
    const values =
      type === "vip" ? { price: pack._id } : { packageId: pack._id };

    const res = await mainFormsHandlerTypeRaw({
      formData: values,
      token,
      method: "post",
      type: `accounts/${accountInfo?.account?._id}/subscribe-package`,
    });
    if (res.status === "success") {
      setSubCost(res.data?.amount);
      setIsLoading(false);
      setPaymentUrl(res.data?.paymentUrl);
      localStorage.setItem("paymentId", res.data?.purchaseId);
      setShowPackageData(true);
    } else {
      handlePackageErrors(res.response?.data?.message);
    }
    setIsLoading(false);
  };

  const subscribtionHandler = () => {
    if (!isLogin) {
      setShowLoginModal(true);
      return;
    }
    if (type === "vip") {
      setShowVipContactModal(true);
      return;
    }
    getReadyPackage();
  };

  const paymentMethods = () => {
    setShowPackageData(false);
    window.location.href = paymentUrl;
  };

  return (
    <>
      <Col md={6} xl={4} className="my-5">
        <div className={styles.package}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className={styles.package_type}>
              <img
                src={
                  pack.isMostPopular
                    ? shape
                    : pack.isBestOffer
                    ? triangle
                    : crown
                }
                alt="package_Shape"
              />
              <h3>{isArLang ? pack.arTitle : pack.enTitle}</h3>
            </div>
            <div
              className={`${styles.badge} ${
                pack.isBestOffer
                  ? styles.main_bg
                  : pack.isMostPopular
                  ? styles.offer
                  : styles.vip_badge
              } ${isArLang ? "me-auto" : "ms-auto"}`}
            >
              <span>
                {pack.isMostPopular
                  ? key("mostPopular")
                  : pack.isBestOffer
                  ? key("deal")
                  : "vip"}
              </span>
            </div>
          </div>

          <div className={styles.price}>
            {type !== "vip" ? (
              <>
                <span className={styles.price_number}>
                  {pack.price} {key("sarSmall")}
                </span>
                <div className={styles.del_price}>
                  <span>
                    {isArLang
                      ? `${key("off")} ${discount}%`
                      : `-${discount}% ${key("off")}`}
                  </span>
                </div>
              </>
            ) : (
              <span className={`${styles.price_number} fs-2 mb-2`}>
                {key("elitePackageBtn4")}
              </span>
            )}
          </div>
          <div className={`${styles.features} ${styles.fixed_height}`}>
            <h4 className="mx-3 mb-3">{key("features")}</h4>
            <ul>
              {pack?.features?.map((feature, index) => {
                const isValidValue =
                  feature.value === "true" ||
                  (!isNaN(Number(feature.value)) && Number(feature.value) > 0);

                return isValidValue ? (
                  <li key={`${feature.label}_${index}`}>
                    <FontAwesomeIcon
                      className={`${styles.list_icon}`}
                      icon={faCircleCheck}
                    />
                    {key(feature.label)}{" "}
                    {feature.value === "true" ? "" : `(${feature.value})`}
                  </li>
                ) : type === "vip" ? (
                  <li key={`${feature.label}_${index}`}>
                    <FontAwesomeIcon
                      className={`${styles.list_icon}`}
                      icon={faCircleCheck}
                    />
                    {key(feature.label)}
                  </li>
                ) : null;
              })}

              {type === "vip" && (
                <>
                  <div className={styles.vip_img}>
                    <img src={vip} alt="vip Img" />
                  </div>
                </>
              )}
            </ul>
          </div>
          <div className="text-center pt-4 pb-2">
            {type === "vip" ? (
              <ButtonThree color="white" onClick={subscribtionHandler}>
                {key("contact")}
              </ButtonThree>
            ) : (
              <ButtonThree
                onClick={subscribtionHandler}
                color={pack.isBestOffer ? undefined : "white"}
              >
                {isLoading ? (
                  <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
                ) : (
                  key("orderPackage")
                )}
              </ButtonThree>
            )}
          </div>
        </div>
      </Col>
      {showLoginModal && (
        <MainModal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          confirmFun={() => navigate("/login")}
          okBtn={key("login")}
          cancelBtn={key("cancel")}
        >
          <h5>{key("loginFirst")}</h5>
        </MainModal>
      )}

      {showPackageData && (
        <MainModal
          show={showPackageData}
          onHide={() => setShowPackageData(false)}
          confirmFun={paymentMethods}
          okBtn={key("continue")}
          cancelBtn={key("cancel")}
        >
          <div>
            <img className={styles.logo} src={logo} alt="logo" />
            <h5 style={{ lineHeight: 2 }}>
              {`${key("subscriptionCost")} [${subCost} ${key("sar")}] 
            `}{" "}
            </h5>
            <p className="text-secondary"> {key("reviewPackage")}</p>
          </div>
        </MainModal>
      )}

      {showVipContactModal && (
        <ModalForm
          show={showVipContactModal}
          onHide={() => setShowVipContactModal(false)}
        >
          <ContactForm
            isVip={true}
            hideModal={() => setShowVipContactModal(false)}
          />
        </ModalForm>
      )}
    </>
  );
};

export default PackageItem;
