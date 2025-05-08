import { useSelector } from "react-redux";
import VerifyPhoneAlert from "../../../Components/VerifyPhone/VerifyPhoneAlert";
import UserDetailsBlock from "./UserDetailsBlock";

const ProfileMain = () => {
  const profileInfo = useSelector((state) => state.profileInfo.data);

  return (
    <>
      <UserDetailsBlock profileInfo={profileInfo} isProfile={true} />

      {profileInfo?.phoneVerified === false && (
        <div className={`mt-3 px-4 d-flex align-items-center`}>
          <VerifyPhoneAlert />
        </div>
      )}
    </>
  );
};

export default ProfileMain;
