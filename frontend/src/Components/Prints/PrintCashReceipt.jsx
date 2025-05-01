import styles from "./PrintContract.module.css";
import {
  convertNumbersToFixedTwo,
  formattedDate,
  renamedPaymentMethod,
} from "../Logic/LogicFun";
import { useSelector, useTranslation } from "../../shared/hooks";
import { PrintHeader, MainTitle } from "../../shared/components";

const PrintCashReceipt = ({
  revDetails,
  estateParentCompound,
  details,
  id,
  isTax,
  taxNumber,
}) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const mainTitle = isTax ? key("taxInvoice") : key("cashReceipt");
  const VAT = useSelector((state) => state.configs?.VAT);

  const calculateTotalAmount = (baseAmount, type) => {
    const baseNum = Number(baseAmount);
    const VATVal = (Number(VAT) / 100) * baseNum;
    if (type === "vat") {
      return VATVal;
    } else {
      return baseNum + VATVal;
    }
  };

  return (
    <div className={styles.container_body} id={id}>
      <PrintHeader
        title={mainTitle}
        details={details}
        estateParentCompound={estateParentCompound}
        tenant={revDetails?.tenant}
        partiesTitle={
          isTax ? key("partiestaxInvoice") : key("partiesCashReceipt")
        }
      />

      <div className={styles.information}>
        <div className="d-flex justify-content-center">
          <MainTitle small={true} title={mainTitle} />
        </div>
        {isTax && (
          <div className={styles.tax_num}>
            <span>
              {key("taxNumber")} : {taxNumber}
            </span>
          </div>
        )}
        <div className="scrollableTable">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                <th>
                  {isTax
                    ? key("baseAmount")
                    : `${key("amount")} ${key("sarSmall")}`}
                </th>
                {isTax && (
                  <>
                    <th>{key("VAT")}</th>
                    <th>{key("total")}</th>
                  </>
                )}
                <th>{key("dueDate")}</th>
                <th>{key("paidAt")}</th>
                <th>{key("paymentMethod")}</th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              <tr>
                <td>{revDetails?.amount}</td>
                {isTax && (
                  <>
                    <td>{calculateTotalAmount(revDetails?.amount, "vat")}</td>
                    <td>
                      {convertNumbersToFixedTwo(
                        calculateTotalAmount(revDetails?.amount)
                      )}
                    </td>
                  </>
                )}
                <td>{formattedDate(revDetails?.dueDate)}</td>
                <td>{formattedDate(revDetails?.paidAt)}</td>
                <td>
                  {isArLang
                    ? renamedPaymentMethod(revDetails.paymentMethod, "ar")
                    : renamedPaymentMethod(revDetails.paymentMethod, "en")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {revDetails.note && (
        <div className={styles.information}>
          <div className={styles.notes}>
            <h5>{key("notes")}</h5>
            <div>
              <p>{revDetails.note ? revDetails.note : "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintCashReceipt;
