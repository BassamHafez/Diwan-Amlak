import TaskContent from "../Tasks/TaskContent";
import { convertISoIntoDate } from "../../../Components/Logic/LogicFun";
import { Col } from "../../../shared/bootstrap";
import { useMemo, useTranslation } from "../../../shared/hooks";
import styles from "./UserHome.module.css";
import { useCallback } from "react";

const OverdueTasks = ({ myData, refetch, accountInfo }) => {
  const { t: key } = useTranslation();

  const today = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
  const overdueTasks = useMemo(
    () =>
      myData?.todayAndBeforeTasks?.filter(
        (task) => convertISoIntoDate(task?.date) < today
      ),
    [myData, today]
  );

  const todayTasks = useMemo(
    () =>
      myData?.todayAndBeforeTasks?.filter(
        (task) => convertISoIntoDate(task?.date) === today
      ),
    [myData, today]
  );

  const renderTasksContent = useCallback(
    (tasks) => {
      return (
        <TaskContent
          timeFilter="all"
          tagsFilter="all"
          typesFilter="all"
          tasks={tasks}
          refetch={refetch}
          isTasksAllowed={accountInfo?.account?.isTasksAllowed}
          accountInfo={accountInfo}
        />
      );
    },
    [accountInfo, refetch]
  );

  return (
    <>
      <Col sm={12}>
        <div className={styles.information_section}>
          <h4 className="fw-bold mb-4">{key("overdueTasks")}</h4>
          {renderTasksContent({ data: overdueTasks })}
        </div>
      </Col>
      <Col sm={12}>
        <div className={styles.information_section}>
          <h4 className="fw-bold mb-4">{key("todayTasks")}</h4>
          {renderTasksContent({ data: todayTasks })}
        </div>
      </Col>
    </>
  );
};

export default OverdueTasks;
