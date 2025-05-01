import { useTranslation } from "react-i18next";
import RevenuesByMonth from "../../../Components/Charts/RevenuesByMonth";
import styles from "./UserHome.module.css";

const RevenueByMonthChart = ({ myData }) => {

  const { t: key } = useTranslation();

  return (
    <div className={`${styles.information_section} p-1`}>
      <h4 className="fw-bold mx-2 my-4">{key("monthlyRevenues")}</h4>
      <RevenuesByMonth revenuesByMonth={myData?.revenuesByMonth} />
    </div>
  );
};

export default RevenueByMonthChart;
