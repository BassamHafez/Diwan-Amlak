import {mainFormsHandlerTypeRaw } from "../../../util/Http";
import UserItem from "../Users/UserItem";
import AddAdmin from "./AdminsForm/AddAdmin";
import {
  useState,
  useTranslation,
  useCallback,
  useMemo,
  useQuery,
  useSelector,
} from "../../../shared/hooks";
import {
  SearchField,
  NoData,
  MainTitle,
  LoadingOne,
  ButtonOne,
  ModalForm,
} from "../../../shared/components";
import { Row } from "../../../shared/bootstrap";

const AllAdmins = () => {
  const [showAddPackModal, setShowAddPackModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();

  const {
    data: users,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allAdmins", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "users?role=admin",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filteredData = useMemo(() => {
    if (!users || !Array.isArray(users?.data)) return [];
    return users?.data?.filter(
      (user) =>
        !searchFilter ||
        user.name
          .trim()
          .toLowerCase()
          .includes(searchFilter.trim().toLowerCase()) ||
        user.phone.includes(searchFilter)
    );
  }, [users, searchFilter]);

  const hideAddPackModalHandler = useCallback(() => {
    setShowAddPackModal(false);
  }, []);

  const showAddPackModalHandler = useCallback(() => {
    setShowAddPackModal(true);
  }, []);

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {(!users || isFetching) && <LoadingOne />}
        <div className="my-3">
          <MainTitle title={key("admins")} />
        </div>
        <div className="d-flex justify-content-between position-relative my-1 p-2">
          <div className="my-2">
            <SearchField onSearch={onSearch} text={key("searchContacts")} />
          </div>
          <ButtonOne
            onClick={showAddPackModalHandler}
            borderd={true}
            text={key("addAdmin")}
            classes="my-2"
          />
        </div>
        <Row className="g-3">
          {filteredData?.length > 0 ? (
            filteredData?.map((user) => (
              <UserItem
                key={user._id}
                userData={user}
                refetch={refetch}
                isAdminPage={true}
              />
            ))
          ) : (
            <NoData text={"noResults"} />
          )}
        </Row>
      </div>
      {showAddPackModal && (
        <ModalForm
          show={showAddPackModal}
          onHide={hideAddPackModalHandler}
          modalSize="lg"
        >
          <AddAdmin hideModal={hideAddPackModalHandler} refetch={refetch} />
        </ModalForm>
      )}
    </>
  );
};

export default AllAdmins;
