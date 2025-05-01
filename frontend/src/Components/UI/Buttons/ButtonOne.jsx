import styles from "./Buttons.module.css";
import { memo } from "react";

const ButtonOne = memo(
  ({ text, onClick, type, children, color, classes, borderd, disabled }) => {
    return (
      <button
        onClick={onClick}
        type={type ? type : "button"}
        className={`${styles.btn_one} ${
          color === "white" ? styles.white_btn : ""
        } ${classes} ${borderd && styles.rounded_btn}`}
        disabled={disabled}
      >
        {text ? text : children}
        <div className={styles.btn_one_layer}></div>
      </button>
    );
  }
);

ButtonOne.displayName = "ButtonOne";
export default ButtonOne;
