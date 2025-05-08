import { useTranslation } from "react-i18next";
import {
  formattedDate,
  getContractStatus,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import styles from "./Details.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateForward,
  faCoins,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const ContractDetails = ({ contract, type, findTenant }) => {
  const contractData =
    type !== "currentContract" ? contract : contract.contract;
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const contractStatus = getContractStatus(
    contractData?.isCanceled,
    contractData?.startDate,
    contractData?.endDate
  );

  const language = isArLang ? "ar" : "en";
  const iconMarginClass = isArLang ? "ms-2" : "me-2";
  const myTenant =
    type !== "currentContract" && findTenant
      ? findTenant(contractData?.tenant)
      : contractData?.tenant;

  return (
    <>
      <ul className={styles.details_list}>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faCoins} />
            </span>
            <span>{key("amount")}</span>
          </span>
          <span>
            {contractData?.totalAmount} {key("sar")}
          </span>
        </li>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faClock} />
            </span>
            <span>{key("startContract")}</span>
          </span>
          <span>{formattedDate(contractData?.startDate)}</span>
        </li>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faClock} />
            </span>
            <span>{key("endContract")}</span>
          </span>
          <span>{formattedDate(contractData?.endDate)}</span>
        </li>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faUser} />
            </span>
            <span>{key("theTenant")}</span>
          </span>
          <span>{myTenant?.name}</span>
        </li>
        {myTenant.phone && (
          <>
            <li>
              <span>
                <span className={iconMarginClass}>
                  <FontAwesomeIcon
                    className={`color-main fs-5`}
                    icon={faPhone}
                  />
                </span>
                <span>{key("phone")}</span>
              </span>
              <span>{myTenant?.phone}</span>
            </li>
            <li>
              <span>
                <span className={iconMarginClass}>
                  <FontAwesomeIcon
                    className={`color-main fs-5`}
                    icon={faPhone}
                  />
                </span>
                <span>{key("phone2")}</span>
              </span>
              <span>{myTenant?.phone2}</span>
            </li>
          </>
        )}
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon
                className={`color-main fs-5`}
                icon={faArrowRotateForward}
              />
            </span>
            <span>{key("status")}</span>
          </span>
          <span>{renamedContractStatus(contractStatus, language)}</span>
        </li>
      </ul>
    </>
  );
};

export default ContractDetails;
