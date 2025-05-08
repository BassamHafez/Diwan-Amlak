import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import ContactItem from "./ContactItem";
import AddContactForm from "./ContactForms/AddContactForm";
import styles from "./Contacts.module.css";
import {
  NoData,
  LoadingOne,
  ButtonOne,
  SearchField,
  ModalForm,
  MainModal,
  CheckPermissions,
  CheckMySubscriptions,
} from "../../../shared/components";
import {
  useCallback,
  useState,
  useTranslation,
  useQuery,
  useSelector,
} from "../../../shared/hooks";
import { Row, Col } from "../../../shared/bootstrap";

const Contacts = () => {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showSelectContactTypeModal, setShowSelectContactTypeModal] =
    useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTenantDetials, setShowTenantDetails] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const { t: key } = useTranslation();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const token = useSelector((state) => state.userInfo.token);
  const [selectedFilter, setSelectedFilter] = useState("contacts");
  const [tenantTypeFilter, setTenantTypeFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const accountInfo = useSelector((state) => state.accountInfo.data);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const {
    data: allContacts,
    isFetching: isFetchingContacts,
    refetch: refetchAllContacts,
  } = useQuery({
    queryKey: ["contacts", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "contacts" && !!token,
  });

  const {
    data: brokers,
    isFetching: isFetchingBrokers,
    refetch: refetchBrokers,
  } = useQuery({
    queryKey: ["brokers", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/brokers",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "broker" && !!token,
  });

  const {
    data: landlords,
    isFetching: isFetchingLandlords,
    refetch: refetchLandlords,
  } = useQuery({
    queryKey: ["landlord", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/landlords",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "landlord" && !!token,
  });

  const {
    data: services,
    isFetching: isFetchingServices,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ["service", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/services",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "service" && !!token,
  });

  const {
    data: tenants,
    isFetching: isFetchingTenants,
    refetch: refetchTenants,
  } = useQuery({
    queryKey: ["tenant", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/tenants",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "tenant" && !!token,
  });

  const handleFilterChange = useCallback((event) => {
    setSelectedFilter(event.target.value);
  }, []);

  const handleTenantType = useCallback((event) => {
    setTenantTypeFilter(event.target.value);
  }, []);

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const renderContacts = useCallback(
    (contacts, type, isFetching) => {
      if (isFetching) return <LoadingOne />;

      if (!contacts?.data?.length) return <NoData text={key("noContacts")} />;

      const getRefetchFunction = () => {
        switch (selectedFilter) {
          case "broker":
            return refetchBrokers;
          case "landlord":
            return refetchLandlords;
          case "service":
            return refetchServices;
          case "tenant":
            return refetchTenants;
          default:
            return refetchAllContacts;
        }
      };

      const filteredData =
        contacts && Array.isArray(contacts.data)
          ? contacts.data.filter((contact) => {
              const normalizedSearchFilter = searchFilter.toLowerCase();
              const contactName = contact.name?.toLowerCase() || "";
              const contactPhone = contact.phone?.toLowerCase() || "";
              const contactPhone2 = contact.phone2?.toLowerCase() || "";

              const isNameMatch = contactName.includes(normalizedSearchFilter);
              const isPhoneMatch = contactPhone.includes(
                normalizedSearchFilter
              );
              const isPhone2Match = contactPhone2.includes(
                normalizedSearchFilter
              );

              if (selectedFilter === "tenant") {
                return (
                  (tenantTypeFilter === "all" ||
                    contact.type === tenantTypeFilter) &&
                  (isNameMatch || isPhoneMatch || isPhone2Match)
                );
              }

              return isNameMatch || isPhoneMatch || isPhone2Match;
            })
          : [];

      return filteredData.map((contact) => (
        <ContactItem
          key={contact._id}
          contact={contact}
          type={type}
          showNotes={showNotes}
          showTenantDetials={showTenantDetials}
          isListView={isListView}
          refetch={getRefetchFunction()}
          refetchAllContacts={refetchAllContacts}
        />
      ));
    },
    [
      isListView,
      key,
      refetchAllContacts,
      refetchBrokers,
      refetchLandlords,
      refetchServices,
      refetchTenants,
      searchFilter,
      selectedFilter,
      showNotes,
      showTenantDetials,
      tenantTypeFilter,
    ]
  );

  const showAddModal = useCallback(() => {
    if (selectedFilter === "contacts") {
      setShowSelectContactTypeModal(true);
    } else {
      setShowAddContactModal(true);
    }
  }, [selectedFilter]);

  const triggerAddModalDependsOnSelection = useCallback((selection) => {
    setShowSelectContactTypeModal(false);
    setSelectedFilter(selection);
    setShowAddContactModal(true);
  }, []);

  const toggleSwitchBtn = useCallback(() => {
    if (selectedFilter === "tenant") {
      setShowTenantDetails(!showTenantDetials);
    } else {
      setShowNotes(!showNotes);
    }
  }, [selectedFilter, showNotes, showTenantDetials]);

  return (
    <div className={styles.contacts_body}>
      <Row style={{ minHeight: "65vh" }}>
        <Col sm={4} lg={3} className="p-0">
          <div className={styles.filter_side}>
            <div className="small_filter">
              <h5 className="mb-4">{key("contactType")}</h5>
              <Row className={styles.filter_row}>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      value="contacts"
                      id="contacts"
                      autoComplete="off"
                      checked={selectedFilter === "contacts"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "contacts" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="contacts"
                    >
                      {key("all")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      value="broker"
                      id="broker"
                      autoComplete="off"
                      checked={selectedFilter === "broker"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "broker" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="broker"
                    >
                      {key("agent")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      id="landlord"
                      autoComplete="off"
                      value="landlord"
                      checked={selectedFilter === "landlord"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "landlord" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="landlord"
                    >
                      {key("landlord")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      id="tenant"
                      value="tenant"
                      autoComplete="off"
                      checked={selectedFilter === "tenant"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "tenant" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="tenant"
                    >
                      {key("tenant")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <CheckMySubscriptions
                    name="isServiceContactsAllowed"
                    accountInfo={accountInfo}
                  >
                    <div>
                      <input
                        type="radio"
                        className="btn-check"
                        name="types"
                        id="service"
                        value="service"
                        autoComplete="off"
                        checked={selectedFilter === "service"}
                        onChange={handleFilterChange}
                      />
                      <label
                        className={`${
                          selectedFilter === "service" && styles.label_checked
                        } btn mx-1`}
                        htmlFor="service"
                      >
                        {key("serviceType")}
                      </label>
                    </div>
                  </CheckMySubscriptions>
                </Col>
              </Row>
            </div>
            {selectedFilter === "tenant" && (
              <div className="small_filter">
                <h5 className="mb-4">{key("tenantType")}</h5>
                <Row className={styles.filter_row}>
                  <Col
                    xs={4}
                    sm={12}
                    md={6}
                    xl={6}
                    xxl={4}
                    className="d-flex justify-content-center algn-items-center"
                  >
                    <div>
                      <input
                        type="radio"
                        className="btn-check"
                        name="tenantType"
                        value="all"
                        id="all"
                        autoComplete="off"
                        checked={tenantTypeFilter === "all"}
                        onChange={handleTenantType}
                      />
                      <label
                        className={`${
                          tenantTypeFilter === "all" && styles.label_checked
                        } btn mx-1`}
                        htmlFor="all"
                      >
                        {key("all")}
                      </label>
                    </div>
                  </Col>
                  <Col
                    xs={4}
                    sm={12}
                    md={6}
                    xl={6}
                    xxl={4}
                    className="d-flex justify-content-center algn-items-center"
                  >
                    <div>
                      <input
                        type="radio"
                        className="btn-check"
                        name="tenantType"
                        value="organization"
                        id="organization"
                        autoComplete="off"
                        checked={tenantTypeFilter === "organization"}
                        onChange={handleTenantType}
                      />
                      <label
                        className={`${
                          tenantTypeFilter === "organization" &&
                          styles.label_checked
                        } btn mx-1`}
                        htmlFor="organization"
                      >
                        {key("organization")}
                      </label>
                    </div>
                  </Col>
                  <Col
                    xs={4}
                    sm={12}
                    md={6}
                    xl={6}
                    xxl={4}
                    className="d-flex justify-content-center algn-items-center"
                  >
                    <div>
                      <input
                        type="radio"
                        className="btn-check"
                        name="tenantType"
                        value="individual"
                        id="individual"
                        autoComplete="off"
                        checked={tenantTypeFilter === "individual"}
                        onChange={handleTenantType}
                      />
                      <label
                        className={`${
                          tenantTypeFilter === "individual" &&
                          styles.label_checked
                        } btn mx-1`}
                        htmlFor="individual"
                      >
                        {key("individual")}
                      </label>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            <hr />
            <div className="form-check form-switch p-0 m-0  mt-3 d-flex justify-content-between align-items-center">
              <label className="form-check-label m-0 fs-sm-5" htmlFor="alpha">
                {key("listView")}
              </label>
              <input
                className="form-check-input fs-3  m-0"
                style={{ cursor: "pointer" }}
                type="checkbox"
                role="switch"
                id="alpha"
                onChange={() => setIsListView(!isListView)}
              />
            </div>

            <div className="form-check form-switch p-0 m-0  mt-2 d-flex justify-content-between align-items-center">
              <label className="form-check-label m-0 fs-sm-5" htmlFor="alpha">
                {selectedFilter === "tenant"
                  ? key("showDetails")
                  : key("showNotes")}
              </label>
              <input
                className="form-check-input fs-3  m-0"
                style={{ cursor: "pointer" }}
                type="checkbox"
                role="switch"
                id="alpha"
                onChange={toggleSwitchBtn}
              />
            </div>
          </div>
        </Col>

        <Col sm={8} lg={9}>
          <div className={styles.contacts_side}>
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-5 mt-2 px-3">
              <div className="my-1">
                <SearchField onSearch={onSearch} text={key("searchContacts")} />
              </div>
              <CheckPermissions
                btnActions={["ADD_CONTACT"]}
                profileInfo={profileInfo}
              >
                <div className={`${isArLang ? "me-auto" : "ms-auto"} my-1`}>
                  {selectedFilter === "service" ? (
                    <CheckMySubscriptions
                      name="isServiceContactsAllowed"
                      accountInfo={accountInfo}
                    >
                      <ButtonOne
                        onClick={showAddModal}
                        text={`${key("add")} ${key(selectedFilter)}`}
                        borderd={true}
                      />
                    </CheckMySubscriptions>
                  ) : (
                    <ButtonOne
                      onClick={showAddModal}
                      text={`${key("add")} ${key(selectedFilter)}`}
                      borderd={true}
                    />
                  )}
                </div>
              </CheckPermissions>
            </div>
            <Row>
              {selectedFilter === "contacts" && allContacts
                ? renderContacts(allContacts, "contact", isFetchingContacts)
                : selectedFilter === "landlord" && landlords
                ? renderContacts(landlords, "landlord", isFetchingLandlords)
                : selectedFilter === "service" && services
                ? renderContacts(services, "service", isFetchingServices)
                : selectedFilter === "broker" && brokers
                ? renderContacts(brokers, "broker", isFetchingBrokers)
                : selectedFilter === "tenant" && tenants
                ? renderContacts(tenants, "tenant", isFetchingTenants)
                : null}
            </Row>
          </div>
        </Col>
      </Row>

      {showAddContactModal && (
        <ModalForm
          show={showAddContactModal}
          onHide={() => setShowAddContactModal(false)}
          modalSize="lg"
        >
          <AddContactForm
            hideModal={() => setShowAddContactModal(false)}
            contactType={selectedFilter}
            refetch={
              selectedFilter === "broker"
                ? refetchBrokers
                : selectedFilter === "landlord"
                ? refetchLandlords
                : selectedFilter === "service"
                ? refetchServices
                : selectedFilter === "tenant" && refetchTenants
            }
            refetchAllContacts={refetchAllContacts}
          />
        </ModalForm>
      )}

      {showSelectContactTypeModal && (
        <MainModal
          show={showSelectContactTypeModal}
          onHide={() => setShowSelectContactTypeModal(false)}
        >
          <h4 className="my-3">{key("contactType")}</h4>
          <div className={styles.select_contact_type}>
            <div onClick={() => triggerAddModalDependsOnSelection("broker")}>
              <span>
                {key("add")} {key("broker")}
              </span>
            </div>
            <div onClick={() => triggerAddModalDependsOnSelection("tenant")}>
              <span>
                {key("add")} {key("tenant")}
              </span>
            </div>
            <div onClick={() => triggerAddModalDependsOnSelection("landlord")}>
              <span>
                {key("add")} {key("landlord")}
              </span>
            </div>
            <CheckMySubscriptions
              name="isServiceContactsAllowed"
              accountInfo={accountInfo}
            >
              <div onClick={() => triggerAddModalDependsOnSelection("service")}>
                <span>
                  {key("add")} {key("service")}
                </span>
              </div>
            </CheckMySubscriptions>
          </div>
        </MainModal>
      )}
    </div>
  );
};

export default Contacts;
