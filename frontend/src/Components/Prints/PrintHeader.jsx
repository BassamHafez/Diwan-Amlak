import styles from "./PrintContract.module.css";
import { useSelector, useTranslation } from "../../shared/hooks";
import { MainTitle, PrintNavBar } from "../../shared/components";

const PrintHeader = ({
  title,
  details,
  estateParentCompound,
  tenant,
  partiesTitle,
}) => {
  const { t: key } = useTranslation();
  const mainColClass = "d-flex justify-content-center align-items-center mx-3";
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const centerTitleClass = "d-flex justify-content-center";

  return (
    <>
      <PrintNavBar title={title} profileInfo={profileInfo} />
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
        <div className={centerTitleClass}>
          <MainTitle small={true} title={key("estateDetails")} />
        </div>

        <div className="d-flex flex-wrap justify-content-evenly">
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("theUnit")}</span>
              </div>
              <p>{details?.name}</p>
            </div>
          </div>
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("compound")}</span>
              </div>
              <p>{estateParentCompound?.name || key("noCompound")}</p>
            </div>
          </div>
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("location")}</span>
              </div>
              <p>
                {details?.region || estateParentCompound?.region} (
                {details?.city || estateParentCompound?.city})
              </p>
            </div>
          </div>
          {details?.unitNumber && (
            <div className={mainColClass}>
              <div className={styles.details_content}>
                <div className={styles.title}>
                  <span>{key("unitNum")}</span>
                </div>
                <p>{details?.unitNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.information}>
        <div className={centerTitleClass}>
          <MainTitle small={true} title={partiesTitle} />
        </div>
        <div className="scrollableTable">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                <th>{key("type")}</th>
                {details.broker || estateParentCompound?.broker ? null : (
                  <th>{key("theLandlord")}</th>
                )}
                {!details.broker && !estateParentCompound?.broker ? null : (
                  <th>{key("agent")}</th>
                )}
                <th>{key("theTenant")}</th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              <tr>
                <td>{key("name")}</td>
                {details.broker || estateParentCompound?.broker ? null : (
                  <td>
                    {details?.landlord?.name ||
                      estateParentCompound?.landlord?.name}
                  </td>
                )}
                {!details.broker && !estateParentCompound?.broker ? null : (
                  <td>
                    {details?.broker?.name ||
                      estateParentCompound?.broker?.name}
                  </td>
                )}
                <td>{tenant?.name || "-"}</td>
              </tr>
              <tr>
                <td>{key("phone")}</td>
                {details.broker || estateParentCompound?.broker ? null : (
                  <td>
                    {details?.landlord?.phone ||
                      estateParentCompound?.landlord?.phone}
                  </td>
                )}
                {!details.broker && !estateParentCompound?.broker ? null : (
                  <td>
                    {details?.broker?.phone ||
                      estateParentCompound?.broker?.phone}
                  </td>
                )}
                <td>{tenant?.phone || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintHeader;
