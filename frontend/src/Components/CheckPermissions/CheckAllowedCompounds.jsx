import { useSelector } from "react-redux";

const CheckAllowedCompounds = ({ children, id }) => {
  const profileInfo = useSelector((state) => state.profileInfo?.data);
  const permittedCompounds = profileInfo?.permittedCompounds || [];

  const hasPermissions =
    id === "estate" ||
    permittedCompounds.length === 0 ||
    permittedCompounds.includes(id);

  return hasPermissions ? children : null;
};

export default CheckAllowedCompounds;
