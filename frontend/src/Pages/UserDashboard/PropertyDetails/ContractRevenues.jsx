import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import MainTitle from "../../../Components/UI/Words/MainTitle";

const ContractRevenues = (props) => {
  const { t: key } = useTranslation();
  
  return (
    <div className="position-relative">
      <div className="d-flex justify-content-center mb-2">
        <MainTitle small={true} title={key("revenues")} />
      </div>
      <div className="scrollableTable">
        <table className={`${styles.contract_table} table`}>
          <thead className={styles.table_head}>
            <tr>
              <th>{key("rentPayment")}</th>
              <th>{key("amount")}</th>
              <th>{key("dueDate")}</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {props.revenues ? (
              props.revenues.map((rev, index) => (
                <tr key={`${rev.dueDate}_${index}`}>
                  <td>{index + 1}</td>
                  <td>{rev.amount}</td>
                  <td>{rev.dueDate}</td>
                </tr>
              ))
            ) : (
              <LoadingOne />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractRevenues;
