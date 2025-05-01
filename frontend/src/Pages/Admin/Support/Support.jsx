import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import {
  supportMessagesStatusOptions,
  supportTypeOptions,
} from "../../../Components/Logic/StaticLists";
import SupportItem from "./SupportItem";
import styles from "../Admin.module.css";
import { Select } from "../../../shared/index";
import {
  useState,
  useTranslation,
  useCallback,
  useMemo,
  useQuery,
  useSelector,
} from "../../../shared/hooks";
import {
  MainTitle,
  LoadingOne,
  NoData,
  SearchField,
} from "../../../shared/components";
import { Row } from "../../../shared/bootstrap";

const Support = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typesFilter, setTypesFilter] = useState("");
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";

  const {
    data: messages,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["allSupportMessages", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "support/messages",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filterChangeHandler = useCallback((val, isTypeFilter) => {
    const myVal = val ? val : "";
    if (isTypeFilter) {
      setTypesFilter(myVal);
    } else {
      setStatusFilter(myVal);
    }
  }, []);

  const filteredData = useMemo(() => {
    if (!messages || !Array.isArray(messages?.data)) return [];
    return messages.data.filter(
      (msg) =>
        (!searchFilter ||
          msg?.name
            .trim()
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase()) ||
          msg?.email
            .trim()
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase())) &&
        (!statusFilter || msg.status.trim() === statusFilter.trim()) &&
        (!typesFilter || msg.subject.trim() === typesFilter.trim())
    );
  }, [messages, searchFilter, statusFilter, typesFilter]);

  return (
    <div className="admin_body height_container position-relative p-2">
      {(!messages || isFetching) && <LoadingOne />}
      <div className="my-4">
        <MainTitle title={key("messages")} />
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap position-relative my-3 p-2">
        <div>
          <SearchField
            className="my-2"
            onSearch={onSearch}
            text={key("searchMessages")}
          />
        </div>
        <div className="d-flex align-items-center flex-wrap">
          <Select
            options={supportTypeOptions[currentLang]}
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
          <Select
            options={supportMessagesStatusOptions[currentLang]}
            onChange={(val) => filterChangeHandler(val ? val.value : null)}
            className={`${isArLang ? "text-end" : "text-start"} m-2 ${
              styles.select_type
            }`}
            isRtl={isArLang ? true : false}
            placeholder={key("status")}
            isClearable
          />
        </div>
      </div>
      <Row className="g-3 px-md-5">
        {filteredData?.length > 0 ? (
          filteredData?.map((msg) => (
            <SupportItem key={msg._id} msgData={msg} refetch={refetch} />
          ))
        ) : (
          <NoData text={key("noMsgs")} type={"support"} />
        )}
      </Row>
    </div>
  );
};

export default Support;
