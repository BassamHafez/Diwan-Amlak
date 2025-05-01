import { FontAwesomeIcon, Link } from "../../shared/index";
import { useTranslation } from "../../shared/hooks";
import { ButtonOne } from "../../shared/components";
import { faTriangleExclamation } from "../../shared/constants";
import { Alert } from "../../shared/bootstrap";

const VerifyPhoneAlert = ({ isModalAlert }) => {
  const { t: key } = useTranslation();

  const content = (
    <>
      <span>{key("phoneVerifyMsg")}</span>
      <div className="d-flex justify-content-center mt-3 position-relative">
        <Link to={"/verify-phone"}>
          <ButtonOne text={key("verify")} borderd={true} />
        </Link>
      </div>
    </>
  );

  return (
    <>
      {isModalAlert ? (
        content
      ) : (
        <Alert variant="warning">
          <FontAwesomeIcon
            className="mx-2 fa-fade"
            icon={faTriangleExclamation}
          />
          {content}
        </Alert>
      )}
    </>
  );
};

export default VerifyPhoneAlert;
