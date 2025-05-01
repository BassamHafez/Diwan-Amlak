import { useTranslation } from "react-i18next";
import NoData from "../UI/Blocks/NoData";
import { memo } from "react";
import LoadingOne from "../UI/Loading/LoadingOne";

const CheckSubscriptionRender = memo(({ accountData, name, children }) => {
  const { t: key } = useTranslation();

  if (!accountData || accountData[name] === undefined) {
    return <LoadingOne/>;
  }

  if (accountData[name] === false) {
    return (
      <NoData
        type="upgrade"
        verySmallSize={true}
        text={`${key("upgradePackage")} ${key(name)}`}
      />
    );
  } else {
    return children;
  }
});

CheckSubscriptionRender.displayName = "CheckSubscriptionRender";
export default CheckSubscriptionRender;
