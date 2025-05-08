import styles from "./Properties.module.css";
import Property from "../../../Components/Property/Property";
import AddCompound from "../PropertyForms/AddCompound";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import AddEstate from "../PropertyForms/AddEstate";
import { checkAccountFeatures } from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon, Select } from "../../../shared/index";
import {
  faBuilding,
  faCubes,
  faFileSignature,
  faRotate,
  toast,
} from "../../../shared/constants";
import {
  useCallback,
  useEffect,
  useState,
  useTranslation,
  useNavigate,
  useCompoundOptions,
  useSelector,
  useQuery,
  useMemo,
} from "../../../shared/hooks";
import {
  NoData,
  ModalForm,
  ButtonOne,
  SearchField,
  MainModal,
  AccordionContent,
  LoadingOne,
  CheckPermissions,
  CheckMySubscriptions,
} from "../../../shared/components";
import { Row, Col, Accordion, Container } from "../../../shared/bootstrap";

const Properties = () => {
  const { t: key } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showAddCompoundModal, setShowAddCompoundModal] = useState(false);
  const [showAddEstateModal, setShowAddEstateModal] = useState(false);
  const { compoundsOptions, refetchCompound, fetchingCompounds, compounds } =
    useCompoundOptions();
  //filters
  const [selectedCompoundId, setSelectedCompoundId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("estates");
  const [statusFiltering, setStatusFiltering] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [compoundStatusFiltering, setCompoundStatusFiltering] = useState("all");
  const profileInfo = useSelector((state) => state.profileInfo.data);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const role = useSelector((state) => state.userInfo.role);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const navigate = useNavigate();

  const showAddCompoundHandler = useCallback(
    () => setShowAddCompoundModal(true),
    []
  );
  const hideAddCompoundHandler = useCallback(
    () => setShowAddCompoundModal(false),
    []
  );

  const showAddEstateHandler = useCallback(
    () => setShowAddEstateModal(true),
    []
  );
  const hideAddEstateHandler = useCallback(
    () => setShowAddEstateModal(false),
    []
  );

  const showMainModalHandler = useCallback(() => setShowModal(true), []);
  const hideMainModalHandler = useCallback(() => setShowModal(false), []);

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin-packages");
    }
  }, [role, navigate]);

  const {
    data: estates,
    isFetching: fetchingEstates,
    refetch: refetchEstate,
  } = useQuery({
    queryKey: ["estates", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "estates",
        token: token,
        isLimited: true,
      }),
    enabled: selectedFilter === "estates" && !!token,
    staleTime: Infinity,
  });

  const { data: bookmarked, isFetching: fetchingBookmarked } = useQuery({
    queryKey: ["bookmarked", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "estates?inFavorites=true",
        token: token,
        isLimited: true,
      }),
    enabled:
      selectedFilter === "bookmarked" &&
      !!token &&
      !!accountInfo?.account?.isFavoriteAllowed,
    staleTime: Infinity,
  });

  //filtering
  const filteredEstates = useMemo(() => {
    const estatesData = estates?.data;
    return estates && Array.isArray(estatesData)
      ? estatesData?.filter(
          (estate) =>
            (!selectedCompoundId ||
              estate.compound?._id === selectedCompoundId) &&
            (statusFiltering === "all" || estate.status === statusFiltering)
        )
      : [];
  }, [estates, statusFiltering, selectedCompoundId]);

  const filteredBookmarked = useMemo(() => {
    const bookMarkData = bookmarked?.data;
    return bookmarked && Array.isArray(bookMarkData)
      ? bookMarkData?.filter(
          (fav) =>
            (!selectedCompoundId || fav.compound?._id === selectedCompoundId) &&
            (statusFiltering === "all" || fav.status === statusFiltering)
        )
      : [];
  }, [bookmarked, statusFiltering, selectedCompoundId]);

  const filteredCompounds = useMemo(() => {
    const getCompoundRentedCount = (compId) => {
      let rentedEstate = [];
      rentedEstate = compounds?.data?.rentedEstatesCount.find(
        (comp) => comp.compoundId === compId
      );
      return rentedEstate?.rentedCount || 0;
    };
    const compData = compounds?.data?.compounds;
    return compounds && Array.isArray(compData)
      ? compData?.filter((comp) => {
          switch (compoundStatusFiltering) {
            case "all":
              return true;
            case "noEstates":
              return comp.estatesCount === 0;
            case "available":
              return (
                comp.estatesCount > 0 && getCompoundRentedCount(comp._id) === 0
              );
            case "rented":
              return (
                getCompoundRentedCount(comp._id) > 0 &&
                comp.estatesCount > 0 &&
                getCompoundRentedCount(comp._id) === comp.estatesCount
              );
            case "partiallyRented":
              return (
                comp.estatesCount > 0 &&
                getCompoundRentedCount(comp._id) > 0 &&
                getCompoundRentedCount(comp._id) < comp.estatesCount
              );
            default:
              return false;
          }
        })
      : [];
  }, [compounds, compoundStatusFiltering]);

  //rendering
  const renderProperties = (
    data,
    isFetching,
    type,
    hideCompound = false,
    hideStatus = false,
    rentedEstatesCount
  ) => {
    if (isFetching) {
      return <LoadingOne />;
    }
    const getRentedEstate = (itemId) => {
      if (!rentedEstatesCount) {
        return undefined;
      }
      return rentedEstatesCount.find((comp) => comp.compoundId === itemId);
    };

    const filteredData =
      data && Array.isArray(data)
        ? data.filter((item) => {
            const normalizedSearchFilter = searchFilter.toLowerCase();
            return (
              item.name.toLowerCase().includes(normalizedSearchFilter) ||
              (item.tags &&
                Array.isArray(item.tags) &&
                item.tags.some((tag) =>
                  tag.toLowerCase().includes(normalizedSearchFilter)
                ))
            );
          })
        : [];

    if (filteredData?.length > 0) {
      return filteredData?.map((item) => (
        <Property
          key={item._id}
          hideCompound={hideCompound}
          hideStatus={hideStatus}
          property={item}
          type={type}
          rentedEstatesCountObj={getRentedEstate(item._id)}
        />
      ));
    }

    return (
      <NoData
        text={type === "estate" ? key("noEstateUnit") : key("noProperty")}
        type="estate"
      />
    );
  };

  const handleFilterChange = useCallback((event, type) => {
    const val = event.target.value;
    if (type === "status") {
      setStatusFiltering(val);
    } else if (type === "compoundStatus") {
      setCompoundStatusFiltering(val);
    } else {
      setSelectedFilter(val);
    }
  }, []);

  const showNextModal = useCallback(
    (selectedModal) => {
      const notifyError = (message) => toast.error(message);
      setShowModal(false);
      const allowName =
        selectedModal === "compound" ? "allowedCompounds" : "allowedEstates";
      const isAllowed = checkAccountFeatures(accountInfo?.account, allowName);
      if (!isAllowed) {
        notifyError(key("featureEnded"));
        return;
      }
      if (selectedModal === "compound") {
        showAddCompoundHandler();
      } else {
        showAddEstateHandler();
      }
    },
    [accountInfo, key, showAddCompoundHandler, showAddEstateHandler]
  );

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const refetchEstatesAndCompounds = useCallback(() => {
    refetchEstate();
    refetchCompound();
  }, [refetchEstate, refetchCompound]);

  const handleCompoundFilterChange = useCallback((value) => {
    setSelectedCompoundId(value);
  }, []);

  //statics
  const cubes = <FontAwesomeIcon className={styles.acc_icon} icon={faCubes} />;
  const status = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faRotate} />
  );
  const Contracts = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faFileSignature} />
  );
  const parentRealEstate = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faBuilding} />
  );

  const filterByCompoundSelect = useMemo(() => {
    return (
      <Select
        isSearchable={true}
        classNames="w-100"
        name="parentRealEstate"
        options={compoundsOptions}
        className={`${isArLang ? "text-end" : "text-start"}`}
        isRtl={isArLang ? true : false}
        placeholder={isArLang ? "" : "select"}
        isClearable
        value={
          compoundsOptions?.find(
            (option) => option.value === selectedCompoundId
          ) || null
        }
        onChange={(val) => handleCompoundFilterChange(val ? val.value : null)}
      />
    );
  }, [
    selectedCompoundId,
    compoundsOptions,
    handleCompoundFilterChange,
    isArLang,
  ]);

  const smallFilterClass = "small_filter mb-3";

  return (
    <div className={styles.main_body}>
      <Row>
        <div className={styles.small_controllers}>
          <div className={smallFilterClass}>
            <h5>{key("types")}</h5>
            <input
              type="radio"
              className="btn-check"
              name="types"
              value="estates"
              id="estatesSmall"
              autoComplete="off"
              checked={selectedFilter === "estates"}
              onChange={handleFilterChange}
            />
            <label
              className={`${
                selectedFilter === "estates" && styles.label_checked
              } btn`}
              htmlFor="estatesSmall"
            >
              {key("allProp")}
            </label>

            <input
              type="radio"
              className="btn-check"
              name="types"
              id="compoundsSmall"
              autoComplete="off"
              value="compounds"
              checked={selectedFilter === "compounds"}
              onChange={handleFilterChange}
            />
            <label
              className={`${
                selectedFilter === "compounds" && styles.label_checked
              } btn`}
              htmlFor="compoundsSmall"
            >
              {key("compounds")}
            </label>
            <CheckMySubscriptions
              name="isFavoriteAllowed"
              accountInfo={accountInfo}
            >
              <input
                type="radio"
                className="btn-check"
                name="types"
                id="bookmarkedSmall"
                value="bookmarked"
                autoComplete="off"
                checked={selectedFilter === "bookmarked"}
                onChange={handleFilterChange}
              />
              <label
                className={`${
                  selectedFilter === "bookmarked" && styles.label_checked
                } btn`}
                htmlFor="bookmarkedSmall"
              >
                {key("bookmarked")}
              </label>
            </CheckMySubscriptions>
          </div>

          {selectedFilter !== "compounds" && (
            <>
              <div className={smallFilterClass}>
                <h5>{key("status")}</h5>
                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="statusAllSmall"
                  autoComplete="off"
                  value="all"
                  checked={statusFiltering === "all"}
                  onChange={(e) => handleFilterChange(e, "status")}
                />
                <label
                  className={`${
                    statusFiltering === "all" && styles.label_checked
                  } btn`}
                  htmlFor="statusAllSmall"
                >
                  {key("all")}
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="rentedSmall"
                  value="rented"
                  autoComplete="off"
                  checked={statusFiltering === "rented"}
                  onChange={(e) => handleFilterChange(e, "status")}
                />
                <label
                  className={`${
                    statusFiltering === "rented" && styles.label_checked
                  } btn`}
                  htmlFor="rentedSmall"
                >
                  {key("rented")}
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="availableSmall"
                  value="available"
                  autoComplete="off"
                  checked={statusFiltering === "available"}
                  onChange={(e) => handleFilterChange(e, "status")}
                />
                <label
                  className={`${
                    statusFiltering === "available" && styles.label_checked
                  } btn`}
                  htmlFor="availableSmall"
                >
                  {key("available")}
                </label>
              </div>

              <div className={smallFilterClass}>
                <h5>{key("parentRealEstate")}</h5>
                {filterByCompoundSelect}
              </div>
            </>
          )}
        </div>

        <Col md={3} lg={2} className={styles.filters}>
          <aside>
            <Accordion defaultActiveKey={["0", "1", "2", "3"]}>
              <AccordionContent
                removeTitle={true}
                title={key("types")}
                icon={cubes}
                eventKey="0"
              >
                <div className="form-check">
                  <div>
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="typesSelection"
                      value="estates"
                      id="estatesSelection"
                      checked={selectedFilter === "estates"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="estatesSelection"
                    >
                      {key("allProp")}
                    </label>
                  </div>

                  <div>
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="typesSelection"
                      value="compounds"
                      checked={selectedFilter === "compounds"}
                      onChange={handleFilterChange}
                      id="compoundsSelection"
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="compoundsSelection"
                    >
                      {key("compounds")}
                    </label>
                  </div>
                  <CheckMySubscriptions
                    name="isFavoriteAllowed"
                    accountInfo={accountInfo}
                  >
                    <div>
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="typesSelection"
                        value="bookmarked"
                        id="bookmarkedSelection"
                        checked={selectedFilter === "bookmarked"}
                        onChange={handleFilterChange}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="bookmarkedSelection"
                      >
                        {key("bookmarked")}
                      </label>
                    </div>
                  </CheckMySubscriptions>
                </div>
              </AccordionContent>
              {selectedFilter !== "compounds" ? (
                <>
                  <AccordionContent
                    title={key("parentRealEstate")}
                    icon={parentRealEstate}
                    eventKey="3"
                  >
                    {filterByCompoundSelect}
                  </AccordionContent>

                  <AccordionContent
                    removeTitle={true}
                    title={key("status")}
                    icon={status}
                    eventKey="1"
                  >
                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="statusSelection"
                        value="all"
                        id="statusAll"
                        checked={statusFiltering === "all"}
                        onChange={(e) => handleFilterChange(e, "status")}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="statusAll"
                      >
                        {key("all")}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="statusSelection"
                        value="rented"
                        id="rented"
                        checked={statusFiltering === "rented"}
                        onChange={(e) => handleFilterChange(e, "status")}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="rented"
                      >
                        {key("rented")}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="statusSelection"
                        value="available"
                        id="available"
                        checked={statusFiltering === "available"}
                        onChange={(e) => handleFilterChange(e, "status")}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="available"
                      >
                        {key("available")}
                      </label>
                    </div>
                  </AccordionContent>
                </>
              ) : (
                <AccordionContent
                  removeTitle={true}
                  title={key("status")}
                  icon={Contracts}
                  eventKey="3"
                >
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="all"
                      id="all"
                      checked={compoundStatusFiltering === "all"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="all"
                    >
                      {key("all")}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="available"
                      id="available"
                      checked={compoundStatusFiltering === "available"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="available"
                    >
                      {key("availableCompounds")}
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="rented"
                      id="rented"
                      checked={compoundStatusFiltering === "rented"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="rented"
                    >
                      {key("rentedCompounds")}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="partiallyRented"
                      id="partiallyRented"
                      checked={compoundStatusFiltering === "partiallyRented"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="partiallyRented"
                    >
                      {key("partialRentedCompounds")}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="noEstates"
                      id="noEstates"
                      checked={compoundStatusFiltering === "noEstates"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="noEstates"
                    >
                      {key("noEstates")}
                    </label>
                  </div>
                </AccordionContent>
              )}
            </Accordion>
          </aside>
        </Col>

        <Col md={9} lg={10}>
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center flex-wrap my-3 mb-5 px-1">
              <div className="my-1">
                <SearchField onSearch={onSearch} text={key("searchEstate")} />
              </div>
              <div className={`${isArLang ? "me-auto" : "ms-auto"} my-1`}>
                <CheckPermissions
                  profileInfo={profileInfo}
                  btnActions={["ADD_COMPOUND", "ADD_ESTATE"]}
                >
                  <ButtonOne
                    onClick={showMainModalHandler}
                    borderd={true}
                    text={key("addEstateUnit")}
                  />
                </CheckPermissions>
              </div>
            </div>
            <Row className={styles.properties_row}>
              {selectedFilter === "compounds" && compounds
                ? renderProperties(
                    filteredCompounds,
                    fetchingCompounds,
                    "compound",
                    true,
                    true,
                    compounds?.data?.rentedEstatesCount
                  )
                : selectedFilter === "estates" && estates
                ? renderProperties(filteredEstates, fetchingEstates, "estate")
                : selectedFilter === "bookmarked" && bookmarked
                ? renderProperties(
                    filteredBookmarked,
                    fetchingBookmarked,
                    "estate"
                  )
                : null}
            </Row>
          </Container>
        </Col>
      </Row>

      {showModal && (
        <MainModal
          show={showModal}
          onHide={hideMainModalHandler}
          title={key("createPropOrCompound")}
          modalSize="lg"
        >
          <div className="d-flex justify-content-center align-items-center p-1 p-md-4">
            <CheckMySubscriptions
              name="allowedEstates"
              type="number"
              accountInfo={accountInfo}
            >
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["ADD_ESTATE"]}
              >
                <div
                  className={styles.add_prop_div}
                  onClick={() => showNextModal("estate")}
                >
                  <h5>{key("createProp")}</h5>
                  <p>{key("exProp")}</p>
                </div>
              </CheckPermissions>
            </CheckMySubscriptions>

            <CheckMySubscriptions
              name="allowedCompounds"
              type="number"
              accountInfo={accountInfo}
            >
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["ADD_COMPOUND"]}
              >
                <div
                  className={styles.add_prop_div}
                  onClick={() => showNextModal("compound")}
                >
                  <h5>{key("addCompound")}</h5>
                  <p>{key("exCompound")}</p>
                </div>
              </CheckPermissions>
            </CheckMySubscriptions>
          </div>
        </MainModal>
      )}

      {showAddCompoundModal && (
        <ModalForm show={showAddCompoundModal} onHide={hideAddCompoundHandler}>
          <AddCompound
            hideModal={hideAddCompoundHandler}
            refetch={refetchCompound}
          />
        </ModalForm>
      )}

      {showAddEstateModal && (
        <ModalForm show={showAddEstateModal} onHide={hideAddEstateHandler}>
          <AddEstate
            hideModal={hideAddEstateHandler}
            refetch={refetchEstatesAndCompounds}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Properties;
