import styles from "./PrintContract.module.css";
import { formattedDate } from "../Logic/LogicFun";
import { useTranslation } from "../../shared/hooks";
import { useEffect, useState } from "react";
import { avatar } from "../../shared/images";

const PrintNavBar = ({ title, profileInfo }) => {
  const currentDate = new Date();
  const { t: key } = useTranslation();
  const [base64Image, setBase64Image] = useState(null);

  useEffect(() => {
    const fetchImageAsBase64 = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_Host}${profileInfo?.photo}`
        );
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Image(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.log(error);
      }
    };

    if (profileInfo?.photo) {
      fetchImageAsBase64();
    }
  }, [profileInfo]);

  return (
    <div className={styles.header}>
      <img
        src={base64Image ? base64Image : avatar}
        className={styles.avatar}
        alt="profile_pic"
      />
      <h2>{title}</h2>
      <div className="text-center">
        <span style={{ fontSize: "12px" }}>{key("printDate")}</span>
        <p>{formattedDate(currentDate)}</p>
      </div>
    </div>
  );
};

export default PrintNavBar;
