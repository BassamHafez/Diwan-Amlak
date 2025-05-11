import { useTranslation } from "react-i18next";
import ButtonThree from "../../Components/UI/Buttons/ButtonThree";
import styles from "./Packages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
  faYinYang,
} from "@fortawesome/free-solid-svg-icons";
import {useSelector } from "react-redux";
import MainModal from "../../Components/UI/Modals/MainModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { toast } from "react-toastify";
import CheckPermissions from "../../Components/CheckPermissions/CheckPermissions";
import fire from "../../assets/svg/fire.svg";
import { crown, vip } from "../../shared/images";

const CustomPackageItem = ({
  features,
  title,
  btnText,
  chooseActiveActive,
  remainingTime,
  isNoFixedHeight,
  estatesCount,
  compoundsCount,
  isMySub,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPackageData, setShowPackageData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subCost, setSubCost] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState("");
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const isVipAcc = accountInfo?.account?.isVIP;
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const notifyError = (message) => toast.error(message);

  const handleSubscriptionErrors = (message) => {
    const errorMessages = {
      "Subscribed compounds less than the existing compounds":
        key("subErrorCompound"),
      "Subscribed estates less than the existing estates":
        key("subErrorEstates"),
      "Subscribed users less than the existing members": key("subErrorUsers"),
      "Max estates in compound less than existing max estates":
        key("subErrorMaxEstate"),
      "VIP account can't subscribe": key("vipPrevent"),
    };

    notifyError(errorMessages[message] || key("wrong"));
  };

  const sendPackageData = async () => {
    setIsLoading(true);
    if (compoundsCount && !estatesCount) {
      notifyError(key("uselessCompound"));
      return;
    }
    if (btnText && chooseActiveActive) {
      chooseActiveActive("subscription");
      return;
    }
    if (accountInfo && accountInfo?.account?._id) {
      const formData = {};
      features?.forEach((feature) => {
        formData[feature.label] = feature.value;
      });

      const myType = `accounts/${accountInfo?.account?._id}/subscribe`;

      const res = await mainFormsHandlerTypeRaw({
        token: token,
        formData: formData,
        method: "post",
        type: myType,
      });
<<<<<<< HEAD
      console.log("res", res);
=======
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
      if (res.status === "success") {
        setSubCost(res.data?.amount);
        setPaymentUrl(res.data?.paymentUrl);
        localStorage.setItem("paymentId", res.data?.purchaseId);
        setShowPackageData(true);
      } else {
        handleSubscriptionErrors(res.response?.data?.message);
      }
    } else {
      setShowLoginModal(true);
    }
    setIsLoading(false);
  };

  const paymentMethods = () => {
    setShowPackageData(false);
    window.location.href = paymentUrl;
  };

  return (
    <div className={styles.package_side}>
      <div className={`${styles.package} ${styles.custom_border}`}>
        <div className={styles.package_type}>
          <img src={isVipAcc && isMySub ? crown : fire} alt="logo" />
          <div className="d-flex flex-column">
            <h4 className="text-center fw-bold">
              {isVipAcc && isMySub
                ? key("eliteTitle")
                : title
                ? title
                : key("customPackage")}{" "}
            </h4>
            {remainingTime && (
              <span className={styles.time_span}>
                {key("remainingTime")} {remainingTime}
              </span>
            )}
          </div>
        </div>
        <div
          className={`${styles.features} ${
            isNoFixedHeight ? "" : styles.fixed_height
          }`}
        >
          <ul>
            {isVipAcc && isMySub ? (
              <>
                <li>
                  <FontAwesomeIcon
                    className={`${styles.list_icon}`}
                    icon={isArLang ? faCircleChevronLeft : faCircleChevronRight}
                  />
                  {key("elitePackageMSg2")}
                </li>
                <div className={styles.vip_img}>
                  <img src={vip} alt="vip" />
                </div>
              </>
            ) : (
              features?.map(
                (feature, index) =>
                  feature.value !== false &&
                  feature.value !== undefined &&
                  Number(feature.value) > 0 && (
                    <li key={index}>
                      <FontAwesomeIcon
                        className={`${styles.list_icon}`}
                        icon={
                          isArLang ? faCircleChevronLeft : faCircleChevronRight
                        }
                      />
                      {key(feature.label)}{" "}
                      {typeof feature.value !== "boolean"
                        ? `(${Number(feature.value) > 0 ? feature.value : 0})`
                        : feature.value === true
                        ? ""
                        : ""}
                    </li>
                  )
              )
            )}
          </ul>
        </div>
        <CheckPermissions
          btnActions={["UPDATE_ACCOUNT"]}
          noCheckingForExpired={true}
          profileInfo={profileInfo}
        >
          <div className="text-center pt-4 pb-2">
            <ButtonThree onClick={sendPackageData} color="white">
              {isLoading ? (
                <FontAwesomeIcon className="fa-spin" icon={faYinYang} />
              ) : (
                <span>{isMySub ? key("update") : key("orderPackage")}</span>
              )}
            </ButtonThree>
          </div>
        </CheckPermissions>
      </div>

      {showLoginModal && (
        <MainModal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          confirmFun={() => navigate("/login")}
          okBtn={key("confirm")}
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
          <h5 style={{ lineHeight: 2 }}>
            {` 💵 ${key("subscriptionCost")} [${subCost} ${key("sar")}] 
            `}{" "}
            <br /> {key("reviewPackage")}
          </h5>
        </MainModal>
      )}
    </div>
  );
};

export default CustomPackageItem;
