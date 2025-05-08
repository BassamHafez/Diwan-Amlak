import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CheckPermissions = memo(
  ({ children, btnActions = [], noCheckingForExpired, profileInfo }) => {
    const myPermissions = profileInfo?.permissions;
    const isTimeExpired = useSelector(
      (state) => state.packageTime.isTimeExpired
    );
    const hasPermissions = btnActions.some((action) =>
      myPermissions?.includes(action)
    );

    const { t: key } = useTranslation();
    const notifyError = () => toast(key("subExpired"));

    const printMessage = () => {
      if (isTimeExpired === true) {
        notifyError();
      }
    };

    if (!myPermissions?.length > 0) {
      return children;
    }
    return hasPermissions ? (
      isTimeExpired === true && !noCheckingForExpired ? (
        <span onClick={printMessage} className="expired">
          {children}
        </span>
      ) : (
        children
      )
    ) : null;
  }
);

CheckPermissions.displayName = "CheckPermissions";
export default CheckPermissions;
