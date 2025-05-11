import { ButtonOne, MainModal } from "../../../../shared/components";
import {
  useTranslation,
  useSignOut,
  useDeleteItem,
  useSelector,
  useState,
  useNavigate,
} from "../../../../shared/hooks";

const DeleteUserForm = () => {
  const [modalShow, setModalShow] = useState(false);
  const token =
    useSelector((state) => state.userInfo.token) ||
    localStorage.getItem("token");
  const profileInfo = useSelector((state) => state.profileInfo?.data);
  const deleteItem = useDeleteItem();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { t: key } = useTranslation();

  const deleteAccount = async () => {
    const formData = {
      itemId: profileInfo?._id,
      token: token,
      endPoint: `users`,
      hideModal: setModalShow(false),
    };
    const response = deleteItem(formData);
    if (response === "success") {
      signOut();
      navigate("/");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end align-items-center">
        <ButtonOne
          borderd
          classes="bg-danger"
          onClick={() => setModalShow(true)}
          type="button"
        >
          {key("delete")}
        </ButtonOne>
      </div>

      {modalShow && (
        <MainModal
          show={modalShow}
          onHide={setModalShow}
          confirmFun={deleteAccount}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteUserMsg")}</h5>
        </MainModal>
      )}
    </>
  );
};

export default DeleteUserForm;
