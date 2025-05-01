import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import styles from "./LanguageChanger.module.css";
import {faLanguage } from "@fortawesome/free-solid-svg-icons";

const LanguageChanger = () => {
  const [key, i18n] = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <Dropdown className={styles.language_icon}>
      <Dropdown.Toggle
        className={`${styles.lang_btn} bg-transparent text-dark`}
        title={key("changeLang")}
      >
        <FontAwesomeIcon className={isArLang?"ms-2":"me-2"} icon={faLanguage} />
        {isArLang ? "العربية" : "English"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => i18n.changeLanguage("en")}>
          English
        </Dropdown.Item>
        <Dropdown.Item onClick={() => i18n.changeLanguage("ar")}>
          العربية
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageChanger;
