import styles from "../Admin.module.css";
import AccountFeatures from "./AccountFeatures";
import {
  useTranslation,
  useState,
  useDeleteItem,
  useCallback,
} from "../../../shared/hooks";
import {
  MainModal,
  ButtonOne,
  AccordionContent,
} from "../../../shared/components";
import { Accordion, Col } from "../../../shared/bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const AccountItem = ({ acc, refetch }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteItem = useDeleteItem();
  const { t: key } = useTranslation();

  const deleteAccount = async () => {
    setShowDeleteModal(false);
    const formData = {
      itemId: acc?._id,
      endPoint: `accounts`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    deleteItem(formData);
  };

  const displayValue = useCallback((value) => value || key("notExist"), [key]);

  const DetailsList = ({ items }) => (
    <ul className={styles.details_list}>
      {items?.map(([label, value], index) => (
        <li key={index}>
          <span>{key(label)}</span>
          <span>{displayValue(value)}</span>
        </li>
      ))}
    </ul>
  );

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
          <h5 className="mb-3">
            {acc.isVIP && (
              <FontAwesomeIcon className="text-warning" icon={faCrown} />
            )}{" "}
            {acc.name}{" "}
          </h5>

          <div className="mb-4">
            <Accordion>
              <AccordionContent title={key("officeInfo")} eventKey="0">
                <ul className={styles.details_list}>
                  <DetailsList
                    items={[
                      ["name", acc?.name],
                      ["phone", acc?.phone],
                      ["region", acc?.region],
                      ["city", acc?.city],
                      ["address", acc?.address],
                      ["taxNumber", acc?.taxNumber],
                      ["commercialRecord", acc?.commercialRecord],
                      ["accountID", acc?._id],
                    ]}
                  />
                </ul>
              </AccordionContent>
            </Accordion>
          </div>

          <div className={`${styles.features} mb-4`}>
            <Accordion>
              <AccordionContent title={key("features")} eventKey="1">
                <AccountFeatures account={acc} />
              </AccordionContent>
            </Accordion>
          </div>

          <div className="mb-4">
            <Accordion>
              <AccordionContent title={key("ownerInfo")} eventKey="2">
                <DetailsList
                  items={[
                    ["name", acc?.owner?.name],
                    ["email", acc?.owner?.email],
                    ["phone", acc?.owner?.phone],
                  ]}
                />
              </AccordionContent>
            </Accordion>
          </div>

          <div className="positon-relative d-flex justify-content-end">
            <ButtonOne
              onClick={showDeleteModalHandler}
              borderd={true}
              classes="bg-danger"
              text={key("delete")}
            />
          </div>
        </div>
      </Col>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={hideDeleteModalHandler}
          confirmFun={deleteAccount}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
    </>
  );
};

export default AccountItem;
