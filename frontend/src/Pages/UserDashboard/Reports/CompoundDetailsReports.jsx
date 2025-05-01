import styles from "./Reports.module.css";
import {
  convertNumbersToFixedTwo,
  generatePDF,
  handleDownloadExcelSheet,
} from "../../../Components/Logic/LogicFun";
import { contractsReportTable } from "../../../Components/Logic/StaticLists";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import PrintContractsReport from "../../../Components/Prints/PrintContractsReport";
import CompoundsReportForm from "./ReportForms/CompoundsReportForm";
import { FontAwesomeIcon } from "../../../shared/index";
import { faCircleInfo } from "../../../shared/constants";
import {
  useCallback,
  useMemo,
  useState,
  useCompoundAnlaysis,
  useTranslation,
  useSelector,
} from "../../../shared/hooks";
import {
  ButtonOne,
  CheckMySubscriptions,
  MainTitle,
} from "../../../shared/components";

const CompoundDetailsReports = ({ compoundsOptions, filterType }) => {
  const [compoundData, setCompoundData] = useState({});
  const [dataEnteried, setDataEnteried] = useState({
    startDate: "",
    endDate: "",
    compound: "",
  });

  const {
    theCommissionVal,
    commissionPercentage,
    netIncomeVal,
    netReturnsVal,
    collectionRatioVal,
  } = useCompoundAnlaysis(compoundData || {});
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const { t: key } = useTranslation();

  const getSearchData = useCallback((compoundData, formValues) => {
    setCompoundData(compoundData);
    setDataEnteried(formValues);
  }, []);

  const compoundInfo = compoundData?.compound;

  const filteredCompoundDetail = useMemo(() => {
    return {
      [key("estate")]: compoundInfo?.name || "-",
      [key("region")]: compoundInfo?.region || "-",
      [key("totalProperties")]: compoundInfo?.estatesCount || "-",
      [`${key("collectionRatio")} (%)`]: collectionRatioVal || "-",
      [`${key("theCommission")} (${key("sarSmall")})`]: theCommissionVal || "0",
      [`${key("netIncome")} (${key("sarSmall")})`]: netIncomeVal || "-",
      [`${key("operatingRatio")} (%)`]:
        convertNumbersToFixedTwo(commissionPercentage) || "0",
      [`${key("netReturns")} (%)`]: netReturnsVal || "-",
    };
  }, [
    key,
    compoundInfo,
    commissionPercentage,
    collectionRatioVal,
    theCommissionVal,
    netIncomeVal,
    netReturnsVal,
  ]);

  const compoundDetailsTable = useMemo(() => {
    return (
      <table className={`${styles.contract_table} table`}>
        <thead className={styles.table_head}>
          <tr>
            <th>{key("estate")}</th>
            <th>{key("region")}</th>
            <th>{key("totalProperties")}</th>
            <th>{`${key("collectionRatio")} (%)`}</th>
            <th>{`${key("theCommission")} (${key("sarSmall")})`}</th>
            <th>{`${key("netIncome")} (${key("sarSmall")})`}</th>
            <th>{`${key("operatingRatio")} (%)`}</th>
            <th>{`${key("netReturns")} (%)`}</th>
          </tr>
        </thead>

        <tbody className={styles.table_body}>
          {compoundData ? (
            <tr>
              <td>{compoundInfo?.name || "-"}</td>
              <td>{compoundInfo?.region || "-"}</td>
              <td>{compoundInfo?.estatesCount || "-"}</td>
              <td>{collectionRatioVal || "-"}</td>
              <td>{theCommissionVal || "0"}</td>
              <td>{netIncomeVal || "-"}</td>
              <td>{convertNumbersToFixedTwo(commissionPercentage) || "0"}</td>
              <td>{netReturnsVal || "-"}</td>
            </tr>
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
    );
  }, [
    compoundData,
    key,
    compoundInfo,
    collectionRatioVal,
    theCommissionVal,
    netIncomeVal,
    commissionPercentage,
    netReturnsVal,
  ]);

  return (
    <>
      <div>
        <div className="my-3">
          <MainTitle>{key("compoundDetailsReport")}</MainTitle>
        </div>
        <div className="p-md-5">
          <CompoundsReportForm
            compoundsOptions={compoundsOptions}
            getSearchData={getSearchData}
            type={filterType}
          />
        </div>
        <hr />
        <div>
          <MainTitle>{key("compound")}</MainTitle>
          <div className={`${styles.header} justify-content-end`}>
            <div>
              {compoundData && (
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
                      onClick={() =>
                        handleDownloadExcelSheet(
                          [filteredCompoundDetail],
                          `${key(filterType)}.xlsx`,
                          `${key(filterType)}`,
                          accountInfo?.account?.isFilesExtractAllowed
                        )
                      }
                    />
                    <ButtonOne
                      onClick={() =>
                        generatePDF(
                          `compoundDetailsReport_${dataEnteried?.startDate}`,
                          `${key("compoundDetailsReport")}_(${
                            dataEnteried?.startDate
                          }) (${dataEnteried?.endDate}) ${
                            dataEnteried.compound || ""
                          }`,
                          accountInfo?.account?.isFilesExtractAllowed
                        )
                      }
                      classes="m-2 bg-navy"
                      borderd
                      text={key("download")}
                    />
                  </CheckPermissions>
                </CheckMySubscriptions>
              )}
            </div>
          </div>
          <div className="scrollableTable">{compoundDetailsTable}</div>
        </div>
      </div>
      <div className="d-none">
        <PrintContractsReport
          id={`compoundDetailsReport_${dataEnteried?.startDate}`}
          contractsData={compoundData}
          dataEnteried={dataEnteried}
          isCompoundDetails={true}
          compoundDetailsTable={compoundDetailsTable}
        />
      </div>
    </>
  );
};

export default CompoundDetailsReports;
