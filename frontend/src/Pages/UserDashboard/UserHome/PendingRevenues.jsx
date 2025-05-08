import styles from "./UserHome.module.css";
import { useTranslation } from "../../../shared/hooks";
import {
  formattedDate,
  renamedRevenuesStatus,
} from "../../../Components/Logic/LogicFun";
import { faEye, faCircleInfo } from "../../../shared/constants";
import { FontAwesomeIcon } from "../../../shared/index";

const PendingRevenues = ({ myData, getStatusBgColor, showDetails }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <div className={styles.information_section}>
      <h4 className="fw-bold mb-4">{key("exPendingRevenues")}</h4>
      <div className="scrollableTable">
        <table className={`${styles.contract_table} table`}>
          <thead className={styles.table_head}>
            <tr>
              <th>{key("estate")}</th>
              <th>{key("type")}</th>
              <th>{key("amount")}</th>
              <th>{key("dueDate")}</th>
              <th>{key("status")}</th>
              <th>{key("actions")}</th>
            </tr>
          </thead>

          <tbody className={styles.table_body}>
            {myData?.exPendingRevenues?.length > 0 ? (
              myData?.exPendingRevenues?.map((rev) => (
                <tr key={rev._id}>
                  <td>{rev.estate?.name || rev.compound?.name || "-"}</td>
                  <td>{key(rev.type)}</td>
                  <td>{rev.amount}</td>
                  <td>{formattedDate(rev.dueDate)}</td>
                  <td>
                    <span
                      className={`${getStatusBgColor(rev.status)} ${
                        styles.status_span
                      }`}
                    >
                      {isArLang
                        ? renamedRevenuesStatus(rev.status, "ar")
                        : renamedRevenuesStatus(rev.status, "en")}
                    </span>
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEye}
                      title={key("show")}
                      className={styles.eye_icon}
                      onClick={() =>
                        showDetails(rev.estate?._id, rev.compound?._id)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={"6"} className="py-5">
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <FontAwesomeIcon
                      className="fs-1 text-secondary mb-3"
                      icon={faCircleInfo}
                    />
                    <span className="mini_word">{key("noRevenues")}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRevenues;
