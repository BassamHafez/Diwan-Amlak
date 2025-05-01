import { mainFormsHandlerTypeRaw } from "../util/Http";
import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";
import { useQuery, useMemo, useSelector } from "../shared/hooks";

const useServicesContact = () => {
  const token = useSelector((state) => state.userInfo.token);

  const { data: services, refetch: refetchServices } = useQuery({
    queryKey: ["service", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/services",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const servicesOptions = useMemo(() => {
    return convertTpOptionsFormate(services?.data) || [];
  }, [services]);

  return { servicesOptions, refetchServices };
};

export default useServicesContact;
