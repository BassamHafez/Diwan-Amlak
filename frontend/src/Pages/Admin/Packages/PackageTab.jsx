import PackItem from "./PackItem";
import {Row} from "../../../shared/bootstrap";
import {NoData} from "../../../shared/components";
import {useTranslation} from "../../../shared/hooks";

const PackageTab = ({packages, refetch }) => {
  const { t: key } = useTranslation();

  return (
      <div className="position-relative px-1">
        <Row className="g-3">
          {packages?.length > 0 ? (
            packages?.map((packageData) => (
              <PackItem
                key={packageData._id}
                pack={packageData}
                refetch={refetch}
              />
            ))
          ) : (
            <NoData smallSize={true} text={key("noPlans")} />
          )}
        </Row>
      </div>
  );
};

export default PackageTab;
