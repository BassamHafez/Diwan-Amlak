import { FontAwesomeIcon } from "../../shared/index";
import { faCircleXmark } from "../../shared/constants";
import styles from "./Payment.module.css";
import { useTranslation } from "../../shared/hooks";

const FailPayment = () => {
  const { t: key } = useTranslation();
  const now = new Date();
  const currentTime = now.toLocaleTimeString();
  const currentDate = now.toLocaleDateString();

  return (
    <div>
      <div className="text-center">
        <div className={styles.check_icon_failed}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </div>

        <span>{key("paymentFailed")}</span>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>{key("status")}</th>
              <td>{key("incomplete")}</td>
            </tr>
            <tr>
              <th>{key("time")}</th>    
              <td>{currentTime}</td>
            </tr>
            <tr>
              <th>{key("date")}</th>
              <td>{currentDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FailPayment;
