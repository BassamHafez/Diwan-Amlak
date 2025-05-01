import styles from "./Loading.module.css";
import loadingImg from "../../../assets/svg/loading.svg";
import AOS from "aos";
import { useEffect } from "react";

const LoadingOne = () => {
  useEffect(() => {
    AOS.init({disable: 'mobile'});;
  }, []);

  return (
    <div className={styles.loading}>
      <img
        data-aos="zoom-in"
        data-aos-duration="500"
        className="fa-fade"
        src={loadingImg}
        alt="loaidngImg"
      />
    </div>
  );
};

export default LoadingOne;
