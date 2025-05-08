import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import Property from "../../../Components/Property/Property";
import { estateStatus } from "../../../Components/Logic/StaticLists";
import Row from "react-bootstrap/esm/Row";
import NoData from "../../../Components/UI/Blocks/NoData";
import { useCallback, useMemo, useState } from "react";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import CheckAllowedCompounds from "../../../Components/CheckPermissions/CheckAllowedCompounds";
import { useParams } from "react-router-dom";
import { CheckMySubscriptions } from "../../../shared/components";
import { useSelector } from "react-redux";

const CompoundEstates = ({ compoundEstates, showAddEstatesModal }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const { compId } = useParams();
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filteredEstates = useMemo(() => {
    return compoundEstates && Array.isArray(compoundEstates)
      ? compoundEstates.filter((estate) => {
          const normalizedSearchFilter = searchFilter.toLowerCase();
          return (
            (!statusFilter || estate.status === statusFilter) &&
            (estate.name.toLowerCase().includes(normalizedSearchFilter) ||
              estate.unitNumber === Number(normalizedSearchFilter))
          );
        })
      : [];
  }, [compoundEstates, searchFilter, statusFilter]);

  return (
    <>
      <div className={styles.contracts_body}>
        <div className={styles.header}>
          <h4>{key("properties")}</h4>
          <CheckMySubscriptions
            name="allowedEstates"
            type="number"
            accountInfo={accountInfo}
          >
            <CheckPermissions profileInfo={profileInfo} btnActions={["ADD_ESTATE"]}>
              <CheckAllowedCompounds id={compId}>
                <div>
                  <ButtonOne
                    onClick={showAddEstatesModal}
                    classes="m-2 bg-navy"
                    borderd
                    text={key("addEstate")}
                  />
                </div>
              </CheckAllowedCompounds>
            </CheckPermissions>
          </CheckMySubscriptions>
        </div>

        <div
          className={`${styles.contract_content} ${
            filteredEstates?.length > 0 ? styles.estates_content : ""
          }`}
        >
          <div className={styles.content_header}>
            <div className={styles.search_field}>
              <SearchField
                onSearch={onSearch}
                text={key("searchEstateWithUnitNum")}
              />
            </div>
            <Select
              options={isArLang ? estateStatus["ar"] : estateStatus["en"]}
              onChange={(val) => setStatusFilter(val ? val.value : null)}
              className={`${isArLang ? "text-end" : "text-start"} ${
                styles.select_type
              } my-3`}
              isClearable={true}
              isRtl={isArLang ? true : false}
              placeholder={key("status")}
            />
          </div>

          <div className="my-4">
            <Row>
              {filteredEstates?.length > 0 ? (
                filteredEstates?.map((estate) => (
                  <Property
                    key={estate._id}
                    hideStatus={false}
                    hideCompound={false}
                    property={estate}
                    type="estate"
                    isCompoundDetailsPage={true}
                  />
                ))
              ) : (
                <NoData text={key("noEstateUnit")} smallSize={true} />
              )}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompoundEstates;
