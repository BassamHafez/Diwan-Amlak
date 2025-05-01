import { useTranslation } from "react-i18next";
import {
  formattedDate,
  renamedExpensesStatusMethod,
  renamedPaymentMethod,
} from "../../../Components/Logic/LogicFun";
import styles from "./Details.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateForward,
  faCoins,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";

const ExpensesDetails = ({ exDetails }) => {
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

            <span>{key("amount")}</span>
          </span>
          <span>
            {exDetails.amount} {key("sar")}
          </span>
        </li>
        <li>
          <span>
            <span className={iconMarginClass}>
              <FontAwesomeIcon className={`color-main fs-5`} icon={faClock} />
            </span>
            <span>{key("dueDate2")}</span>
          </span>
          <span>{formattedDate(exDetails.dueDate)}</span>
        </li>
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
              ? renamedExpensesStatusMethod(exDetails.status, "ar")
              : renamedExpensesStatusMethod(exDetails.status, "en")}
          </span>
        </li>
        {exDetails.paymentMethod && (
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
                ? renamedPaymentMethod(exDetails.paymentMethod, "ar")
                : renamedPaymentMethod(exDetails.paymentMethod, "en")}
            </span>
          </li>
        )}
        {exDetails.paidAt && (
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

            <span>{formattedDate(exDetails.paidAt)}</span>
          </li>
        )}
      </ul>
      <div className={styles.notes}>
        <h5>{key("notes")}</h5>
        <div>
          <p>{exDetails.note ? exDetails.note : "-"}</p>
        </div>
      </div>
    </>
  );
};

export default ExpensesDetails;
