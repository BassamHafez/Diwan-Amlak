import { FontAwesomeIcon } from "../../shared/index";
import { useParams, useTranslation } from "../../shared/hooks";
import { faCircleXmark, faCheckCircle } from "../../shared/constants";
import styles from "./Payment.module.css";

const PaymentDetails = ({ data }) => {
  const { status } = useParams();
  const { t: key } = useTranslation();
  const [date, timeWithZone] = data.date.split("T");
  const time = timeWithZone.split(".")[0];
  const isPaymentSuccess = data.status === "COMPLETED" && status === "success";

  return (
    <div>
      <div className="text-center">
        {!isPaymentSuccess ? (
          <>
            <div className={styles.check_icon_failed}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </div>

            <span>{key("paymentFailed")}</span>
          </>
        ) : (
          <>
            <div className={styles.check_icon}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>

            <span>{key("paymentSuccessful")}</span>
          </>
        )}
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>{key("amount")}</th>
              <td>
                {data?.amount} {key("sar")}
              </td>
            </tr>
            <tr>
              <th>{key("status")}</th>
              <td>
                {data?.status === "NOT_COMPLETED"
                  ? key("incomplete")
                  : key("completed")}
              </td>
            </tr>
            <tr>
              <th>{key("type")}</th>
              <td>
                {data.type === "custom"
                  ? key("customPackage")
                  : key("readyPackage")}
              </td>
            </tr>
            <tr>
              <th>{key("time")}</th>
              <td>{time}</td>
            </tr>
            <tr>
              <th>{key("date")}</th>
              <td>{date}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDetails;
