import { useTranslation } from "react-i18next";
import styles from "./Reports.module.css";
import {
  generatePDF,
  handleDownloadExcelSheet,
} from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import {
  compoundsReportTable,
  contractsReportTable,
  reportsFiltering,
} from "../../../Components/Logic/StaticLists";
import { useCallback, useMemo, useState } from "react";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import Select from "react-select";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import PrintFinancialReport from "../../../Components/Prints/PrintFinancialReport";
import CompoundsReportForm from "./ReportForms/CompoundsReportForm";
import { useSelector } from "react-redux";
import { CheckMySubscriptions } from "../../../shared/components";

const CompoundsReport = ({ compoundsOptions, landlordOptions, filterType }) => {
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [dataEnteried, setDataEnteried] = useState({
    startDate: "",
    endDate: "",
    compoundsIds: [],
    landlord: "",
  });
  const [resultFilter, setResultFilter] = useState("");
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";

  const getSearchData = useCallback((ex, rev, formValues) => {
    setExpenses(ex);
    setRevenues(rev);
    console.log("formCalu", formValues);
    setDataEnteried(formValues);
  }, []);

  const combinedData = useMemo(() => {
    return [
      ...revenues.map((item) => ({
        ...item,
        category: "revenue",
      })),
      ...expenses.map((item) => ({
        ...item,
        category: "expense",
      })),
    ];
  }, [revenues, expenses]);

  const filterChangeHandler = (val) => {
    setResultFilter(val ? val : "");
  };

  const filteredResults = useMemo(() => {
    return combinedData.filter(
      (item) =>
        resultFilter === "" ||
        item.category.trim().toLowerCase() === resultFilter.trim().toLowerCase()
    );
  }, [combinedData, resultFilter]);

  const filteredData = useMemo(() => {
    const reportsData = [...(combinedData || [])];
    return reportsData.map((comp) => {
      return {
        [key("category")]: key(comp?.category) || "-",
        [key("estate")]: comp?.compoundName || "-",
        [`${key("total")} (${key("sarSmall")})`]: comp?.total || "-",
      };
    });
  }, [combinedData, key]);

  const exportCsvHandler = useCallback(() => {
    handleDownloadExcelSheet(
      filteredData,
      `${key(filterType)}.xlsx`,
      `${key(filterType)}`,
      accountInfo?.account?.isFilesExtractAllowed
    );
  }, [filteredData, accountInfo, filterType, key]);

  const downloadPdfHandler = useCallback(() => {
    generatePDF(
      "compoundsReport",
      `${key(filterType)}_(${dataEnteried.startDate || ""}) (${
        dataEnteried.endDate || ""
      })`,
      accountInfo?.account?.isFilesExtractAllowed
    );
  }, [dataEnteried, accountInfo, filterType, key]);

  return (
    <>
      <div>
        <div className="my-3">
          <MainTitle>{key("COMPOUNDS_REPORTS")}</MainTitle>
        </div>
        <div className="p-md-5">
          <CompoundsReportForm
            landlordOptions={landlordOptions}
            compoundsOptions={compoundsOptions}
            getSearchData={getSearchData}
            type={filterType}
          />
        </div>

        <hr />

        <div>
          <div className="my-3">
            <MainTitle>{key("compounds")}</MainTitle>
          </div>

          {combinedData && combinedData?.length > 0 && (
            <div className={styles.header}>
              <Select
                options={reportsFiltering[currentLang]}
                onChange={(val) => filterChangeHandler(val ? val.value : null)}
                className={`${isArLang ? "text-end me-2" : "text-start ms-2"} ${
                  styles.select_type
                } my-3`}
                isRtl={isArLang ? true : false}
                placeholder={key("category")}
                isClearable
              />
              <div>
                <CheckMySubscriptions
                  name="isFilesExtractAllowed"
                  accountInfo={accountInfo}
                >
                  <CheckPermissions
                    profileInfo={profileInfo}
                    btnActions={["COMPOUNDS_REPORTS"]}
                  >
                    <ButtonOne
                      classes="m-2"
                      borderd
                      color="white"
                      text={key("exportCsv")}
                      onClick={exportCsvHandler}
                    />
                    <ButtonOne
                      onClick={downloadPdfHandler}
                      classes="m-2 bg-navy"
                      borderd
                      text={key("download")}
                    />
                  </CheckPermissions>{" "}
                </CheckMySubscriptions>
              </div>
            </div>
          )}
          <div className="scrollableTable">
            <table className={`${styles.contract_table} table`}>
              <thead className={styles.table_head}>
                <tr>
                  {compoundsReportTable.map((title, index) => (
                    <th key={`${title}_${index}`}>{key(title)}</th>
                  ))}
                </tr>
              </thead>

              <tbody className={styles.table_body}>
                {filteredResults?.length > 0 ? (
                  filteredResults?.map((item, index) => (
                    <tr key={index}>
                      <td>{key(item.category)}</td>
                      <td>{item.compoundName}</td>
                      <td
                        className={` ${
                          item.category === "expense"
                            ? "text-danger "
                            : "text-success"
                        }`}
                      >
                        {item.total}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={`${contractsReportTable.length || "5"}`}
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
      </div>
      <div className="d-none">
        <PrintFinancialReport
          expenses={expenses}
          revenues={revenues}
          combinedData={combinedData}
          dataEnteried={dataEnteried}
          filterType="incomeReport"
          isCompoundsReport={true}
        />
      </div>
    </>
  );
};

export default CompoundsReport;
