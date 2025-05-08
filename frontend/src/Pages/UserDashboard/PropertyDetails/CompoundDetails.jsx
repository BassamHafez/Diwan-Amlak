import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  mainDeleteFunHandler,
  mainFormsHandlerTypeRaw,
} from "../../../util/Http";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import styles from "./PropertyDetails.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import GeneralDetails from "./GeneralDetails";
import { useEffect, useState } from "react";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  calculateRentedPercentage,
  checkAccountFeatures,
  convertNumbersToFixedTwo,
} from "../../../Components/Logic/LogicFun";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import ScrollTopBtn from "../../../Components/UI/Buttons/ScrollTopBtn";
import AddEstate from "../PropertyForms/AddEstate";
import AOS from "aos";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import CheckAllowedCompounds from "../../../Components/CheckPermissions/CheckAllowedCompounds";
import TaskContent from "../Tasks/TaskContent";
import useCompoundAnlaysis from "../../../hooks/useCompoundAnlaysis";
import { CheckMySubscriptions } from "../../../shared/components";

const CompoundDetails = () => {
  const [showAddEstateModal, setShowAddEstateModal] = useState(false);
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const { compId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["singleCompound", compId, token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: `compounds/${compId}`,
        token: token,
      }),
    staleTime: Infinity,
    enabled: compId && !!token,
  });

  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ["compoundTasks", compId, token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: `tasks?compound=${compId}`,
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token && !!accountInfo?.account?.isTasksAllowed,
  });

  const compDetails = data?.data;
  const {
    theCommissionVal,
    commissionPercentage,
    netIncomeVal,
    netReturnsVal,
    collectionRatioVal,
    totalMonthRev,
    totalMonthPaidRev,
    totalEstatesCount,
    rentedEstateCount,
  } = useCompoundAnlaysis(compDetails || {});

  useEffect(() => {
    AOS.init({ disable: "mobile" });
  }, []);

  const deleteCompound = async () => {
    setShowDeleteModal(false);
    if (compId && token) {
      navigate("/properties");
      const res = await mainDeleteFunHandler({
        id: compId,
        token: token,
        type: "compounds",
      });

      if (res.status === 204) {
        queryClient.invalidateQueries(["compounds", token]);
        notifySuccess(key("deletedSucc"));
      } else if (
        res.response?.data?.message ===
        "Please delete all estates in this compound first"
      ) {
        notifyError(key("deleteEstatesFirst"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const checkIsAllowed = () => {
    const isAllowed = checkAccountFeatures(
      accountInfo?.account,
      "allowedEstates"
    );
    if (!isAllowed) {
      notifyError(key("featureEnded"));
      return;
    }
    setShowAddEstateModal(true);
  };

  return (
    <>
      <ScrollTopBtn />
      <div className="height_container">
        {isFetching ? (
          <LoadingOne />
        ) : data ? (
          <div className={styles.detials_content}>
            <header className={`${styles.header} pt-3 pb-4`}>
              <Row>
                <div
                  className="d-flex justify-content-between align-items-center"
                  data-aos="fade-in"
                  data-aos-duration="1000"
                >
                  <h3 className="my-4 mx-1">{compDetails?.compound?.name}</h3>
                  <div className="d-flex align-items-center justify-content-center flex-wrap">
                    <CheckPermissions
                      profileInfo={profileInfo}
                      btnActions={["DELETE_COMPOUND"]}
                    >
                      <CheckAllowedCompounds id={compId}>
                        <div
                          className={`${styles.controller_btn} ${styles.delete_btn}`}
                          onClick={() => setShowDeleteModal(true)}
                          title={key("delete")}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                      </CheckAllowedCompounds>
                    </CheckPermissions>

                    <CheckMySubscriptions
                      name="allowedEstates"
                      type="number"
                      accountInfo={accountInfo}
                    >
                      <CheckPermissions
                        profileInfo={profileInfo}
                        btnActions={["ADD_ESTATE"]}
                      >
                        <CheckAllowedCompounds id={compId}>
                          <div
                            className={styles.bookmarked}
                            onClick={checkIsAllowed}
                            title={key("addEstate")}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </div>
                        </CheckAllowedCompounds>
                      </CheckPermissions>
                    </CheckMySubscriptions>
                  </div>
                </div>

                <Col
                  md={6}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div
                    className={styles.estate_img}
                    data-aos="fade-in"
                    data-aos-duration="1000"
                  >
                    <img
                      src={`${import.meta.env.VITE_Host}${
                        compDetails?.compound?.image
                      }`}
                      alt="estate_img"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div
                    className={styles.estate_main_details}
                    data-aos="fade-in"
                    data-aos-duration="1000"
                  >
                    <Row
                      className={`${styles.estate_main_details_row} g-4 justify-content-evenly`}
                    >
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("totalProperties")}</span>
                          <p>{totalEstatesCount}</p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("rentedEstates")}</span>
                          <p>{rentedEstateCount}</p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("totalRentedEstate")}</span>
                          <p>
                            {calculateRentedPercentage(
                              rentedEstateCount,
                              compDetails?.estates?.length
                            )}
                            %
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>
                            {key("collectionRatio")} {key("forEstates")}
                          </span>
                          <p>{collectionRatioVal} %</p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("theCommission")}</span>
                          <p>
                            {convertNumbersToFixedTwo(theCommissionVal)}{" "}
                            {key("sarSmall")}
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span
                            className={
                              netReturnsVal < 0 ? "text-danger" : "text-success"
                            }
                          >
                            {key("netIncome")} {key("forEstates")}
                          </span>
                          <p>
                            {netIncomeVal} {key("sarSmall")}
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("operatingRatio")}</span>
                          <p>
                            {convertNumbersToFixedTwo(commissionPercentage)}%
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span
                            className={
                              netReturnsVal < 0 ? "text-danger" : "text-success"
                            }
                          >
                            {key("netReturns")} {key("forEstates")}
                          </span>
                          <p>{netReturnsVal} %</p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("collectionCurrentMonth")}</span>
                          <p>
                            {convertNumbersToFixedTwo(
                              (totalMonthPaidRev / totalMonthRev) * 100
                            )}
                            %
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </header>
            <section className={styles.tabs_section}>
              <Tabs defaultActiveKey="general" className="my-3" fill>
                <Tab eventKey="general" title={key("general")}>
                  <GeneralDetails
                    isCompound={true}
                    details={compDetails?.compound}
                    compoundEstates={compDetails?.estates}
                    showAddEstatesModal={checkIsAllowed}
                    refetch={refetch}
                  />
                </Tab>

                <Tab eventKey="tasks" title={key("tasks")}>
                  <div className="p-md-3">
                    <TaskContent
                      timeFilter="all"
                      tagsFilter="all"
                      typesFilter="all"
                      tasks={tasks}
                      refetch={refetchTasks}
                      compId={compId}
                      accountInfo={accountInfo}
                      isTasksAllowed={accountInfo?.account?.isTasksAllowed}
                    />
                  </div>
                </Tab>
              </Tabs>
            </section>
          </div>
        ) : (
          <NoData text={key("noDetails")} />
        )}
      </div>

      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteCompound}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}

      {showAddEstateModal && (
        <ModalForm
          show={showAddEstateModal}
          onHide={() => setShowAddEstateModal(false)}
        >
          <AddEstate
            hideModal={() => setShowAddEstateModal(false)}
            refetch={refetch}
            compId={compId}
          />
        </ModalForm>
      )}
    </>
  );
};

export default CompoundDetails;
