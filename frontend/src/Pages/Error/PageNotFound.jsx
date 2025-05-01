import { useTranslation } from "react-i18next";
import notFoundImg from "../../assets/error404.webp";
import ImgPreloader from "../../Components/Img/ImgPreloader";

const PageNotFound = () => {
  const { t: key } = useTranslation();

  return (
    <div className="height_container d-flex flex-column justify-content-center align-items-center p-2">
      <ImgPreloader
        src={notFoundImg}
        alt="404_page_not_found"
        classes="standard_img"
      />
      <span className="text-secondary">{key("notFoundMsg")}</span>
    </div>
  );
};

export default PageNotFound;
