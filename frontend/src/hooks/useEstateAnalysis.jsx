import { convertNumbersToFixedTwo } from "../Components/Logic/LogicFun";
import { useMemo } from "../shared/hooks";

const useEstateAnalysis = (estateData) => {
  const {
    totalRevenue = 0,
    totalPaidRevenues = 0,
    totalPendingRevenues = 0,
    totalExpense = 0,
    totalPaidExpenses = 0,
    estate = {},
  } = estateData;

  const totalRev = Number(totalRevenue);
  const totalPaidRev = Number(totalPaidRevenues);
  const totalPendingRev = Number(totalPendingRevenues);
  const totalEx = Number(totalExpense);
  const totalPaidEx = Number(totalPaidExpenses);
  const commissionPercentage = Number(estate?.commissionPercentage || 0);
  const estatePrice = Number(estate?.price || 0);
  const area = Number(estate?.area || 0);
  const operatingRatio = convertNumbersToFixedTwo(commissionPercentage);

  const theCommissionVal = useMemo(() => {
    return totalPaidRev * (commissionPercentage / 100);
  }, [totalPaidRev, commissionPercentage]);

  const totalUnPaidCosts = useMemo(() => {
    return convertNumbersToFixedTwo(totalEx - totalPaidEx);
  }, [totalEx, totalPaidEx]);

  const collectionRatio = useMemo(() => {
    return totalRev
      ? convertNumbersToFixedTwo((totalPaidRev / totalRev) * 100)
      : 0;
  }, [totalPaidRev, totalRev]);

  const grandReturns = useMemo(() => {
    return estatePrice
      ? convertNumbersToFixedTwo((totalPaidRev / estatePrice) * 100)
      : 0;
  }, [estatePrice, totalPaidRev]);

  const netReturns = useMemo(() => {
    return estatePrice
      ? convertNumbersToFixedTwo(
          ((totalPaidRev - totalPaidEx - theCommissionVal) /
            Number(estatePrice)) *
            100
        )
      : 0;
  }, [totalPaidRev, totalPaidEx, theCommissionVal, estatePrice]);

  return {
    totalPaidRev,
    totalPendingRev,
    totalPaidEx,
    totalUnPaidCosts,
    collectionRatio,
    grandReturns,
    netReturns,
    area,
    operatingRatio,
  };
};

export default useEstateAnalysis;
