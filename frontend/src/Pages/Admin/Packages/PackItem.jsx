import { useTranslation } from "react-i18next";
import styles from "../Admin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Col from "react-bootstrap/esm/Col";
import {
  faCircleCheck,
  faLanguage,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import Accordion from "react-bootstrap/Accordion";
import AccordionContent from "../../../Components/UI/Tools/AccordionContent";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useCallback, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import MainModal from "../../../Components/UI/Modals/MainModal";
import UpdatePackages from "./PackagesForm/UpdatePackages";
import useDeleteItem from "../../../hooks/useDeleteItem";

const PackItem = ({ pack, type, refetch }) => {
  const [showUpdatePackModal, setShowUpdatePackModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteItem=useDeleteItem();

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const iconClass = isArLang ? "ms-2" : "me-2";

  const deletePack = async () => {
    setShowDeleteModal(false);
    const formData = {
      itemId: pack?._id,
      endPoint: `packages`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    deleteItem(formData);
  };

  const hideUpdateModalHandler = useCallback(() => {
    setShowUpdatePackModal(false);
  }, []);

  const showUpdateModalHandler = useCallback(() => {
    setShowUpdatePackModal(true);
  }, []);

  const hideDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const showDeleteModalHandler = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  return (
    <>
      <Col xl={4} md={6}>
        <div className={styles.item}>
          {!pack.isBestOffer && !pack.isMostPopular ? null : (
            <div
              className={`${styles.badge} ${
                pack.isBestOffer
                  ? styles.main_bg
                  : pack.isMostPopular && styles.offer
              } ${isArLang ? "me-auto" : "ms-auto"}`}
            >
              <span>
                {pack.isMostPopular
                  ? key("mostPopular")
                  : pack.isBestOffer && key("deal")}
              </span>
            </div>
          )}
          <h5
            className={`${
              !pack.isBestOffer && !pack.isMostPopular ? "my-4" : "mb-4"
            }`}
          >
            {isArLang ? pack.arTitle : pack.enTitle}
          </h5>
          <div className="mb-4">
            <Accordion>
              <AccordionContent title={key("details")} eventKey="0">
                <ul className={styles.details_list}>
                  <li>
                    <span>
                      <FontAwesomeIcon
                        className={iconClass}
                        icon={faLanguage}
                      />
                      {key("arTitle")}
                    </span>
                    <span>{pack.arTitle}</span>
                  </li>
                  <li>
                    <span>
                      <FontAwesomeIcon
                        className={iconClass}
                        icon={faLanguage}
                      />
                      {key("enTitle")}
                    </span>
                    <span>{pack.enTitle}</span>
                  </li>
                  <li>
                    <span>
                      <FontAwesomeIcon
                        className={iconClass}
                        icon={faLanguage}
                      />
                      {key("duration")}
                    </span>
                    <span>
                      {pack.duration}{" "}
                      {pack.duration === 1 ? key("month") : key("singleMonths")}
                    </span>
                  </li>
                  <li>
                    <span>
                      <FontAwesomeIcon
                        className={`${iconClass} text-success`}
                        icon={faMoneyBill}
                      />
                      {key("oldPrice")}
                    </span>
                    <span>
                      {pack.originalPrice || 0} {key("sar")}
                    </span>
                  </li>
                  <li>
                    <span>
                      <FontAwesomeIcon
                        className={`${iconClass} text-success`}
                        icon={faMoneyBill}
                      />
                      {key("newPrice")}
                    </span>
                    <span>
                      {pack.price || 0} {key("sar")}
                    </span>
                  </li>
                </ul>
              </AccordionContent>
            </Accordion>
          </div>

          <div className={styles.features}>
            <Accordion>
              <AccordionContent title={key("features")} eventKey="0">
                <ul className={styles.features_list}>
                  {pack?.features?.map((feature, index) => {
                    const isValidValue =
                      feature.value === "true" ||
                      (!isNaN(Number(feature.value)) &&
                        Number(feature.value) > 0);

                    return isValidValue ? (
                      <li key={`${feature.label}_${index}`}>
                        <FontAwesomeIcon
                          className={iconClass}
                          icon={faCircleCheck}
                        />
                        {key(feature.label)}{" "}
                        {feature.value === "true" ? "" : `(${feature.value})`}
                      </li>
                    ) : type === "custom" ? (
                      <li key={`${feature.label}_${index}`}>
                        <FontAwesomeIcon
                          className={iconClass}
                          icon={faCircleCheck}
                        />
                        {key(feature.label)}
                      </li>
                    ) : null;
                  })}
                </ul>
              </AccordionContent>
            </Accordion>
          </div>
          <div className="mt-3 d-flex justify-content-center text-center flex-wrap position-relative">
            <ButtonOne
              onClick={showDeleteModalHandler}
              classes="bg-danger m-2"
              borderd={true}
              text={key("delete")}
            />

            <ButtonOne
              onClick={showUpdateModalHandler}
              classes="bg-navy m-2"
              borderd={true}
              text={key("update")}
            />
          </div>
        </div>
      </Col>
      {showUpdatePackModal && (
        <ModalForm
          show={showUpdatePackModal}
          onHide={hideUpdateModalHandler}
          modalSize="lg"
        >
          <UpdatePackages
            hideModal={hideUpdateModalHandler}
            refetch={refetch}
            pack={pack}
          />
        </ModalForm>
      )}

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
    </>
  );
};

export default PackItem;
