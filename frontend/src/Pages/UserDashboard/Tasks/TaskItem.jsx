import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Tasks.module.css";
import {
  faCircle,
  faEdit,
  faSquareCheck,
  faTrashCan,
  faWrench,
  faBagShopping,
  faCircleQuestion,
  faCoins,
  faUser,
  faCouch,
} from "@fortawesome/free-solid-svg-icons";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import {
  faBuilding,
  faBell,
  faSquareCheck as regularCheck,
} from "@fortawesome/free-regular-svg-icons";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import UpdateTask from "./TaskForms/UpdateTask";
import { useCallback, useState } from "react";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { useSelector } from "react-redux";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { toast } from "react-toastify";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import { useQueryClient } from "@tanstack/react-query";
import useDeleteItem from "../../../hooks/useDeleteItem";

const TaskItem = ({ task, refetch, compId, propId }) => {
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [taskID, setTaskID] = useState("");
  const deleteItem = useDeleteItem();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const token = useSelector((state) => state.userInfo.token);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const queryClient = useQueryClient();

  let circleColor =
    task.priority === "high"
      ? "text-danger"
      : task.priority === "medium"
      ? "text-warning"
      : "text-success";

  const getTaskType = useCallback(() => {
    let iconType = faCircleQuestion;
    switch (task?.type) {
      case "reminder":
        iconType = faBell;
        break;
      case "purchases":
        iconType = faBagShopping;
        break;
      case "maintenance":
        iconType = faWrench;
        break;
      case "other":
        iconType = faCircleQuestion;
        break;
      default:
        break;
    }
    return iconType;
  }, [task?.type]);

  const deleteTask = async () => {
    const formData = {
      itemId: taskID,
      endPoint: `tasks`,
      refetch,
      hideModal: setShowDeleteModal(false),
    };
    await deleteItem(formData);
    if (compId || propId) {
      queryClient.invalidateQueries(["tasks", token]);
    }
  };

  const completeTask = async (taskId, isCompleted) => {
    const completedTask = isCompleted ? "false" : "true";

    if (taskId && token) {
      const res = await mainFormsHandlerTypeRaw({
        method: "patch",
        token: token,
        type: `tasks/${taskId}/complete`,
        formData: {
          isCompleted: completedTask,
        },
      });
      if (res.status === "success") {
        if (refetch) {
          refetch();
        }
        if (compId || propId) {
          queryClient.invalidateQueries(["tasks", token]);
        }
        if (isCompleted) {
          notifySuccess(key("unFinishedSucc"));
        } else {
          notifySuccess(key("finishedSucc"));
        }
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("wrong"));
    }
  };

  return (
    <>
      <Col md={6} xl={4}>
        <div className={styles.task_item}>
          <div className={`${isArLang ? styles.flags_ar : styles.flags_en}`}>
            <FontAwesomeIcon
              title={key(task.type)}
              className="mx-2 text-secondary"
              icon={getTaskType()}
            />
            <FontAwesomeIcon
              title={key(task.priority)}
              className={`${circleColor}`}
              icon={faCircle}
            />
          </div>

          <div className={styles.task_header}>
            <h5 className="mb-2">{task.title}</h5>
            <span>
              <FontAwesomeIcon icon={faUser} className="text-secondary" />{" "}
              {task.contact ? task.contact.name : key("public")}
            </span>
          </div>
          <hr />
          <h6>
            <FontAwesomeIcon
              icon={task?.compound ? faBuilding : faCouch}
              className="text-secondary"
            />{" "}
            {task.compound
              ? task.compound.name
              : task.estate?.name || key("public")}
          </h6>
          <p className={styles.desc}>
            {task.description ? task.description : "---"}
          </p>
          <hr className="w-50" />
          <div className={styles.controller}>
            <div>
              <span>
                <FontAwesomeIcon
                  icon={faCoins}
                  className={`${isArLang ? "ms-1" : "me-1"} color-main`}
                />{" "}
                {task.cost} {key("sarSmall")}
              </span>
            </div>
            <div>
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["DELETE_TASK"]}
              >
                <FontAwesomeIcon
                  title={key("delete")}
                  className="text-danger"
                  icon={faTrashCan}
                  onClick={() => {
                    setTaskID(task._id);
                    setShowDeleteModal(true);
                  }}
                />
              </CheckPermissions>
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["UPDATE_TASK"]}
              >
                <FontAwesomeIcon
                  onClick={() => {
                    setTaskData(task);
                    setShowUpdateTaskModal(true);
                  }}
                  title={key("ediet")}
                  icon={faEdit}
                />
              </CheckPermissions>
              <CheckPermissions
                profileInfo={profileInfo}
                btnActions={["COMPLETE_TASK"]}
              >
                <FontAwesomeIcon
                  onClick={() => completeTask(task._id, task.isCompleted)}
                  title={task.isCompleted ? key("unFinished") : key("done")}
                  className={`${
                    task.isCompleted ? "text-success" : "text-secondary"
                  }`}
                  icon={task.isCompleted ? faSquareCheck : regularCheck}
                />
              </CheckPermissions>
            </div>
          </div>
        </div>
      </Col>

      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteTask}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
      {showUpdateTaskModal && (
        <ModalForm
          show={showUpdateTaskModal}
          onHide={() => setShowUpdateTaskModal(false)}
          modalSize="lg"
        >
          <UpdateTask
            hideModal={() => setShowUpdateTaskModal(false)}
            refetch={refetch}
            task={taskData}
            compId={compId}
            propId={propId}
          />
        </ModalForm>
      )}
    </>
  );
};

export default TaskItem;
