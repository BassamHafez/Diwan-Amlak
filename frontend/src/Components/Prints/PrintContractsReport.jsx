import styles from "./PrintContract.module.css";
import { useSelector, useTranslation } from "../../shared/hooks";
import { MainTitle, PrintNavBar, ReportsDetailsHeader } from "../../shared/components";

const PrintContractsReport = ({
  id,
  contractsData,
  dataEnteried,
  isCompoundDetails,
  compoundDetailsTable,
  operationalTable,
}) => {
  const { t: key } = useTranslation();
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const totalAmount = !isCompoundDetails
    ? contractsData?.reduce(
        (sum, contract) => sum + (contract.totalAmount || 0),
        0
      )
    : 0;

  return (
    <div className={styles.container_body} id={id}>
      <PrintNavBar
        title={
          isCompoundDetails
            ? key("compoundDetailsReport")
            : key("contractsReport")
        }
        profileInfo={profileInfo}
      />

      <ReportsDetailsHeader dataEnteried={dataEnteried} />

      <div className={styles.information}>
        <div className="d-flex justify-content-center">
          <MainTitle small={true} title={isCompoundDetails ? key("compound") : key("incomePerEstate")}/>
        </div>
        <div className="scrollableTable">
          {compoundDetailsTable && isCompoundDetails
            ? compoundDetailsTable
            : operationalTable}
        </div>

        {!isCompoundDetails && (
          <p className="my-4 fw-bold">
            {key("totalAmount")} : {totalAmount} {key("sar")}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrintContractsReport;
