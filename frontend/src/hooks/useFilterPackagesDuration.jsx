import { useQuery } from "@tanstack/react-query";
import { getPublicData } from "../util/Http";
import { useCallback, useMemo } from "react";

const useFilterPackagesDuration = () => {
  const {
    data: packages,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allPackages"],
    queryFn: () => getPublicData({type: "packages"}),
    staleTime: Infinity,
  });

  const filterPackagesByDuration = useCallback(
    (duration) => packages?.data?.filter((pack) => pack.duration === duration),
    [packages?.data]
  );

  const monthlyPackages = useMemo(
    () => filterPackagesByDuration(1),
    [filterPackagesByDuration]
  );
  const threeMonthsPackage = useMemo(
    () => filterPackagesByDuration(3),
    [filterPackagesByDuration]
  );
  const sixMonthsPackage = useMemo(
    () => filterPackagesByDuration(6),
    [filterPackagesByDuration]
  );
  const yearlyPackage = useMemo(
    () => filterPackagesByDuration(12),
    [filterPackagesByDuration]
  );

  return {
    monthlyPackages,
    threeMonthsPackage,
    sixMonthsPackage,
    yearlyPackage,
    packages,
    refetch,
    isFetching,
  };
};

export default useFilterPackagesDuration;
