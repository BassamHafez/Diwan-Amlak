import styles from "../Admin.module.css";
import UpdateSubscriptions from "./UpdateSubscriptions";
import { FontAwesomeIcon } from "../../../shared/index";
import { faPenToSquare } from "../../../shared/constants";
import { useTranslation, useState, useCallback } from "../../../shared/hooks";
import { ModalForm } from "../../../shared/components";

const SubscriptionItem = ({ sub, refetch }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const hideModal = useCallback(() => {
    setShowUpdateModal(false);
  }, []);

  return (
    <>
      <tr>
        <td className={isArLang ? "text-end" : "text-start"}>
          {sub?.feature === "FAVORITES"
            ? `${key("add")} ${key("FAVORITES")}`
            : key(sub?.feature)}
        </td>
        <td>{sub?.price}</td>
        <td>
          <FontAwesomeIcon
            className={styles.table_icon}
            title={key("update")}
            icon={faPenToSquare}
            onClick={() => setShowUpdateModal(true)}
          />
        </td>
      </tr>
      {showUpdateModal && (
        <ModalForm show={showUpdateModal} onHide={hideModal} modalSize={"md"}>
          <UpdateSubscriptions
            hideModal={hideModal}
            refetch={refetch}
            sub={sub}
          />
        </ModalForm>
      )}
    </>
  );
};

export default SubscriptionItem;
