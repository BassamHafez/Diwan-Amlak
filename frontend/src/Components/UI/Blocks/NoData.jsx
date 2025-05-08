import {
  noDataImg,
  summary,
  noExpenses,
  estate,
  support,
  upgrade,
} from "../../../shared/images";
import styles from "./NoData.module.css";

const NoData = ({ text, type, smallSize, verySmallSize }) => {
  const imageMap = {
    tasks: summary,
    expenses: noExpenses,
    estate: estate,
    support: support,
    upgrade: upgrade,
  };
  const myImage = imageMap[type] || noDataImg;

  const imgSizeClass = verySmallSize
    ? styles.verySmall
    : smallSize
    ? styles.small_size
    : styles.medium_size;

  return (
    <div className={`${styles.noData} ${imgSizeClass}`}>
      <img src={myImage} alt={`No data available for ${type || "general"}`} />
      <span>{text}</span>
    </div>
  );
};

export default NoData;
