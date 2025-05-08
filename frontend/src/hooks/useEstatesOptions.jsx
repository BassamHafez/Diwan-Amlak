import { mainFormsHandlerTypeRaw } from "../util/Http";
import { useQuery, useMemo, useSelector } from "../shared/hooks";
import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";

const useEstatesOptions = () => {
  const token = useSelector((state) => state.userInfo.token);

  const { data: estates } = useQuery({
    queryKey: ["estates", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "estates",
        token: token,
        isLimited: true,
      }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const estatesOptions = useMemo(() => {
    return convertTpOptionsFormate(estates?.data) || [];
  }, [estates]);

  return estatesOptions;
};

export default useEstatesOptions;
