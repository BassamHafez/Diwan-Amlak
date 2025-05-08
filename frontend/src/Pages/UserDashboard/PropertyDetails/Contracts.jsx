import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import { contractStatusOptions } from "../../../Components/Logic/StaticLists";
import { useCallback, useMemo, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddNewContract from "../PropertyForms/AddNewContract";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { useParams } from "react-router-dom";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import {
  formattedDate,
  generatePDF,
  handleDownloadExcelSheet,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import MainModal from "../../../Components/UI/Modals/MainModal";
import UpdateContract from "../PropertyForms/UpdateContract";
import PrintContract from "../../../Components/Prints/PrintContract";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import ExtendContract from "../PropertyForms/ExtendContract";
import SettleContract from "../PropertyForms/SettleContract";
import useDeleteItem from "../../../hooks/useDeleteItem";
import { useSelector } from "react-redux";
import { CheckMySubscriptions } from "../../../shared/components";

const Contracts = ({ details, estateParentCompound, refetchDetails }) => {
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [showUpdateContractModal, setShowUpdateContractModal] = useState(false);
  const [showExtendContractModal, setShowExtendContractModal] = useState(false);
  const [showSettleContractModal, setShowSettleContractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contractDetails, setContractDetails] = useState({});
  const [contractId, setContractId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const deleteItem = useDeleteItem();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const { propId } = useParams();
  const currentLang = isArLang ? "ar" : "en";
  const queryClient = useQueryClient();

  const {
    data: contractsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["contracts", propId, token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: `estates/${propId}/contracts`,
        token: token,
        isLimited: true,
      }),
    enabled: !!propId && !!token,
    staleTime: Infinity,
  });

  const getStatusBgColor = useCallback((status) => {
    switch (status) {
      case "active":
        return styles.green;
      case "completed":
        return styles.blue;
      case "canceled":
        return styles.red;
      case "upcoming":
        return styles.yellow;
      default:
        return "";
    }
  }, []);

  const deleteContract = async () => {
    const formData = {
      itemId: contractId,
      endPoint: `estates/${propId}/contracts`,
      refetch,
      refetchDetails,
      hideModal: setShowDeleteModal(false),
    };
    await deleteItem(formData);
    queryClient.invalidateQueries(["estates", token]);
    queryClient.invalidateQueries(["compounds", token]);
  };

  const filterChangeHandler = (val, type) => {
    if (type === "status") {
      setStatusFilter(val ? val : "");
    }
  };

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filteredContracts = useMemo(() => {
    return contractsData && Array.isArray(contractsData.data)
      ? contractsData.data.filter(
          (contract) =>
            (statusFilter === "" || contract.status === statusFilter) &&
            contract.tenant?.name
              .toLowerCase()
              .includes(searchFilter.toLocaleLowerCase())
        )
      : [];
  }, [contractsData, statusFilter, searchFilter]);

  const filteredContractsList = useMemo(() => {
    const getLandlordName = (compound, details) => {
      if (compound?.broker || details?.broker) return "-";
      return compound?.landlord?.name || details?.landlord?.name || "-";
    };
    const contractsList = [...(contractsData?.data || [])];
    return contractsList?.map((contract) => {
      const tenant = contract?.tenant || {};
      const brokerName =
        estateParentCompound?.broker?.name || details?.broker?.name || "-";
      const landlordName = getLandlordName(estateParentCompound, details);

      return {
        [key("theUnit")]: details?.name || "-",
        [key("estate")]: estateParentCompound?.name || key("noCompound"),
        [key("theTenant")]: tenant.name || "-",
        [key("phone")]: tenant.phone || "-",
        [key("startContract")]: formattedDate(contract?.startDate) || "-",
        [key("endContract")]: formattedDate(contract?.endDate) || "-",
        [`${key("price")} ${key("sarSmall")}`]: contract?.totalAmount || "-",
        [key("status")]:
          renamedContractStatus(contract?.status, currentLang) || "-",
        [key("agent")]: brokerName,
        [key("theLandlord")]: landlordName,
      };
    });
  }, [contractsData, details, estateParentCompound, key, currentLang]);

  const exportCsvHandler = useCallback(() => {
    handleDownloadExcelSheet(
      filteredContractsList,
      `${key("contracts")}_${details?.name} ${
        estateParentCompound ? `_(${estateParentCompound?.name})` : ""
      }.xlsx`,
      key("contracts"),
      accountInfo?.account?.isFilesExtractAllowed
    );
  }, [filteredContractsList, accountInfo, details, estateParentCompound, key]);

  const showContractModalHandler = useCallback(() => {
    setShowAddContractModal(true);
  }, []);

  const hideContractModalHandler = useCallback(() => {
    setShowAddContractModal(false);
  }, []);

  const hideSettleContractModalHandler = useCallback(() => {
    setShowSettleContractModal(false);
  }, []);

  const hideUpdateContractModalHandler = useCallback(() => {
    setShowUpdateContractModal(false);
  }, []);

  const hideExtendContractModalHandler = useCallback(() => {
    setShowExtendContractModal(false);
  }, []);

  const hideDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const hideDetailsModalHandler = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  return (
    <>
      <div className={styles.contracts_body}>
        <div className={styles.header}>
          <h4>{key("contracts")}</h4>
          <div>
            {filteredContractsList && filteredContractsList?.length > 0 && (
              <CheckMySubscriptions
                name="isFilesExtractAllowed"
                accountInfo={accountInfo}
              >
                <ButtonOne
                  classes="m-2"
                  borderd
                  color="white"
                  text={key("exportCsv")}
                  onClick={exportCsvHandler}
                />
              </CheckMySubscriptions>
            )}
            <CheckPermissions
              profileInfo={profileInfo}
              btnActions={["ADD_CONTRACT"]}
            >
              <ButtonOne
                onClick={showContractModalHandler}
                classes="m-2 bg-navy"
                borderd
                text={key("addContracts")}
              />
            </CheckPermissions>
          </div>
        </div>

        <div className={styles.contract_content}>
          <div className={styles.content_header}>
            <div className={styles.search_field}>
              <SearchField onSearch={onSearch} text={key("searchContract")} />
            </div>
            <Select
              options={contractStatusOptions[currentLang]}
              onChange={(val) =>
                filterChangeHandler(val ? val.value : null, "status")
              }
              className={`${isArLang ? "text-end me-2" : "text-start ms-2"} ${
                styles.select_type
              } my-3`}
              isRtl={isArLang ? true : false}
              placeholder={key("contractStaus")}
              isClearable
            />
          </div>

          <div className="my-4">
            {contractsData || !isFetching ? (
              contractsData?.data?.length > 0 ? (
                <div className="scrollableTable">
                  <table className={`${styles.contract_table} table`}>
                    <thead className={styles.table_head}>
                      <tr>
                        <th>{key("tenant")}</th>
                        <th>{key("startContract")}</th>
                        <th>{key("endContract")}</th>
                        <th>{key("price")}</th>
                        <th>{key("status")}</th>
                        <th>{key("actions")}</th>
                      </tr>
                    </thead>

                    <tbody className={styles.table_body}>
                      {filteredContracts.map((contract) => (
                        <tr key={contract._id}>
                          <td>{contract.tenant?.name}</td>
                          <td>{formattedDate(contract.startDate)}</td>
                          <td>{formattedDate(contract.endDate)}</td>
                          <td>{contract.totalAmount}</td>
                          <td>
                            <span
                              className={`${getStatusBgColor(
                                contract.status
                              )} ${styles.status_span}`}
                            >
                              {renamedContractStatus(
                                contract.status,
                                currentLang
                              )}
                            </span>
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle
                                id="dropdown-basic"
                                className={styles.dropdown_menu}
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                {contract.status !== "completed" &&
                                  contract.status !== "canceled" && (
                                    <>
                                      <CheckPermissions
                                        profileInfo={profileInfo}
                                        btnActions={["UPDATE_CONTRACT"]}
                                      >
                                        <Dropdown.Item
                                          onClick={() => {
                                            setContractDetails(contract);
                                            setShowUpdateContractModal(true);
                                          }}
                                          className="text-center"
                                        >
                                          {key("ediet")}
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={() => {
                                            setContractDetails(contract);
                                            setShowExtendContractModal(true);
                                          }}
                                          className="text-center"
                                        >
                                          {key("extendContract")}
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={() => {
                                            setContractDetails(contract);
                                            setShowSettleContractModal(true);
                                          }}
                                          className="text-center"
                                        >
                                          {key("contractSettlement")}
                                        </Dropdown.Item>
                                      </CheckPermissions>

                                      <CheckPermissions
                                        profileInfo={profileInfo}
                                        btnActions={["CANCEL_CONTRACT"]}
                                      >
                                        <Dropdown.Item
                                          onClick={() => {
                                            setContractId(contract._id);
                                            setShowDeleteModal(true);
                                          }}
                                          className="text-center"
                                        >
                                          {key("cancel")}
                                        </Dropdown.Item>
                                      </CheckPermissions>
                                    </>
                                  )}
                                <CheckMySubscriptions
                                  name="isFilesExtractAllowed"
                                  accountInfo={accountInfo}
                                >
                                  <Dropdown.Item
                                    onClick={() => {
                                      setContractDetails(contract);
                                      setShowDetailsModal(true);
                                    }}
                                    className="text-center"
                                  >
                                    {key("details")}
                                  </Dropdown.Item>
                                </CheckMySubscriptions>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <NoData text={key("noContracts")} smallSize={true} />
              )
            ) : (
              <LoadingOne />
            )}
          </div>
        </div>
      </div>

      {showAddContractModal && (
        <ModalForm
          show={showAddContractModal}
          onHide={hideContractModalHandler}
        >
          <AddNewContract
            hideModal={hideContractModalHandler}
            refetch={refetch}
            refetchDetails={refetchDetails}
          />
        </ModalForm>
      )}

      {showSettleContractModal && (
        <ModalForm
          show={showSettleContractModal}
          onHide={hideSettleContractModalHandler}
          modalSize="md"
        >
          <SettleContract
            hideModal={hideSettleContractModalHandler}
            refetch={refetch}
            refetchDetails={refetchDetails}
            contractDetails={contractDetails}
          />
        </ModalForm>
      )}
      {showUpdateContractModal && (
        <ModalForm
          show={showUpdateContractModal}
          onHide={hideUpdateContractModalHandler}
        >
          <UpdateContract
            hideModal={hideUpdateContractModalHandler}
            refetch={refetch}
            contract={contractDetails}
            refetchDetails={refetchDetails}
          />
        </ModalForm>
      )}

      {showExtendContractModal && (
        <ModalForm
          show={showExtendContractModal}
          onHide={hideExtendContractModalHandler}
          modalSize={"lg"}
        >
          <ExtendContract
            hideModal={hideExtendContractModalHandler}
            refetch={refetch}
            refetchDetails={refetchDetails}
            contractDetails={contractDetails}
          />
        </ModalForm>
      )}

      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={hideDeleteModalHandler}
          confirmFun={deleteContract}
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
          okBtn={key("download")}
          confirmFun={() =>
            generatePDF(
              contractDetails?._id,
              `${key("contract")}_${details?.name}${
                estateParentCompound ? `(${estateParentCompound?.name})` : ""
              }_${contractDetails?.tenant?.name}`,
              accountInfo?.account?.isFilesExtractAllowed
            )
          }
          title={key("contractDetails")}
          modalSize={"lg"}
        >
          <PrintContract
            contract={contractDetails}
            estateParentCompound={estateParentCompound}
            details={details}
            id={`${contractDetails._id}`}
          />
        </MainModal>
      )}
    </>
  );
};

export default Contracts;
