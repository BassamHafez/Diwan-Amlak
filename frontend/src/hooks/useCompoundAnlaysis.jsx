import { convertNumbersToFixedTwo } from "../Components/Logic/LogicFun";
import { useMemo } from "../shared/hooks";

const useCompoundAnlaysis = (compoundData) => {
  const {
    totalRevenue=0,
    totalPaidExpenses=0,
    totalPaidRevenues=0,
    totalMonthRevenue=0,
    totalMonthPaidRevenues=0,
    estates={},
    compound={},
  } = compoundData;

  const totalRev = Number(totalRevenue);
  const totalPaidEx = Number(totalPaidExpenses);
  const totalPaidRev = Number(totalPaidRevenues);
  const totalMonthRev = Number(totalMonthRevenue);
  const totalMonthPaidRev = Number(totalMonthPaidRevenues);

  const totalEstatesCount = estates?.length || compound?.estatesCount || 0;
  const commissionPercentage = Number(compound?.commissionPercentage|| 0);

  const theCommissionVal = useMemo(
    () => convertNumbersToFixedTwo(totalPaidRev * (commissionPercentage / 100)),
    [totalPaidRev, commissionPercentage]
  );

  const netIncomeVal = useMemo(
    () =>
      convertNumbersToFixedTwo(totalPaidRev - totalPaidEx - theCommissionVal) ||
      0,
    [totalPaidRev, totalPaidEx, theCommissionVal]
  );

  const collectionRatioVal = useMemo(
    () =>
      totalRev > 0
        ? convertNumbersToFixedTwo((totalPaidRev / totalRev) * 100)
        : 0,
    [totalPaidRev, totalRev]
  );

  const netReturnsVal = useMemo(
    () =>
      totalPaidRev > 0
        ? convertNumbersToFixedTwo((netIncomeVal / totalPaidRev) * 100)
        : 0,
    [totalPaidRev, netIncomeVal]
  );

  const rentedEstateCount = useMemo(() => {
    let rentedEstatesArr = [];

    if (compoundData) {
      rentedEstatesArr = compoundData?.estates?.filter(
        (estate) => estate.status === "rented"
      );
      const myrentedEstateCount = rentedEstatesArr?.length || 0;
      return myrentedEstateCount;
    }
  }, [compoundData]);

  return {
    theCommissionVal,
    commissionPercentage,
    netIncomeVal,
    netReturnsVal,
    collectionRatioVal,
    totalRev,
    totalPaidRev,
    totalPaidEx,
    totalMonthRev,
    totalMonthPaidRev,
    totalEstatesCount,
    rentedEstateCount,
  };
};

export default useCompoundAnlaysis;
