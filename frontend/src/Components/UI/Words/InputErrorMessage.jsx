import styles from "./InputErrorMessage.module.css";

const InputErrorMessage = (props) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <p
      className={`${styles.error_message} ${
        isArLang ? styles.error_message_ar : styles.error_message_en
      }`}
    >
      {props.text ? props.text : props.children.value || props.children}
    </p>
  );
};

export default InputErrorMessage;
