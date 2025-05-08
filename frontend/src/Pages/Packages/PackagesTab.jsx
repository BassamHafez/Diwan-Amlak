import Row from "react-bootstrap/esm/Row";
import { elitePackage } from "../../Components/Logic/StaticLists";
import PackageItem from "./PackageItem";

const PackagesTab = ({ packages,duration }) => {

  return (
    <div className="position-relative px-1">
      <Row className="g-3">
        {packages?.map((packageData) => (
          <PackageItem key={packageData._id} pack={packageData} />
        ))}
        <PackageItem pack={elitePackage} duration={duration} type="vip" />
      </Row>
    </div>
  );
};

export default PackagesTab;
