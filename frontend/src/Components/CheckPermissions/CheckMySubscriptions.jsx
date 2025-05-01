import { toast } from "react-toastify";
import { useCurrentFeatures, useTranslation } from "../../shared/hooks";
import { memo } from "react";

const CheckMySubscriptions = memo(({ name, type, children, accountInfo }) => {
  const currentFeatures = useCurrentFeatures(accountInfo?.account);

  const { t: key } = useTranslation();
  const notifyError = () =>
    toast(key(`${type === "number" ? "featureEnded" : "unAvailableFeature"}`));

  if (accountInfo?.account?.isVIP === true) {
    return children;
  }

  const isFeatureAvailable =
    type === "number"
      ? currentFeatures[name] > 0
      : Boolean(currentFeatures[name]);

  return isFeatureAvailable ? (
    children
  ) : (
    <span className="expired" onClick={notifyError}>
      {children}
    </span>
  );
});

CheckMySubscriptions.displayName = "CheckMySubscriptions";
export default CheckMySubscriptions;
