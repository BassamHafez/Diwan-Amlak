import AddContactForm from "../Pages/UserDashboard/Contacts/ContactForms/AddContactForm";
import { CheckMySubscriptions, ModalForm } from "../shared/components";
import {
  useCallback,
  useMemo,
  useSelector,
  useState,
  useTranslation,
} from "../shared/hooks";

const useAddContactInForms = ({
  refetchBroker,
  refetchLandlord,
  refetchTenants,
  refetchServices,
}) => {
  const [showAddBrokerModal, setShowBrokerModal] = useState(false);
  const [showAddLandlordModal, setShowAddLandlordModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const { t: key } = useTranslation();

  const showContactModal = useCallback((type) => {
    if (type === "broker") {
      setShowBrokerModal(true);
    } else {
      setShowAddLandlordModal(true);
    }
  }, []);

  const hideContactModal = useCallback((type) => {
    if (type === "broker") {
      setShowBrokerModal(false);
    } else {
      setShowAddLandlordModal(false);
    }
  }, []);

  const showTenantModal = useCallback(() => {
    setShowAddTenantModal(true);
  }, []);
  const hideTenantModal = useCallback(() => {
    setShowAddTenantModal(false);
  }, []);
  const showServiceModal = useCallback(() => {
    setShowAddServiceModal(true);
  }, []);
  const hideServiceModal = useCallback(() => {
    setShowAddServiceModal(false);
  }, []);

  const addBrokersAndLandLords = useMemo(() => {
    return (
      <>
        <div className="d-flex justify-content-end align-items-center flex-wrap mb-3">
          <button
            className="submit_btn bg-navy mx-2"
            type="button"
            onClick={() => showContactModal("broker")}
          >
            {`${key("add")} ${key("broker")}`}
          </button>

          <button
            className="submit_btn bg-navy mx-2"
            type="button"
            onClick={() => showContactModal("landlord")}
          >
            {`${key("add")} ${key("landlord")}`}
          </button>
        </div>
        {showAddBrokerModal && (
          <ModalForm
            show={showAddBrokerModal}
            onHide={() => hideContactModal("broker")}
            modalSize="lg"
          >
            <AddContactForm
              hideModal={() => hideContactModal("broker")}
              contactType={"broker"}
              refetch={refetchBroker}
            />
          </ModalForm>
        )}
        {showAddLandlordModal && (
          <ModalForm
            show={showAddLandlordModal}
            onHide={() => hideContactModal("landlord")}
            modalSize="lg"
          >
            <AddContactForm
              hideModal={() => hideContactModal("landlord")}
              contactType={"landlord"}
              refetch={refetchLandlord}
            />
          </ModalForm>
        )}
      </>
    );
  }, [
    key,
    showContactModal,
    hideContactModal,
    showAddBrokerModal,
    showAddLandlordModal,
    refetchBroker,
    refetchLandlord,
  ]);

  const AddTenants = useMemo(() => {
    return (
      <>
        <button
          className="submit_btn bg-navy mx-2"
          type="button"
          onClick={showTenantModal}
        >
          {`${key("add")} ${key("tenant")}`}
        </button>
        {showAddTenantModal && (
          <ModalForm
            show={showAddTenantModal}
            onHide={hideTenantModal}
            modalSize="lg"
          >
            <AddContactForm
              hideModal={hideTenantModal}
              contactType={"tenant"}
              refetch={refetchTenants}
            />
          </ModalForm>
        )}
      </>
    );
  }, [
    refetchTenants,
    key,
    showTenantModal,
    hideTenantModal,
    showAddTenantModal,
  ]);

  const AddServices = useMemo(() => {
    return (
      <>
        <CheckMySubscriptions
          name="isServiceContactsAllowed"
          accountInfo={accountInfo}
        >
          <div className="d-flex align-items-center justify-content-end">
            <button
              className="submit_btn bg-navy mx-2"
              type="button"
              onClick={showServiceModal}
            >
              {`${key("add")} ${key("service")}`}
            </button>
          </div>
        </CheckMySubscriptions>

        {showAddServiceModal && (
          <ModalForm
            show={showAddServiceModal}
            onHide={hideServiceModal}
            modalSize="lg"
          >
            <AddContactForm
              hideModal={hideServiceModal}
              contactType={"service"}
              refetch={refetchServices}
            />
          </ModalForm>
        )}
      </>
    );
  }, [
    refetchServices,
    key,
    showAddServiceModal,
    hideServiceModal,
    showServiceModal,
    accountInfo,
  ]);

  return { addBrokersAndLandLords, AddTenants, AddServices };
};

export default useAddContactInForms;
