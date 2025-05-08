import styles from "./Reports.module.css";
import LandlordReport from "./LandlordReport";
import OperationalReport from "./OperationalReport";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import CompoundsReport from "./CompoundsReport";
import CompoundDetailsReports from "./CompoundDetailsReports";
import { FontAwesomeIcon } from "../../../shared/index";
import {
  faCircle,
  faPaste,
  faFileContract,
  faFileInvoiceDollar,
  faMoneyBillTrendUp,
  faSackDollar,
  faTags,
} from "../../../shared/constants";
import {
  useState,
  useTranslation,
  useEstatesOptions,
  useCompoundOptions,
  useContactsOptions,
  useSelector,
} from "../../../shared/hooks";
import { Row, Col } from "../../../shared/bootstrap";
import {
  CheckMySubscriptions,
  CheckSubscriptionRender,
  LoadingOne,
} from "../../../shared/components";

const Reports = () => {
  const [reportTypeFilter, setReportTypeFilter] = useState("landlordReport");
  const [landlordFilter, setLandlordFilter] = useState("incomeReport");
  const [operationalFilter, setOperationalFilter] = useState("contractsReport");
  const [compoundsFilter, setCompoundsFilter] = useState("compoundsReport");
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const accountData = accountInfo?.account;
  const estatesOptions = useEstatesOptions();
  const { compoundsOptions } = useCompoundOptions();
  const { landlordOptions } = useContactsOptions();

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  let iconClass = isArLang ? "ms-2" : "me-2";
  const circleIcon = (
    <FontAwesomeIcon className={`${iconClass}`} icon={faCircle} />
  );

  return (
    <>
      <div className={`${styles.main_container} height_container`}>
        <Row style={{ minHeight: "65vh" }}>
          <Col sm={4} lg={3} xl={2} className="p-0">
            <div className={styles.filter_side}>
              <div className="small_filter">
                <h6>
                  <FontAwesomeIcon className={`${iconClass}`} icon={faPaste} />
                  {key("report")}
                </h6>
                <ul className={styles.filter_list}>
                  <CheckMySubscriptions
                    name="isFinancialReportsAllowed"
                    accountInfo={accountInfo}
                  >
                    <CheckPermissions
                      profileInfo={profileInfo}
                      btnActions={["FINANCIAL_REPORTS"]}
                    >
                      <li
                        className={
                          reportTypeFilter === "landlordReport"
                            ? styles.active
                            : ""
                        }
                        onClick={() => setReportTypeFilter("landlordReport")}
                      >
                        {circleIcon}
                        {key("landlordReport")}
                      </li>
                    </CheckPermissions>
                  </CheckMySubscriptions>
                  <CheckMySubscriptions
                    name="isOperationalReportsAllowed"
                    accountInfo={accountInfo}
                  >
                    <CheckPermissions
                      profileInfo={profileInfo}
                      btnActions={["CONTRACTS_REPORTS"]}
                    >
                      <li
                        className={
                          reportTypeFilter === "operationalReport"
                            ? styles.active
                            : ""
                        }
                        onClick={() => setReportTypeFilter("operationalReport")}
                      >
                        {circleIcon}
                        {key("operationalReport")}
                      </li>
                    </CheckPermissions>
                  </CheckMySubscriptions>
                  <CheckMySubscriptions
                    name="isCompoundsReportsAllowed"
                    accountInfo={accountInfo}
                  >
                    <CheckPermissions
                      profileInfo={profileInfo}
                      btnActions={["COMPOUNDS_REPORTS"]}
                    >
                      <li
                        className={
                          reportTypeFilter === "compoundsReport"
                            ? styles.active
                            : ""
                        }
                        onClick={() => setReportTypeFilter("compoundsReport")}
                      >
                        {circleIcon}
                        {key("COMPOUNDS_REPORTS")}
                      </li>
                    </CheckPermissions>
                  </CheckMySubscriptions>
                </ul>

                <hr />
                <h6>
                  <FontAwesomeIcon className={`${iconClass}`} icon={faTags} />
                  {key("type")}
                </h6>
                <CheckMySubscriptions
                  name="isFinancialReportsAllowed"
                  accountInfo={accountInfo}
                >
                  <CheckPermissions
                    profileInfo={profileInfo}
                    btnActions={["FINANCIAL_REPORTS"]}
                  >
                    {reportTypeFilter === "landlordReport" && (
                      <ul className={styles.filter_list}>
                        <li
                          className={
                            landlordFilter === "incomeReport"
                              ? styles.active
                              : ""
                          }
                          onClick={() => setLandlordFilter("incomeReport")}
                        >
                          <FontAwesomeIcon
                            className={`${iconClass}`}
                            icon={faSackDollar}
                          />
                          {key("incomeReport")}
                        </li>
                        <li
                          className={
                            landlordFilter === "incomeReportDetails"
                              ? styles.active
                              : ""
                          }
                          onClick={() =>
                            setLandlordFilter("incomeReportDetails")
                          }
                        >
                          <FontAwesomeIcon
                            className={`${iconClass}`}
                            icon={faFileInvoiceDollar}
                          />
                          {key("incomeReportDetails")}
                        </li>
                        <li
                          className={
                            landlordFilter === "paymentsReport"
                              ? styles.active
                              : ""
                          }
                          onClick={() => setLandlordFilter("paymentsReport")}
                        >
                          <FontAwesomeIcon
                            className={`${iconClass}`}
                            icon={faMoneyBillTrendUp}
                          />
                          {key("paymentsReport")}
                        </li>
                      </ul>
                    )}
                  </CheckPermissions>
                </CheckMySubscriptions>
                <CheckMySubscriptions
                  name="isOperationalReportsAllowed"
                  accountInfo={accountInfo}
                >
                  <CheckPermissions
                    profileInfo={profileInfo}
                    btnActions={["CONTRACTS_REPORTS"]}
                  >
                    {reportTypeFilter === "operationalReport" && (
                      <ul className={styles.filter_list}>
                        <li
                          className={
                            operationalFilter === "contractsReport"
                              ? styles.active
                              : ""
                          }
                          onClick={() =>
                            setOperationalFilter("contractsReport")
                          }
                        >
                          <FontAwesomeIcon
                            className={`${iconClass}`}
                            icon={faFileContract}
                          />
                          {key("contractsReport")}
                        </li>
                      </ul>
                    )}
                  </CheckPermissions>
                </CheckMySubscriptions>
                <CheckMySubscriptions
                  name="isCompoundsReportsAllowed"
                  accountInfo={accountInfo}
                >
                  <CheckPermissions
                    profileInfo={profileInfo}
                    btnActions={["COMPOUNDS_REPORTS"]}
                  >
                    {reportTypeFilter === "compoundsReport" && (
                      <ul className={styles.filter_list}>
                        <li
                          className={
                            compoundsFilter === "compoundsReport"
                              ? styles.active
                              : ""
                          }
                          onClick={() => setCompoundsFilter("compoundsReport")}
                        >
                          <FontAwesomeIcon
                            className={`${iconClass}`}
                            icon={faFileContract}
                          />
                          {key("compoundsReport")}
                        </li>
                        <li
                          className={
                            compoundsFilter === "compoundDetailsReport"
                              ? styles.active
                              : ""
                          }
                          onClick={() =>
                            setCompoundsFilter("compoundDetailsReport")
                          }
                        >
                          <FontAwesomeIcon
                            className={`${iconClass}`}
                            icon={faFileContract}
                          />
                          {key("compoundDetailsReport")}
                        </li>
                      </ul>
                    )}
                  </CheckPermissions>
                </CheckMySubscriptions>
              </div>
            </div>
          </Col>

          <Col sm={8} lg={9} xl={10}>
            <div className={`${styles.report_content} position-relative`}>
              {accountData === undefined && <LoadingOne />}
              {reportTypeFilter === "landlordReport" && (
                <CheckSubscriptionRender
                  name="isFinancialReportsAllowed"
                  accountData={accountData}
                >
                  <LandlordReport
                    landlordOptions={landlordOptions}
                    compoundsOptions={compoundsOptions}
                    estatesOptions={estatesOptions}
                    filterType={landlordFilter}
                  />
                </CheckSubscriptionRender>
              )}

              {reportTypeFilter === "operationalReport" && (
                <CheckSubscriptionRender
                  name="isOperationalReportsAllowed"
                  accountData={accountData}
                >
                  <OperationalReport
                    landlordOptions={landlordOptions}
                    compoundsOptions={compoundsOptions}
                    estatesOptions={estatesOptions}
                    filterType={operationalFilter}
                  />
                </CheckSubscriptionRender>
              )}

              {reportTypeFilter === "compoundsReport" &&
              compoundsFilter === "compoundsReport" ? (
                <CheckSubscriptionRender
                  name="isCompoundsReportsAllowed"
                  accountData={accountData}
                >
                  <CompoundsReport
                    landlordOptions={landlordOptions}
                    compoundsOptions={compoundsOptions}
                    filterType={compoundsFilter}
                  />
                </CheckSubscriptionRender>
              ) : (
                reportTypeFilter === "compoundsReport" &&
                compoundsFilter === "compoundDetailsReport" && (
                  <CheckSubscriptionRender
                    name="isCompoundsReportsAllowed"
                    accountData={accountData}
                  >
                    <CompoundDetailsReports
                      compoundsOptions={compoundsOptions}
                      filterType={compoundsFilter}
                    />
                  </CheckSubscriptionRender>
                )
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Reports;
