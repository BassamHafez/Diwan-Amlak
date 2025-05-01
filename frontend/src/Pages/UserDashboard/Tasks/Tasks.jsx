import styles from "./Tasks.module.css";
import TaskContent from "./TaskContent";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { FontAwesomeIcon } from "../../../shared/index";
import {
  useSelector,
  useQuery,
  useState,
  useTranslation,
} from "../../../shared/hooks";
import {
  faBagShopping,
  faCheckDouble,
  faCircle,
  faCircleQuestion,
  faClockRotateLeft,
  faCubes,
  faTag,
  faWrench,
  faBell,
  faClipboard,
  faClock,
} from "../../../shared/constants";
import { Row, Col } from "../../../shared/bootstrap";
import { CheckMySubscriptions } from "../../../shared/components";

const Tasks = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [tagsFilter, setTagsFilter] = useState("all");
  const [typesFilter, setTypesFilter] = useState("all");
  const token = useSelector((state) => state.userInfo.token);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const isTasksAllowed = accountInfo?.account?.isTasksAllowed;

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  let iconClass = isArLang ? "ms-2" : "me-2";

  const { data: tasks, refetch } = useQuery({
    queryKey: ["tasks", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "tasks",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!isTasksAllowed && !!token,
  });

  return (
    <>
      <div className={`${styles.main_container} height_container`}>
        <Row style={{ minHeight: "65vh" }}>
          <Col sm={4} lg={3} xl={2} className="p-0">
            <div className={styles.filter_side}>
              <CheckMySubscriptions
                name="isTasksAllowed"
                accountInfo={accountInfo}
              >
                <div className="small_filter">
                  <h6>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faClockRotateLeft}
                    />
                    {key("time")}
                  </h6>
                  <ul className={styles.filter_list}>
                    <li
                      className={timeFilter === "all" ? styles.active : ""}
                      onClick={() => setTimeFilter("all")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faClipboard}
                      />
                      {key("all")}
                    </li>
                    <li
                      className={timeFilter === "underway" ? styles.active : ""}
                      onClick={() => setTimeFilter("underway")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faClock}
                      />
                      {key("underway")}
                    </li>
                    <li
                      className={timeFilter === "finished" ? styles.active : ""}
                      onClick={() => setTimeFilter("finished")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass} text-success`}
                        icon={faCheckDouble}
                      />
                      {key("finished")}
                    </li>
                  </ul>

                  <hr />
                  <h6>
                    <FontAwesomeIcon className={`${iconClass}`} icon={faTag} />
                    {key("priority")}
                  </h6>
                  <ul className={styles.filter_list}>
                    <li
                      className={tagsFilter === "all" ? styles.active : ""}
                      onClick={() => setTagsFilter("all")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faClipboard}
                      />
                      {key("all")}
                    </li>
                    <li
                      className={tagsFilter === "low" ? styles.active : ""}
                      onClick={() => setTagsFilter("low")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass} text-success ${styles.cirlce_color}`}
                        icon={faCircle}
                      />
                      {key("low")}
                    </li>
                    <li
                      className={tagsFilter === "mid" ? styles.active : ""}
                      onClick={() => setTagsFilter("medium")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass} text-warning ${styles.cirlce_color}`}
                        icon={faCircle}
                      />
                      {key("mid")}
                    </li>
                    <li
                      className={tagsFilter === "high" ? styles.active : ""}
                      onClick={() => setTagsFilter("high")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass} text-danger ${styles.cirlce_color}`}
                        icon={faCircle}
                      />
                      {key("high")}
                    </li>
                  </ul>

                  <hr />
                  <h6>
                    <FontAwesomeIcon
                      className={`${iconClass}`}
                      icon={faCubes}
                    />
                    {key("type")}
                  </h6>
                  <ul className={styles.filter_list}>
                    <li
                      className={typesFilter === "all" ? styles.active : ""}
                      onClick={() => setTypesFilter("all")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faClipboard}
                      />
                      {key("all")}
                    </li>
                    <li
                      className={
                        typesFilter === "maintenance" ? styles.active : ""
                      }
                      onClick={() => setTypesFilter("maintenance")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faWrench}
                      />
                      {key("maintenance")}
                    </li>
                    <li
                      className={
                        typesFilter === "purchases" ? styles.active : ""
                      }
                      onClick={() => setTypesFilter("purchases")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faBagShopping}
                      />
                      {key("purchases")}
                    </li>
                    <li
                      className={
                        typesFilter === "reminder" ? styles.active : ""
                      }
                      onClick={() => setTypesFilter("reminder")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faBell}
                      />
                      {key("reminder")}
                    </li>
                    <li
                      className={typesFilter === "other" ? styles.active : ""}
                      onClick={() => setTypesFilter("other")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faCircleQuestion}
                      />
                      {key("other")}
                    </li>
                  </ul>
                </div>
              </CheckMySubscriptions>
            </div>
          </Col>

          <Col sm={8} lg={9} xl={10}>
            <TaskContent
              timeFilter={timeFilter}
              tagsFilter={tagsFilter}
              typesFilter={typesFilter}
              tasks={tasks}
              isTasksAllowed={isTasksAllowed}
              accountInfo={accountInfo}
              refetch={refetch}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Tasks;
