import styles from "./PrintContract.module.css";
import {
  incomeReportDetailsTable,
  incomeReportTable,
  paymentsReportTable,
} from "../Logic/StaticLists";
import { formattedDate } from "../Logic/LogicFun";
import { FontAwesomeIcon } from "../../shared/index";
import { faCircleInfo } from "../../shared/constants";
import { useSelector, useTranslation } from "../../shared/hooks";
import { MainTitle, PrintNavBar, ReportsDetailsHeader } from "../../shared/components";

const PrintFinancialReport = ({
  filterType,
  revenues,
  expenses,
  combinedData,
  dataEnteried,
  isCompoundsReport,
}) => {

  const { t: key } = useTranslation();
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const tableHeaders =
    filterType === "incomeReport"
      ? incomeReportTable
      : filterType === "incomeReportDetails"
      ? incomeReportDetailsTable
      : paymentsReportTable || [];

  const totalRevAmount = revenues.reduce(
    (sum, rev) =>
      sum + (filterType === "incomeReport" ? rev.total : rev.amount || 0),
    0
  );
  const totalExAmount = expenses.reduce(
    (sum, ex) =>
      sum + (filterType === "incomeReport" ? ex.total : ex.amount || 0),
    0
  );

  return (
    <div
      className={styles.container_body}
      id={isCompoundsReport ? "compoundsReport" : filterType}
    >
      <PrintNavBar
        title={isCompoundsReport ? key("compoundsReport") : key(filterType)}
        profileInfo={profileInfo}
      />
      <ReportsDetailsHeader dataEnteried={dataEnteried} />
      <div className={styles.information}>
        <div className="d-flex justify-content-center">
          <MainTitle small={true} title={isCompoundsReport ? key("compounds") : key("incomePerEstate")} />
        </div>
        <div className="scrollableTable">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                {tableHeaders.map(
                  (title, index) =>
                    title !== "notes" && (
                      <th key={`${title}_${index}`}>{key(title)}</th>
                    )
                )}
              </tr>
            </thead>

            <tbody className={styles.table_body}>
              {combinedData.length > 0 ? (
                combinedData.map((item, index) =>
                  filterType === "incomeReport" ? (
                    <tr key={index}>
                      <td>{key(item.category)}</td>
                      <td>
                        {(isCompoundsReport
                          ? item.compoundName
                          : item.estateName) || "-"}
                      </td>
                      <td>{item.total}</td>
                    </tr>
                  ) : filterType === "incomeReportDetails" ? (
                    <tr key={index}>
                      <td>{key(item.category)}</td>
                      <td>{item.estate?.name || "-"}</td>
                      <td>{item.tenant?.name || "-"}</td>
                      <td>{key(item.type)}</td>
                      <td>{item.amount}</td>
                      <td>{formattedDate(item.paidAt) || "-"}</td>
                      <td>{key(item.paymentMethod) || "-"}</td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>{key(item.category)}</td>
                      <td>{item.estate?.name || "-"}</td>
                      <td>{item.tenant?.name || "-"}</td>
                      <td>{formattedDate(item.dueDate || "-")}</td>
                      <td>{key(item.type)}</td>
                      <td>{item.amount}</td>
                      <td>{key(item.status)}</td>
                      <td>{formattedDate(item.paidAt) || "-"}</td>
                      <td>{key(item.paymentMethod) || "-"}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={`${tableHeaders.length || "7"}`}
                    className="py-5"
                  >
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <FontAwesomeIcon
                        className="fs-1 text-secondary mb-3"
                        icon={faCircleInfo}
                      />
                      <span className="mini_word">{key("noDetails")}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.information}>
        <div className="d-flex justify-content-center">
          <MainTitle small={true} title={key("summary")}/>
        </div>
        <div className="scrollableTable">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                <th>{key("totalRevenues")}</th>
                <th>{key("totalExpenses")}</th>
              </tr>
            </thead>

            <tbody className={styles.table_body}>
              <tr>
                <td>
                  {totalRevAmount} {key("sarSmall")}
                </td>
                <td>
                  {totalExAmount} {key("sarSmall")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintFinancialReport;
