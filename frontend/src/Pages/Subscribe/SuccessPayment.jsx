import { FontAwesomeIcon } from "../../shared/index";
import { faCheckCircle } from "../../shared/constants";
import styles from "./Payment.module.css";
import { useTranslation } from "../../shared/hooks";

const SuccessPayment = () => {

    const { t: key } = useTranslation();
      const now = new Date();
      const currentTime = now.toLocaleTimeString();
      const currentDate = now.toLocaleDateString();

  return (
    <div>
    <div className="text-center">
      <div className={styles.check_icon}>
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>

      <span>{key("paymentSuccessful")}</span>
    </div>

    <div className="table-responsive mt-3">
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>{key("status")}</th>
            <td>{key("completed")}</td>
          </tr>
          <tr>
            <th>{key("time")}</th>
            <td>{currentTime}</td>
          </tr>
          <tr>
            <th>{key("date")}</th>
            <td>{currentDate}</td>
          </tr>
          {/* <tr>
            <th>{key("amount")}</th>
            <td>{data?.data?.amount || ""}</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default SuccessPayment
