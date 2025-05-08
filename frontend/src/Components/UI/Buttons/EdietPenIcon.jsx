import styles from "./EdietPenIcon.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const EdietPenIcon = ({ onClick, text, color, type }) => {
  const penColorClass = color === "blue" ? styles.penColorGray : "";
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <div
      onClick={onClick}
      className={`${styles.ediet_div} ${penColorClass} ${
        isArLang ? styles.ediet_div_ar : styles.ediet_div_en
      }`}
    >
      <FontAwesomeIcon
        className={styles.ediet_pen_icon}
        icon={
          type === "delete" ? faTrashCan : color === "blue" ? faGear : faPencil
        }
      />
      <span className={styles.ediet_span}>{text ? text : key("ediet")}</span>
    </div>
  );
};

export default EdietPenIcon;
