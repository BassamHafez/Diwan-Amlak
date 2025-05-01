import styles from "./UserProfile.module.css";
import SecurityForm from "./ProfileForms/SecurityForm";
import { mainDeleteFunHandler } from "../../../util/Http";
import { useNavigate } from "react-router-dom";
import { userActions } from "../../../Store/userInfo-slice";
import { saveIsLoginState } from "../../../Store/userInfo-actions";
import { MainModal } from "../../../shared/components";
import { passImage } from "../../../shared/images";
import { Col, Row } from "../../../shared/bootstrap";
import { toast } from "../../../shared/constants";
import {
  useState,
  useDispatch,
  useSelector,
  useTranslation,
} from "../../../shared/hooks";

const ProfileSecurity = () => {
  const { t: key } = useTranslation();
  const [showDeActivateModal, setShowDeActivateModal] = useState(false);
  const token = useSelector((state) => state.userInfo.token);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const LogOutProcess = () => {
    localStorage.removeItem("userData");
    dispatch(userActions.setRole(""));
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    dispatch(userActions.setIsLogin(false));
    dispatch(saveIsLoginState(false));
    navigate("/login");
  };

  const deActivateAcc = async () => {
    setShowDeActivateModal(false);

    if (profileInfo?._id && token) {
      const res = await mainDeleteFunHandler({
        id: profileInfo?._id,
        token: token,
        type: `users`,
      });
      if (res.status === 204) {
        notifySuccess(key("deletedSucc"));
        LogOutProcess();
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };
  return (
    <>
      <div className={styles.security_container}>
        <Row className="w-100">
          <Col md={6}>
            <div className={styles.container}>
              <h4 className="mb-4">{key("changePassword")}</h4>
              <SecurityForm LogOutProcess={LogOutProcess} />
            </div>
            {/* delete account here */}
          </Col>
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <div className={styles.passImage}>
              <img src={passImage} alt="password_imgae" />
            </div>
          </Col>
        </Row>
      </div>

      {showDeActivateModal && (
        <MainModal
          show={showDeActivateModal}
          onHide={() => setShowDeActivateModal(false)}
          okBtn={key("confirm")}
          cancelBtn={key("cancel")}
          confirmFun={deActivateAcc}
        >
          <p>{key("deActivateConfirmMessage")}</p>
        </MainModal>
      )}
    </>
  );
};

export default ProfileSecurity;
