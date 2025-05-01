import styles from "../Admin.module.css";
import { FontAwesomeIcon } from "../../../shared/index";
import { faCrown, faSquarePhone } from "../../../shared/constants";
import {
  useSelector,
  useCallback,
  useState,
  useTranslation,
  useDeleteItem,
  useNavigate,
} from "../../../shared/hooks";
import { MainModal, ButtonOne } from "../../../shared/components";
import { Col } from "../../../shared/bootstrap";
import { avatar } from "../../../shared/images";
import UserDetailsBlock from "../../UserDashboard/UserProfile/UserDetailsBlock";

const UserItem = ({
  userData,
  refetch,
  selectUserHandler,
  selectedUsers,
  isAdminPage,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const deleteItem = useDeleteItem();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const isIdExist = selectedUsers?.find((id) => id === userData?._id);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();

  const deletePack = async () => {
    const formData = {
      itemId: userData?._id,
      endPoint: `users`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    deleteItem(formData);
  };

  const selectHandler = useCallback(() => {
    selectUserHandler(userData?._id);
  }, [selectUserHandler, userData]);

  const navigateToAdminPage = useCallback(() => {
    navigate("/admin-settings");
  }, [navigate]);

  const showDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const hideDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const showDetailsModalHandler = useCallback(() => {
    setShowDetailsModal(true);
  }, []);

  const hideDetailsModalHandler = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  return (
    <>
      <Col lg={4} md={6}>
        <div
          className={`${styles.item} ${
            isIdExist !== undefined && isIdExist
              ? styles.borderd_item
              : styles.transparent_border
          } pb-3`}
        >
          <div className={styles.header} style={{cursor:"pointer"}} onClick={showDetailsModalHandler}>
            <img
              src={
                userData.photo
                  ? `${import.meta.env.VITE_Host}${userData.photo}`
                  : avatar
              }
              alt="noAvatar"
            />
            <div>
              <h5>
                {userData.name}
                {userData.isKing && (
                  <FontAwesomeIcon
                    className="text-warning mx-1"
                    icon={faCrown}
                  />
                )}
              </h5>
              <span style={{ wordBreak: "break-all" }}>{userData.email}</span>
            </div>
          </div>
          <div className="mt-4 px-2">
            <div className={styles.info}>
              <span>{key("phone")} :</span>
              <div className="d-flex align-items-center flex-wrap">
                <p className={`${isArLang ? "me-2" : "ms-2"} ${styles.number}`}>
                  {userData.phone}
                </p>
                <div className={styles.contacts_icons}>
                  <a
                    href={`tel:${userData.phone}`}
                    className={styles.contact_icon}
                    title={key("call")}
                  >
                    <FontAwesomeIcon icon={faSquarePhone} />
                  </a>
                </div>
              </div>
            </div>

            {userData?._id !== profileInfo?._id ? (
              !userData.isKing && (
                <div
                  className={`${
                    styles.controller_div
                  } d-flex align-items-center flex-wrap position-relative mt-3 ${
                    isAdminPage
                      ? "justify-content-end"
                      : "justify-content-between"
                  }`}
                >
                  <ButtonOne
                    text={key("delete")}
                    classes="bg-danger m-2"
                    borderd={true}
                    onClick={showDeleteModalHandler}
                  />

                  {!isAdminPage && (
                    <ButtonOne
                      text={!isIdExist ? key("select") : key("exclude")}
                      classes="bg-navy m-2"
                      borderd={true}
                      onClick={selectHandler}
                    />
                  )}
                </div>
              )
            ) : (
              <div
                className={`${styles.controller_div} d-flex justify-content-end align-items-center position-relative mt-3`}
              >
                <ButtonOne
                  text={key("ediet")}
                  classes="bg-navy m-2"
                  borderd={true}
                  onClick={navigateToAdminPage}
                />
              </div>
            )}
          </div>
        </div>
      </Col>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={hideDeleteModalHandler}
          confirmFun={deletePack}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
      {showDetailsModal && (
        <MainModal
          show={showDetailsModal}
          onHide={hideDetailsModalHandler}
          cancelBtn={key("cancel")}
          modalSize="xl"
        >
          <div className={isArLang ? "text-end" : "text-start"}>
            <UserDetailsBlock profileInfo={userData} isProfile={false} />
          </div>
        </MainModal>
      )}
    </>
  );
};

export default UserItem;
