import { mainFormsHandlerTypeRaw } from "../util/Http";
import { useQuery, useMemo, useSelector } from "../shared/hooks";
import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";

const useContactsOptions = () => {
  const token = useSelector((state) => state.userInfo.token);

  const { data: landlords, refetch: refetchLandlord } = useQuery({
    queryKey: ["landlord", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/landlords",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const { data: brokers, refetch: refetchBroker } = useQuery({
    queryKey: ["brokers", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/brokers",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const landlordOptions = useMemo(() => {
    return convertTpOptionsFormate(landlords?.data) || [];
  }, [landlords]);

  const brokersOptions = useMemo(() => {
    return convertTpOptionsFormate(brokers?.data) || [];
  }, [brokers]);

  return { landlordOptions, brokersOptions, refetchBroker, refetchLandlord };
};

export default useContactsOptions;
