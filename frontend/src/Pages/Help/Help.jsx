import { useTranslation } from "react-i18next";
import help from "../../assets/help.webp";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Help = () => {
  const { t: key } = useTranslation();
  const configs = useSelector((state) => state.configs);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center height_container">
      <img className="standard_img" src={help} alt="help_img" />
      <span>
        {key("helpMsg")}{" "}
        <Link
          to={`https://wa.me/${configs?.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {key("here")}
        </Link>
      </span>
    </div>
  );
};

export default Help;
