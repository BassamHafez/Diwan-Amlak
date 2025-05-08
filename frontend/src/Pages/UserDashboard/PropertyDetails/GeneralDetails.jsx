import styles from "./PropertyDetails.module.css";
import Contracts from "./Contracts";
import Revenue from "./Revenue";
import CompoundEstates from "./CompoundEstates";
import UpdateCompound from "../PropertyForms/UpdateCompound";
import UpdateEstate from "../PropertyForms/UpdateEstate";
import AOS from "aos";
import CurrentContract from "./CurrentContract";
import CompoundContracts from "./CompoundContracts";
import Expenses from "./Expenses";
import { memo } from "react";
import {
  CheckAllowedCompounds,
  CheckPermissions,
  ModalForm,
  ButtonOne,
} from "../../../shared/components";
import {
  faBuilding,
  faBolt,
  faBuildingUser,
  faCaretDown,
  faCoins,
  faDroplet,
  faEarthAsia,
  faLocationDot,
  faMapLocationDot,
  faSignature,
  faStreetView,
  faUserTie,
  faWrench,
} from "../../../shared/constants";
import { propDetailsImage, propDetailsImage2 } from "../../../shared/images";
import {
  useCallback,
  useEffect,
  useState,
  useSelector,
  useTranslation,
} from "../../../shared/hooks";
import { Row, Col } from "../../../shared/bootstrap";
import { FontAwesomeIcon } from "../../../shared/index";

