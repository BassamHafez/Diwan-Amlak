import { useTranslation } from "react-i18next";
import notFoundImg from "../../assets/mainError.webp";
import { Link, useNavigate } from "react-router-dom";

const MainError = () => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      style={{ zIndex: "8" }}
      className="d-flex justify-content-center align-items-center flex-column position-absolute top-0 start-0 over h-100 w-100"
    >
      <img className="standard_img" src={notFoundImg} alt="unexpected_error" />
      <span className="text-secondary">{key("mainErrorMsg")}</span>
      <span className="text-secondary">
        {key("contactSupport")} <Link>{key("here")}</Link>
      </span>
      <div className="py-5">
        <button
          className="btn bg-main py-2 px-5"
          style={{ transition: "scale .3s" }}
          onClick={() => navigate("/")}
        >
          {key("home")}
        </button>
      </div>
    </div>
  );
};

export default MainError;
