import { useTranslation } from "react-i18next";
import styles from "./PrintContract.module.css";
import { useSelector } from "react-redux";
import MainTitle from "../UI/Words/MainTitle";

const ReportsDetailsHeader = ({ dataEnteried }) => {
  const { t: key } = useTranslation();
  const mainColClass = "d-flex justify-content-center align-items-center mx-3";
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const accountInfo = useSelector((state) => state.accountInfo.data);

  return (
    <>
      <div className={styles.information}>
        <div className="d-flex justify-content-center">
          <MainTitle small={true} title={key("theAdmin")} />
        </div>
        <div className="d-flex flex-wrap justify-content-evenly">
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("employee")}</span>
              </div>
              <p>{profileInfo?.name}</p>
            </div>
          </div>

          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("employeePhone")}</span>
              </div>
              <p>{profileInfo?.phone}</p>
            </div>
          </div>

          {accountInfo?.account?.name && (
            <div className={mainColClass}>
              <div className={styles.details_content}>
                <div className={styles.title}>
                  <span>{key("office")}</span>
                </div>
                <p>{accountInfo?.account?.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.information}>
        <div className="d-flex justify-content-center">
          <MainTitle small={true} title={key("theDetails")} />
        </div>
        <div className="d-flex flex-wrap justify-content-evenly">
          {dataEnteried?.estate && (
            <div className={mainColClass}>
              <div className={styles.details_content}>
                <div className={styles.title}>
                  <span>{key("theUnit")}</span>
                </div>
                <p>{dataEnteried?.estate}</p>
              </div>
            </div>
          )}
          {dataEnteried?.compound && (
            <div className={mainColClass}>
              <div className={styles.details_content}>
                <div className={styles.title}>
                  <span>{key("compound")}</span>
                </div>
                <p>{dataEnteried?.compound}</p>
              </div>
            </div>
          )}
          {dataEnteried?.landlord && (
            <div className={mainColClass}>
              <div className={styles.details_content}>
                <div className={styles.title}>
                  <span>{key("theLandlord")}</span>
                </div>
                <p>{dataEnteried?.landlord}</p>
              </div>
            </div>
          )}
          {dataEnteried?.status && (
            <div className={mainColClass}>
              <div className={styles.details_content}>
                <div className={styles.title}>
                  <span>{key("status")}</span>
                </div>
                <p>{dataEnteried?.status}</p>
              </div>
            </div>
          )}
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("startDate")}</span>
              </div>
              <p>
                {dataEnteried?.startDueDate || dataEnteried?.startDate || "-"}
              </p>
            </div>
          </div>
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("endDate")}</span>
              </div>
              <p>{dataEnteried?.endDueDate || dataEnteried?.endDate || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsDetailsHeader;
