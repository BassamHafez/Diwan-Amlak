import { convertTpOptionsFormate } from "../Components/Logic/LogicFun";
import { useQuery, useMemo, useSelector } from "../shared/hooks";
import { mainFormsHandlerTypeRaw } from "../util/Http";

const useTenantsOptions = () => {
  const token = useSelector((state) => state.userInfo.token);

  const { data: tenants, refetch: refetchTenants } = useQuery({
    queryKey: ["tenant", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "contacts/tenants",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const tenantsOptions = useMemo(() => {
    return convertTpOptionsFormate(tenants?.data) || [];
  }, [tenants]);

  return { tenantsOptions, refetchTenants };
};

export default useTenantsOptions;
