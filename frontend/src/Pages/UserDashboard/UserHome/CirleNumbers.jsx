import TotalExAndRev from "../../../Components/Charts/TotalExAndRev";
import { Row, Col } from "../../../shared/bootstrap";
import { useMemo } from "../../../shared/hooks";
import styles from "./UserHome.module.css";

const CirleNumbers = ({ myData, totalExpenses, totalRevenues }) => {
  const ratioData = useMemo(() => {
    return [
      {
        type: "esates",
        total: myData?.totalEstatesCount || 0,
        paidAmount: myData?.rentedEstatesCount || 0,
      },
      {
        type: "revenues",
        total: totalRevenues,
        paidAmount: myData?.totalPaidRevenues || 0,
      },
      {
        type: "expenses",
        total: totalExpenses,
        paidAmount: myData?.totalPaidExpenses || 0,
      },
    ];
  }, [myData, totalExpenses, totalRevenues]);

  return (
    <div className={styles.information_section}>
      <Row className="g-3 w-100">
        {ratioData?.map((item, index) => (
          <Col key={`${item.type}_${index}`} md={12} sm={4}>
            <TotalExAndRev
              type={item.type}
              total={item.total}
              paidAmount={item.paidAmount}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CirleNumbers;
