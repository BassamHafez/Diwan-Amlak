import CustomPackageItem from "../../Packages/CustomPackageItem";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import useCurrentFeatures from "../../../hooks/useCurrentFeatures";
import PolicyList from "../../../Components/UI/Blocks/PolicyList";
import { useSelector } from "react-redux";
import { calculateRemainingTime } from "../../../Components/Logic/LogicFun";

const MySubscription = ({ chooseActiveActive }) => {
  const { t: key } = useTranslation();
  const currentFeatures = useCurrentFeatures();
  const accountInfo = useSelector((state) => state.accountInfo.data);
  let subscriptionEndDate = accountInfo?.account?.subscriptionEndDate;

  const remainingTime = subscriptionEndDate
    ? calculateRemainingTime(
        subscriptionEndDate,
        key("expired"),
        key("days"),
        key("oneMonth"),
        key("months")
      )
    : key("noSubscription");

  const policyList = [
    { label: "mySubPolicy", value: null },
    { label: "mySubPolicy2", value: null },
    { label: "mySubPolicy3", value: null },
    { label: "mySubPolicy4", value: "/help" },
  ];

  return (
    <Row>
      <Col xl={8} sm={6} className="py-5">
        <PolicyList list={policyList} />
      </Col>
      <Col xl={4} sm={6} className="pb-5">
        <CustomPackageItem
          features={Object.entries(currentFeatures).map(([key, value]) => ({
            label: key,
            value,
          }))}
          title={key("mySubscription")}
          btnText={key("updatePackage")}
          chooseActiveActive={chooseActiveActive}
          remainingTime={remainingTime}
          isNoFixedHeight={true}
          isMySub={true}
        />
      </Col>
    </Row>
  );
};

export default MySubscription;
