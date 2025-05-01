import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import {
  formattedDate,
  handleDownloadExcelSheet,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import MainModal from "../../../Components/UI/Modals/MainModal";
import ContractDetails from "./ContractDetails";
import { useSelector } from "react-redux";
import { CheckMySubscriptions } from "../../../shared/components";

const CompoundContracts = ({ compoundEstates }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contractDetails, setContractDetails] = useState({});

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";
  const token = useSelector((state) => state.userInfo.token);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const { compId } = useParams();
  const navigate = useNavigate();

  const { data: contractsData, isFetching } = useQuery({
    queryKey: ["compContracts", compId, token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: `compounds/${compId}/current-contracts`,
        token: token,
        isLimited: true,
      }),
    enabled: compId && !!token,
    staleTime: Infinity,
  });

  const getStatusBgColor = useCallback((status) => {
    switch (status) {
      case "active":
        return styles.green;
      case "pending":
        return styles.orange;
      case "canceled":
        return styles.red;
      case "upcoming":
        return styles.yellow;
      default:
        return "";
    }
  }, []);

  const findTenant = useCallback(
    (tenantId) => {
      return contractsData?.data?.tenants.find(
        (tenant) => tenant._id === tenantId
      );
    },
    [contractsData]
  );

  const getEstateName = useCallback(
    (estateId) => {
      return (
        compoundEstates?.find((estate) => estate._id === estateId)?.name || "-"
      );
    },
    [compoundEstates]
  );

  const filteredContractsList = useMemo(() => {
    return contractsData && Array.isArray(contractsData?.data?.contracts)
      ? contractsData?.data?.contracts?.map((contract) => {
          return {
            [key("theUnit")]: getEstateName(contract?.estate) || "-",
            [key("theTenant")]: findTenant(contract.tenant)?.name || "-",
            [key("startContract")]: formattedDate(contract?.startDate) || "-",
            [key("endContract")]: formattedDate(contract?.endDate) || "-",
            [`${key("price")} ${key("sarSmall")}`]:
              contract?.totalAmount || "-",
            [key("status")]:
              renamedContractStatus(contract?.status, currentLang) || "-",
          };
        })
      : [];
  }, [contractsData, key, getEstateName, findTenant, currentLang]);

  const exportCsvHandler = useCallback(() => {
    handleDownloadExcelSheet(
      filteredContractsList,
      "CurrentContracts.xlsx",
      "CurrentContracts",
      accountInfo?.account?.isFilesExtractAllowed
    );
  }, [filteredContractsList, accountInfo]);

  return (
    <div className={styles.contracts_body}>
      <div className={styles.header}>
        <h4>{key("currentContracts")}</h4>
        {contractsData && contractsData?.data?.contracts?.length > 0 && (
          <div>
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
          </div>
        )}
      </div>

      <div className={styles.contract_content}>
        <div className="my-4">
          {contractsData || !isFetching ? (
            contractsData.data?.contracts?.length > 0 ? (
              <div className="scrollableTable">
                <table className={`${styles.contract_table} table`}>
                  <thead className={styles.table_head}>
                    <tr>
                      <th>{key("theUnit")}</th>
                      <th>{key("theTenant")}</th>
                      <th>{key("startContract")}</th>
                      <th>{key("endContract")}</th>
                      <th>{key("price")}</th>
                      <th>{key("status")}</th>
                      <th>{key("actions")}</th>
                    </tr>
                  </thead>

                  <tbody className={styles.table_body}>
                    {contractsData.data?.contracts.map((contract) => (
                      <tr key={contract._id}>
                        <td>{getEstateName(contract?.estate)}</td>
                        <td>{findTenant(contract?.tenant)?.name}</td>
                        <td>{formattedDate(contract?.startDate)}</td>
                        <td>{formattedDate(contract?.endDate)}</td>
                        <td>{contract?.totalAmount}</td>
                        <td>
                          <span
                            className={`${getStatusBgColor(contract?.status)} ${
                              styles.status_span
                            }`}
                          >
                            {renamedContractStatus(
                              contract?.status,
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
                              <Dropdown.Item
                                onClick={() =>
                                  navigate(
                                    `/estate-unit-details/${contract.estate}`
                                  )
                                }
                                className="text-center"
                              >
                                {key("view")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  setContractDetails(contract);
                                  setShowDetailsModal(true);
                                }}
                                className="text-center"
                              >
                                {key("details")}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <NoData text={key("noCurrentContracts")} smallSize={true} />
            )
          ) : (
            <LoadingOne />
          )}
        </div>
      </div>

      {showDetailsModal && (
        <MainModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          cancelBtn={key("cancel")}
          okBtn={key("download")}
          // confirmFun={deleteRevenue}
          title={key("contractDetails")}
          modalSize={"lg"}
        >
          <ContractDetails contract={contractDetails} findTenant={findTenant} />
        </MainModal>
      )}
    </div>
  );
};

export default CompoundContracts;
