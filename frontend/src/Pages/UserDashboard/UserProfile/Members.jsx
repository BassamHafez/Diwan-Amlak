import { useSelector } from "react-redux";
import MemberItem from "./MemberItem";
import Row from "react-bootstrap/esm/Row";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useTranslation } from "react-i18next";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useCallback, useState } from "react";
import AddMemberForm from "./ProfileForms/AddMemberForm";
import { CheckMySubscriptions } from "../../../shared/components";

const Members = () => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();

  const showModal = useCallback(() => {
    setShowAddMemberModal(true);
  }, []);

  const hideModal = useCallback(() => {
    setShowAddMemberModal(false);
  }, []);

  return (
    <div className="p-4">
      <div className={`${isArLang ? "text-start" : "text-end"} mb-4`}>
        <CheckMySubscriptions
          name="allowedUsers"
          type="number"
          accountInfo={accountInfo}
        >
          <ButtonOne
            borderd={true}
            text={`${key("add")} ${key("member")}`}
            onClick={showModal}
          />
        </CheckMySubscriptions>
      </div>
      <Row>
        {accountInfo?.account?.members?.map((member, index) => (
          <MemberItem
            key={`${member._id}_${index}`}
            accountId={accountInfo?.account?._id}
            allPermissions={profileInfo?.permissions}
            userPermissions={
              member?.permissions?.length > 0
                ? member?.permissions
                : profileInfo?.permissions
            }
            userData={member?.user}
            permittedCompounds={member?.permittedCompounds}
            accountOwner={accountInfo?.account?.owner}
            tag={member?.tag}
          />
        ))}
      </Row>
      {showAddMemberModal && (
        <ModalForm show={showAddMemberModal} onHide={hideModal}>
          <AddMemberForm
            allPermissions={profileInfo?.permissions}
            hideModal={hideModal}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Members;
