import {
  formattedDate,
  renamedExpensesStatusMethod,
  renamedRevenuesStatus,
} from "../../../Components/Logic/LogicFun";
import styles from "./UserHome.module.css";
import { Col } from "../../../shared/bootstrap";
import { FontAwesomeIcon } from "../../../shared/index";
import { faEye, faCircleInfo } from "../../../shared/constants";
import { useTranslation } from "../../../shared/hooks";
import { memo } from "react";

const TodayExAndRev = memo(({ getStatusBgColor, myData, showDetails }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <>
      {/* expenses */}
      <Col xl={6}>
        <div className={styles.information_section}>
          <h4 className="fw-bold mb-4">{key("todayExpenses")}</h4>
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
                {myData?.todayExpenses?.length > 0 ? (
                  myData?.todayExpenses?.map((ex) => (
                    <tr key={ex._id}>
                      <td>{ex.estate?.name || ex.compound?.name || "-"}</td>
                      <td>{key(ex.type)}</td>
                      <td>{ex.amount}</td>
                      <td>{formattedDate(ex.dueDate)}</td>
                      <td>
                        <span
                          className={`${getStatusBgColor(ex.status)} ${
                            styles.status_span
                          }`}
                        >
                          {isArLang
                            ? renamedExpensesStatusMethod(ex.status, "ar")
                            : renamedExpensesStatusMethod(ex.status, "en")}
                        </span>
                      </td>
                      <td>
                        <FontAwesomeIcon
                          title={key("show")}
                          className={styles.eye_icon}
                          onClick={() =>
                            showDetails(ex.estate?._id, ex.compound?._id)
                          }
                          icon={faEye}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={"5"} className="py-5">
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <FontAwesomeIcon
                          className="fs-1 text-secondary mb-3"
                          icon={faCircleInfo}
                        />
                        <span className="mini_word">{key("noTasks")}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>

      {/* revenues */}
      <Col xl={6}>
        <div className={styles.information_section}>
          <h4 className="fw-bold mb-4">{key("todayRevenues")}</h4>
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
                {myData?.todayRevenues?.length > 0 ? (
                  myData?.todayRevenues?.map((rev) => (
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
      </Col>
    </>
  );
});
TodayExAndRev.displayName="TodayExAndRev";
export default TodayExAndRev;
