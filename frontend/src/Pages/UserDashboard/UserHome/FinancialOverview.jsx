import { Row, Col } from "../../../shared/bootstrap";
import { useMemo, useTranslation } from "../../../shared/hooks";
import styles from "./UserHome.module.css";
import { profits, loss, office, paid, homeKey } from "../../../shared/images";
import { convertNumbersToFixedTwo } from "../../../Components/Logic/LogicFun";

const FinancialOverview = ({ myData, totalExpenses, totalRevenues }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const FinancialData = useMemo(() => {
    return [
      {
        label: "totalRevenues",
        value: totalRevenues,
        isMoney: true,
        icon: profits,
      },
      {
        label: "totalExpenses",
        value: totalExpenses,
        isMoney: true,
        icon: loss,
      },
      {
        label: "estateCount",
        value: myData?.totalEstatesCount || 0,
        isMoney: false,
        icon: office,
      },
      {
        label: "totalPaidRevenues",
        value: myData?.totalPaidRevenues || 0,
        isMoney: true,
        icon: paid,
      },
      {
        label: "totalPaidExpenses",
        value: myData?.totalPaidExpenses || 0,
        isMoney: true,
        icon: paid,
      },
      {
        label: "rentedEstates",
        value: myData?.rentedEstatesCount || 0,
        isMoney: false,
        icon: homeKey,
      },
    ];
  }, [myData, totalExpenses, totalRevenues]);

  return (
    <div className={styles.information_section}>
      <h4 className="fw-bold mb-4">{key("financialOverview")}</h4>
      <Row className="g-4 w-100 flex-wrap">
        {FinancialData?.map((item, index) => (
          <Col
            className="d-flex justify-content-center align-items-center"
            key={index}
            xl={4}
            sm={6}
          >
            <div className={styles.box}>
              <div
                className={`${styles.box_img} ${isArLang ? "ms-2" : "me-2"} ${
                  isArLang ? styles.box_img_ar : styles.box_img_en
                }`}
              >
                <img src={item.icon} alt="icon" />
              </div>

              <div className={styles.box_caption}>
                <span>{key(item.label)}</span>

                <p style={{ wordBreak: "break-all" }}>
                  {convertNumbersToFixedTwo(item.value)}{" "}
                  {item.isMoney ? key("sarSmall") : ""}
                </p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FinancialOverview;
