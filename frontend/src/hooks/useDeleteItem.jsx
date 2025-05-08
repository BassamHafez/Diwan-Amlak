import { useCallback } from "react";
import { useSelector, useTranslation } from "../shared/hooks";
import { mainDeleteFunHandler } from "../util/Http";
import { toast } from "react-toastify";

const useDeleteItem = () => {
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const deleteItem = useCallback(
    async ({ itemId, endPoint, refetch, refetchDetails, hideModal }) => {
      if (itemId && token) {
        const res = await mainDeleteFunHandler({
          id: itemId,
          token: token,
          type: endPoint,
        });
        if (res.status === 204 || res.status === 200) {
          if (refetch) {
            refetch();
          }
          if (refetchDetails) {
            refetchDetails();
          }
          if (hideModal) {
            hideModal();
          }
          notifySuccess(key("deletedSucc"));
          return "success";
        } else {
          notifyError(key("wrong"));
        }
      } else {
        notifyError(key("deleteWrong"));
      }
    },
    [key, token]
  );

  return deleteItem;
};

export default useDeleteItem;
