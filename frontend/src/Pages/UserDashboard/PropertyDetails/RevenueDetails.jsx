import { useTranslation } from "react-i18next";
import {
  formattedDate,
  renamedPaymentMethod,
  renamedRevenuesStatus,
} from "../../../Components/Logic/LogicFun";
import styles from "./Details.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateForward,
  faCoins,
  faMoneyBill,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";

const RevenueDetails = ({ revDetails }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const iconMarginClass = isArLang ? "ms-2" : "me-2";

  return (
    <>
      <ul className={styles.details_list}>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faCoins} />
            </span>
            <span> {key("amount")}</span>
          </span>

          <span>
            {revDetails.amount} {key("sar")}
          </span>
        </li>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faClock} />
            </span>
            <span>{key("dueDate")}</span>
          </span>

          <span>{formattedDate(revDetails.dueDate)}</span>
        </li>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faUser} />
            </span>
            <span>{key("theTenant")}</span>
          </span>
          <span>{revDetails.tenant?.name}</span>
        </li>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faPhone} />
            </span>
            <span>{key("phone")}</span>
          </span>
          <span>{revDetails.tenant?.phone}</span>
        </li>
        {revDetails.tenant?.phone2 && (
          <li>
            <span>
              <span className={iconMarginClass}>
                <FontAwesomeIcon className={`color-main fs-5`} icon={faPhone} />
              </span>
              <span>{key("phone2")}</span>
            </span>
            <span>{revDetails.tenant?.phone2}</span>
          </li>
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
          <span>
            {isArLang
              ? renamedRevenuesStatus(revDetails.status, "ar")
              : renamedRevenuesStatus(revDetails.status, "en")}
          </span>
        </li>
        {revDetails.paymentMethod && (
          <li>
            <span>
              <span className={iconMarginClass}>
                <FontAwesomeIcon
                  className={`color-main fs-5`}
                  icon={faMoneyBill}
                />
              </span>
              <span>{key("paymentMethod")}</span>
            </span>
            <span>
              {isArLang
                ? renamedPaymentMethod(revDetails.paymentMethod, "ar")
                : renamedPaymentMethod(revDetails.paymentMethod, "en")}
            </span>
          </li>
        )}
        {revDetails.paidAt && (
          <li>
            <span>
              <span className={iconMarginClass}>
                <FontAwesomeIcon
                  className={`color-main fs-5`}
                  icon={faCalendar}
                />
              </span>
              <span>{key("paidAt")}</span>
            </span>
            <span>{formattedDate(revDetails.paidAt)}</span>
          </li>
        )}
      </ul>

      {revDetails.notes && (
        <div className={styles.notes}>
          <h5>{key("notes")}</h5>
          <div>
            <p>{revDetails.note ? revDetails.note : "-"}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RevenueDetails;
