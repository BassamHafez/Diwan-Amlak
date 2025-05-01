import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import hijri from "react-date-object/calendars/arabic";
import greogrian from "react-date-object/calendars/gregorian";
import EnglishHijri from "react-date-object/locales/arabic_en";
import EnglishGeo from "react-date-object/locales/gregorian_en";
import transition from "react-element-popper/animations/transition";
import styles from "./Fields.module.css";
import { useTranslation } from "react-i18next";
import { toGregorian, toHijri } from "hijri-converter";

const DateField = ({ setFieldValue, labelText, value, defaultVal }) => {
  const [isHijriDate, setIsHijriDate] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [dateValue, setDateValue] = useState(defaultVal || "");

  const handleDateChange = (date) => {
    let formattedDate;
    if (isHijriDate) {
      const [year, month, day] = date.split("/").map(Number);
      const { gy, gm, gd } = toGregorian(year, month, day);
      formattedDate = `${gy}-${String(gm).padStart(2, "0")}-${String(
        gd
      ).padStart(2, "0")}`;
    } else {
      formattedDate = date;
    }
    setFieldValue(value, formattedDate);
  };

  useEffect(() => {
    if (defaultVal) {
      if (isHijriDate) {
        const [year, month, day] = defaultVal.split("-").map(Number);
        const { hy, hm, hd } = toHijri(year, month, day);
        setDateValue(
          `${hy}/${String(hm).padStart(2, "0")}/${String(hd).padStart(2, "0")}`
        );
      } else {
        setDateValue(defaultVal);
      }
    }
  }, [defaultVal, isHijriDate]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <label htmlFor="dateOfBirth" className="my-2">
          {labelText}
        </label>
        <ul className={`${styles.date_type_list} my-2 p-0`}>
          <li
            onClick={() => setIsHijriDate(true)}
            className={`${isArLang ? "ms-1" : "me-1"} ${
              isHijriDate ? styles.active_date_type : ""
            }`}
          >
            {key("hijri")}
          </li>
          <li
            onClick={() => setIsHijriDate(false)}
            className={`${isArLang ? "me-1" : "ms-1"} ${
              !isHijriDate ? styles.active_date_type : ""
            }`}
          >
            {key("greogrian")}
          </li>
        </ul>
      </div>

      {defaultVal ? (
        <DatePicker
          calendar={isHijriDate ? hijri : greogrian}
          locale={isHijriDate ? EnglishHijri : EnglishGeo}
          animations={[transition()]}
          value={dateValue}
          onChange={(date) => handleDateChange(date.format())}
          style={{ padding: "1.5625rem" }}
        />
      ) : (
        <DatePicker
          calendar={isHijriDate ? hijri : greogrian}
          locale={isHijriDate ? EnglishHijri : EnglishGeo}
          animations={[transition()]}
          onChange={(date) => handleDateChange(date.format())}
          style={{ padding: "1.5625rem" }}
        />
      )}
    </>
  );
};

export default DateField;