const GeneralDetails = memo(
  ({
    details,
    estateParentCompound,
    isCompound,
    compoundEstates,
    showAddEstatesModal,
    refetch,
  }) => {
    const parentCompound =
      !isCompound && estateParentCompound ? estateParentCompound : details;
    const [showUpdateDetailsModal, setShowAUpdateDetailsModal] =
      useState(false);
    const profileInfo = useSelector((state) => state.profileInfo.data);
    const { t: key } = useTranslation();
    let isArLang = localStorage.getItem("i18nextLng") === "ar";
    useEffect(() => {
      AOS.init({ disable: "mobile" });
    }, []);

    const showUpdateDetailsModalHandler = useCallback(() => {
      setShowAUpdateDetailsModal(true);
    }, []);

    const hideUpdateDetailsModalHandler = useCallback(() => {
      setShowAUpdateDetailsModal(false);
    }, []);

    return (
      <>
        <div className={styles.general_div}>
          <div
            data-aos="fade-in"
            data-aos-duration="1000"
            className={`${isArLang ? "text-start" : "text-end"} my-4`}
          >
            <CheckPermissions
              profileInfo={profileInfo}
              btnActions={isCompound ? ["UPDATE_COMPOUND"] : ["UPDATE_ESTATE"]}
            >
              <CheckAllowedCompounds id={isCompound ? details._id : "estate"}>
                <ButtonOne
                  onClick={showUpdateDetailsModalHandler}
                  classes="bg-navy"
                  borderd={true}
                >
                  {key("ediet")}
                  <FontAwesomeIcon
                    className={`${isArLang ? "me-1" : "ms-1"}`}
                    icon={faWrench}
                  />
                </ButtonOne>
              </CheckAllowedCompounds>
            </CheckPermissions>
          </div>
          <Row>
            <Col md={6}>
              <div
                className={styles.information}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div className="text-center">
                  <h6 className="m-0 fw-bold">
                    {isCompound ? key("propDetails") : key("unitDetails")}
                  </h6>
                  <FontAwesomeIcon className="color-main" icon={faCaretDown} />
                </div>

                <ul className={styles.info_list}>
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${
                          isArLang ? "ms-2" : "me-2"
                        } text-danger-emphasis`}
                        icon={faSignature}
                      />
                      {isCompound ? key("estate") : key("theUnit")}
                    </span>
                    <span className={styles.data}>{details.name}</span>
                  </li>
                  {!isCompound && estateParentCompound && (
                    <li>
                      <span className={styles.title}>
                        <FontAwesomeIcon
                          className={`${isArLang ? "ms-2" : "me-2"}`}
                          icon={faBuilding}
                        />
                        {key("estate")}
                      </span>
                      <span className={styles.data}>
                        {estateParentCompound?.name || key("noCompound")}
                      </span>
                    </li>
                  )}
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${isArLang ? "ms-2" : "me-2"} text-primary`}
                        icon={faLocationDot}
                      />
                      {key("address")}
                    </span>
                    <span className={styles.data}>
                      {details.address ? details.address : key("notSpecified")}
                    </span>
                  </li>
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${isArLang ? "ms-2" : "me-2"} text-info`}
                        icon={faEarthAsia}
                      />
                      {key("region")}
                    </span>
                    <span className={styles.data}>{parentCompound.region}</span>
                  </li>
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${isArLang ? "ms-2" : "me-2"} text-danger`}
                        icon={faMapLocationDot}
                      />
                      {key("city")}
                    </span>
                    <span className={styles.data}>{parentCompound?.city}</span>
                  </li>
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${
                          isArLang ? "ms-2" : "me-2"
                        } text-warning-emphasis`}
                        icon={faStreetView}
                      />
                      {key("district")}
                    </span>
                    <span className={styles.data}>
                      {details.neighborhood &&
                      details.neighborhood !== "not specified"
                        ? parentCompound?.neighborhood
                        : key("notSpecified")}
                    </span>
                  </li>
                </ul>
              </div>

              <div
                className={styles.information}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div className="text-center">
                  <h6 className="m-0  fw-bold">
                    {isCompound ? key("contacts") : key("addInfo")}
                  </h6>
                  <FontAwesomeIcon className="color-main" icon={faCaretDown} />
                </div>
                <ul className={styles.info_list}>
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${
                          isArLang ? "ms-2" : "me-2"
                        } text-primary-emphasis`}
                        icon={faUserTie}
                      />
                      {key("theLandlord")}
                    </span>
                    <span className={styles.data}>
                      {parentCompound?.landlord?.name || "-"}
                    </span>
                  </li>
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${
                          isArLang ? "ms-2" : "me-2"
                        } text-primary-emphasis`}
                        icon={faBuildingUser}
                      />
                      {key("agent")}
                    </span>
                    <span className={styles.data}>
                      {parentCompound?.broker?.name || "-"}
                    </span>
                  </li>
                  {details.price ? (
                    <li>
                      <span className={styles.title}>
                        <FontAwesomeIcon
                          className={`${
                            isArLang ? "ms-2" : "me-2"
                          } text-warning`}
                          icon={faCoins}
                        />
                        {key("unitPrice")}
                      </span>
                      <span className={styles.data}>
                        {details.price} {key("sar")}
                      </span>
                    </li>
                  ) : (
                    <>
                      <hr />
                      <div className="text-center">
                        <h6 className="m-0 fw-bold">{key("utilityAcc")}</h6>
                        <FontAwesomeIcon
                          className="color-main"
                          icon={faCaretDown}
                        />
                      </div>
                    </>
                  )}
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${isArLang ? "ms-2" : "me-2"} text-warning`}
                        icon={faBolt}
                      />
                      {key("elecAccount")}
                    </span>
                    <span className={styles.data}>
                      {details.electricityAccountNumber || 0}
                    </span>
                  </li>
                  <li>
                    <span className={styles.title}>
                      <FontAwesomeIcon
                        className={`${isArLang ? "ms-2" : "me-2"} text-primary`}
                        icon={faDroplet}
                      />
                      {key("waterAccount")}
                    </span>
                    <span className={styles.data}>
                      {details.waterAccountNumber || 0}
                    </span>
                  </li>
                </ul>
              </div>
            </Col>

            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.prop_details_img}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <img
                  className="w-100"
                  src={propDetailsImage2}
                  alt="propDetailsImage2"
                />
              </div>
            </Col>
          </Row>

          <Row className="mt-5 py-5">
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.prop_details_img}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <img
                  className="w-100"
                  src={propDetailsImage}
                  alt="propDetailsImage"
                />
              </div>
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center">
              <div
                className={styles.information}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div className="text-center mb-1">
                  <h6 className="m-0 fw-bold">{key("description")}</h6>
                  <FontAwesomeIcon className="color-main" icon={faCaretDown} />
                </div>
                <div className={styles.desc_content}>
                  <p className="m-0">{details.description}</p>
                </div>
              </div>
              <div
                className={styles.information}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div className="text-center mb-2">
                  <h6 className="m-0 fw-bold">{key("searchKeys")}</h6>
                  <FontAwesomeIcon className="color-main" icon={faCaretDown} />
                </div>
                <Row>
                  {details?.tags?.length > 0 ? (
                    details?.tags.map((tag, index) => (
                      <Col key={`${tag}_${index}`} sm={3}>
                        <div className={styles.tag}>
                          <span>{tag}</span>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <div className="text-center">
                      <span className="text-secondary">{key("noTags")}</span>
                    </div>
                  )}
                </Row>
              </div>
            </Col>
          </Row>

          {isCompound ? (
            <>
              <CompoundEstates
                compoundEstates={compoundEstates}
                showAddEstatesModal={showAddEstatesModal}
              />
              <CompoundContracts compoundEstates={compoundEstates} />
            </>
          ) : (
            <>
              <CurrentContract
                details={details}
                estateParentCompound={estateParentCompound}
                refetchDetails={refetch}
              />
              <Contracts
                details={details}
                estateParentCompound={estateParentCompound}
                refetchDetails={refetch}
              />
              <Revenue
                refetchDetails={refetch}
                estateParentCompound={estateParentCompound}
                details={details}
              />
            </>
          )}

          <Expenses
            isCompound={isCompound}
            refetchDetails={refetch}
            estateParentCompound={estateParentCompound}
            details={details}
          />
        </div>

        {showUpdateDetailsModal && (
          <ModalForm
            show={showUpdateDetailsModal}
            onHide={hideUpdateDetailsModalHandler}
          >
            {isCompound ? (
              <UpdateCompound
                hideModal={hideUpdateDetailsModalHandler}
                refetch={refetch}
                compoundData={details}
              />
            ) : (
              <UpdateEstate
                hideModal={hideUpdateDetailsModalHandler}
                refetch={refetch}
                estateData={details}
                estateParentCompound={estateParentCompound}
              />
            )}
          </ModalForm>
        )}
      </>
    );
  }
);

GeneralDetails.displayName = "GeneralDetails";
export default GeneralDetails;
