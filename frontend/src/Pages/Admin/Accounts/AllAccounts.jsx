import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import AccountItem from "./AccountItem";
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
} from "../../../shared/components";
import { Row } from "../../../shared/bootstrap";
import { Select } from "../../../shared/index";
import { AccountsTypeOptions } from "../../../Components/Logic/StaticLists";
import styles from "../Admin.module.css";

const AllAccounts = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [typesFilter, setTypesFilter] = useState("");
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";

  const {
    data: accounts,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allAccounts", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "accounts",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filterChangeHandler = useCallback((val) => {
    setTypesFilter(val ? val : "");
  }, []);

  const cleanAccountData = useMemo(() => {
    if (accounts && Array.isArray(accounts?.data)) {
      return accounts.data.filter((acc) => acc.owner && acc.name);
    }
    return [];
  }, [accounts]);

  const filteredData = useMemo(() => {
    return cleanAccountData.filter(
      (acc) =>
        (!searchFilter ||
          acc.name
            .trim()
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase()) ||
          acc.phone.includes(searchFilter) ||
          acc._id.includes(searchFilter)) &&
        (!typesFilter || acc.isVIP)
    );
  }, [cleanAccountData, searchFilter, typesFilter]);

  return (
    <div className="admin_body height_container p-2 position-relative">
      {(!accounts || isFetching) && <LoadingOne />}
      <div className="my-4">
        <MainTitle title={key("accounts")} />
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="m-2">
          <SearchField onSearch={onSearch} text={key("searchAccounts")} />
        </div>
        <div className="m-2">
          <Select
            options={AccountsTypeOptions[currentLang]}
            onChange={(val) =>
              filterChangeHandler(val ? val.value : null, true)
            }
            className={`${isArLang ? "text-end" : "text-start"} m-2 ${
              styles.select_type
            }`}
            isRtl={isArLang ? true : false}
            placeholder={key("type")}
            isClearable
          />
        </div>
      </div>
      <Row className="g-3">
        {filteredData?.length > 0 ? (
          filteredData?.map(
            (acc) =>
              acc.owner &&
              acc.name && (
                <AccountItem key={acc._id} acc={acc} refetch={refetch} />
              )
          )
        ) : (
          <NoData text={key("noAccounts")} />
        )}
      </Row>
    </div>
  );
};

export default AllAccounts;
