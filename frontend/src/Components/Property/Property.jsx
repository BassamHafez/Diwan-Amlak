import styles from "./Property.module.css";
import AOS from "aos";
import {
  calculateRentedPercentage,
  renamedEstateStatus,
} from "../Logic/LogicFun";
import { imgHash } from "../Logic/StaticLists";
import { FontAwesomeIcon } from "../../shared/index";
import { faLocationDot } from "../../shared/constants";
import {
  useSelector,
  useTranslation,
  useNavigate,
  useEffect,
} from "../../shared/hooks";
import { ImgComponent } from "../../shared/components";
import { Col } from "../../shared/bootstrap";

const Property = ({
  property,
  hideStatus,
  hideCompound,
  type,
  isCompoundDetailsPage,
  rentedEstatesCountObj,
}) => {
  const parentCompound = property.compound ? property.compound : property;
  const isTimeExpired = useSelector((state) => state.packageTime.isTimeExpired);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  const navigateToDetails = () => {
    if (type === "estate") {
      navigate(`/estate-unit-details/${property._id}`);
    } else {
      navigate(`/estate-details/${property._id}`);
    }
  };
  useEffect(() => {
    AOS.init({ disable: "mobile" });
  }, []);

  const getStatusBgColor = (status) => {
    switch (status) {
      case "pending":
        return styles.yellow;
      case "available":
        return styles.red;
      case "rented":
        return styles.green;
      default:
        return "";
    }
  };

  const renderCompoundName = (property) => {
    return property.compound
      ? `${property.compound?.name} ${property?.unitNumber || ""}`
      : key("noCompound");
  };

  const renderEstateInfo = (property) => {
    if (property.estatesCount === 0) {
      return key("noEstates");
    }

    const rentedPercentage = calculateRentedPercentage(
      rentedEstatesCountObj?.rentedCount,
      property.estatesCount
    );
    let countNum = isArLang
      ? `${property.estatesCount}/${rentedEstatesCountObj?.rentedCount || 0}`
      : `${rentedEstatesCountObj?.rentedCount || 0}/${property.estatesCount}`;
    return `${key("rented")}: ${countNum} ${key(
      "unit"
    )} (${rentedPercentage}%)`;
  };

  return (
    <>
      <Col
        xxl={4}
        lg={6}
        className="d-flex justify-content-center align-items-center"
      >
        <div
          className={`${styles.property_body} ${
            isTimeExpired === true ? "expired" : ""
          }`}
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div
            className={`${styles.card_img} ${
              !property.image ||
              property.image === "/estates/default-estate.png"
                ? styles.default_estate
                : ""
            }`}
            onClick={navigateToDetails}
          >
            <ImgComponent
              width="22.5rem"
              height="15rem"
              src={`${import.meta.env.VITE_Host}${property?.image}`}
              lazyLoad={true}
              hash={imgHash.defaultImg}
              alt={"propertyImage"}
            />
          </div>

          <div className={styles.card_caption}>
            <h4>{property.name}</h4>
            {!hideStatus && (
              <span
                className={`${styles.status_badge} ${
                  isArLang ? styles.status_badge_ar : styles.status_badge_en
                } ${getStatusBgColor(property.status)}`}
              >
                {isArLang
                  ? renamedEstateStatus(property.status, "ar")
                  : renamedEstateStatus(property.status, "en")}
              </span>
            )}
            {!isCompoundDetailsPage && (
              <div className={styles.caption_header}>
                <span>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className={`${isArLang ? "ms-1" : "me-1"} color-main`}
                  />
                  {parentCompound.region} (
                  <span className="mini_word">{parentCompound.city}</span>)
                </span>
              </div>
            )}

            <p className={styles.desc}>{property.description}</p>

            <div className={isArLang ? "text-start" : "text-end"}>
              <span
                className={`${styles.compound_badge} ${
                  hideCompound ? styles.percent_estate_badge : ""
                }`}
              >
                {isCompoundDetailsPage
                  ? `${key("unitNumber")} ${property.unitNumber}`
                  : hideCompound
                  ? renderEstateInfo(property)
                  : renderCompoundName(property)}
              </span>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default Property;
