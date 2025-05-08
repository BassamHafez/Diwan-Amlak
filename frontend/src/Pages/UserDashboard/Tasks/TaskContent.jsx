import NoData from "../../../Components/UI/Blocks/NoData";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import TaskItem from "./TaskItem";
import SearchField from "../../../Components/Search/SearchField";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { memo, useCallback, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddTask from "./TaskForms/AddTask";
import styles from "./Tasks.module.css";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import { useSelector } from "react-redux";
import {
  CheckMySubscriptions,
  CheckSubscriptionRender,
} from "../../../shared/components";

const TaskContent = memo(
  ({
    timeFilter,
    tagsFilter,
    typesFilter,
    tasks,
    refetch,
    propId,
    compId,
    isTasksAllowed,
    accountInfo,
  }) => {
    const [searchFilter, setSearchFilter] = useState("");
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const { t: key } = useTranslation();
    const profileInfo = useSelector((state) => state.profileInfo.data);

    let isArLang = localStorage.getItem("i18nextLng") === "ar";

    const onSearch = useCallback((searchInput) => {
      setSearchFilter(searchInput);
    }, []);

    const filteredTasks =
      tasks && Array.isArray(tasks.data)
        ? tasks.data.filter((task) => {
            const matchesTitle = task.title
              .toLowerCase()
              .includes(searchFilter.toLowerCase());

            const matchesEstate =
              task.estate &&
              task.estate.name
                .toLowerCase()
                .includes(searchFilter.toLowerCase());

            const matchesCompound =
              task.compound &&
              task.compound.name
                .toLowerCase()
                .includes(searchFilter.toLowerCase());

            return (
              (timeFilter === "all"
                ? true
                : timeFilter === "underway"
                ? !task.isCompleted
                : task.isCompleted) &&
              (tagsFilter === "all" ? true : task.priority === tagsFilter) &&
              (typesFilter === "all" ? true : task.type === typesFilter) &&
              (matchesTitle || matchesEstate || matchesCompound)
            );
          })
        : [];

    return (
      <>
        <div className={`${styles.tasks_content} position-relative`}>
          {isTasksAllowed === undefined && <LoadingOne />}
          <div
            className="d-flex justify-content-between align-items-center flex-wrap"
            style={{ height: "fit-content" }}
          >
            <div className="my-1">
              <CheckMySubscriptions
                name="isTasksAllowed"
                accountInfo={accountInfo}
              >
                <SearchField
                  onSearch={onSearch}
                  text={
                    compId || propId ? key("searchTitle") : key("searchTasks")
                  }
                />
              </CheckMySubscriptions>
            </div>

            <CheckMySubscriptions
              name="isTasksAllowed"
              accountInfo={accountInfo}
            >
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["ADD_TASK"]}
              >
                <div className={`${isArLang ? "me-auto" : "ms-auto"} my-1`}>
                  <ButtonOne
                    onClick={() => setShowAddTaskModal(true)}
                    text={`${key("add")} ${key("task")}`}
                    borderd={true}
                  />
                </div>
              </CheckPermissions>
            </CheckMySubscriptions>
          </div>
          <CheckSubscriptionRender
            name="isTasksAllowed"
            accountData={accountInfo?.account}
          >
            <Row
              className="mt-3 gy-3 position-relative"
              style={{ minHeight: "50vh" }}
            >
              {tasks ? (
                filteredTasks?.length > 0 ? (
                  filteredTasks?.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      refetch={refetch}
                      compId={compId}
                      propId={propId}
                    />
                  ))
                ) : (
                  <NoData
                    type="tasks"
                    verySmallSize={true}
                    text={key("noTasks")}
                  />
                )
              ) : (
                <LoadingOne />
              )}
            </Row>
          </CheckSubscriptionRender>
        </div>
        {showAddTaskModal && (
          <ModalForm
            show={showAddTaskModal}
            onHide={() => setShowAddTaskModal(false)}
            modalSize="lg"
          >
            <AddTask
              hideModal={() => setShowAddTaskModal(false)}
              refetch={refetch}
              compId={compId}
              propId={propId}
            />
          </ModalForm>
        )}
      </>
    );
  }
);

TaskContent.displayName = "TaskContent";
export default TaskContent;
