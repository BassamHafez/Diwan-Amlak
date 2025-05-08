import CreatePackage from "./PackagesForm/CreatePackage";
import PackageTab from "./PackageTab";
import {
  useState,
  useTranslation,
  useCallback,
  useFilterPackagesDuration,
} from "../../../shared/hooks";
import {
  MainTitle,
  LoadingOne,
  ModalForm,
  ButtonOne,
} from "../../../shared/components";
import { Tab, Tabs } from "../../../shared/bootstrap";

const AllPackages = () => {
  const [showAddPackModal, setShowAddPackModal] = useState(false);
  const {
    packages,
    monthlyPackages,
    threeMonthsPackage,
    sixMonthsPackage,
    yearlyPackage,
    refetch,
    isFetching,
  } = useFilterPackagesDuration();
  const { t: key } = useTranslation();

  const handleShowAddModal = useCallback(() => setShowAddPackModal(true), []);
  const handleHideAddModal = useCallback(() => setShowAddPackModal(false), []);

  return (
    <>
      <div className="admin_body height_container p-2 position-relative">
        <div className="my-3">
          <MainTitle title={key("packages")} />
        </div>
        <div className="d-flex justify-content-end p-2 pb-3">
          <ButtonOne
            onClick={handleShowAddModal}
            borderd={true}
            text={key("addPackage")}
          />
        </div>
        {(!packages || isFetching) && <LoadingOne />}
        <Tabs defaultActiveKey="month" className="mb-5" fill>
          <Tab eventKey="month" title={key("month")}>
            <PackageTab packages={monthlyPackages} refetch={refetch} />
          </Tab>
          <Tab eventKey="3month" title={key("3month")}>
            <PackageTab packages={threeMonthsPackage} refetch={refetch} />
          </Tab>
          <Tab eventKey="6month" title={key("6month")}>
            <PackageTab packages={sixMonthsPackage} refetch={refetch} />
          </Tab>
          <Tab eventKey="year" title={key("year")}>
            <PackageTab
              title="year"
              packages={yearlyPackage}
              refetch={refetch}
            />
          </Tab>
        </Tabs>
      </div>
      {showAddPackModal && (
        <ModalForm
          show={showAddPackModal}
          onHide={handleHideAddModal}
          modalSize="lg"
        >
          <CreatePackage hideModal={handleHideAddModal} refetch={refetch} />
        </ModalForm>
      )}
    </>
  );
};

export default AllPackages;
