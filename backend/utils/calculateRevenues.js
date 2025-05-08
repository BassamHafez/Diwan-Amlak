const { addMonths, differenceInMonths, format } = require("date-fns");

const calculateRevenues = (contract) => {
  const revenues = [];
  const start = new Date(contract.startDate);
  const end = new Date(contract.endDate);
  const unitMultipliers = {
    day: 1,
    week: 7,
    month: 30,
  };

  if (
    !contract.paymentPeriodUnit ||
    (contract.paymentPeriodUnit !== "year" &&
      !unitMultipliers[contract.paymentPeriodUnit])
  ) {
    console.log(contract.paymentPeriodUnit);
    console.error(
      "Invalid contract.paymentPeriodUnit. Use 'day', 'week', 'month', or 'year'"
    );
    throw new Error(
      "Invalid contract.paymentPeriodUnit. Use 'day', 'week', 'month', or 'year'."
    );
    // return [];
  }

  if (contract.paymentPeriodUnit === "year") {
    const intervalYears = contract.paymentPeriodValue || 1;
    const totalIntervals = Math.ceil(
      (end.getFullYear() - start.getFullYear() + 1) / intervalYears
    );
    const baseAmount = Math.floor(contract.totalAmount / totalIntervals);
    let remainingAmount = contract.totalAmount - baseAmount * totalIntervals;

    let currentDate = new Date(start);

    for (let i = 0; i < totalIntervals; i++) {
      let amount = baseAmount;
      if (remainingAmount > 0) {
        amount++;
        remainingAmount--;
      }

      revenues.push({
        amount,
        dueDate: format(currentDate, "yyyy-MM-dd"),
        contract: contract._id,
        tenant: contract.tenant,
        estate: contract.estate,
        account: contract.account,
        compound: contract.compound || null,
        landlord: contract.landlord || null,
      });

      currentDate = addYears(currentDate, intervalYears);
    }

    return revenues;
  } else if (contract.paymentPeriodUnit === "month") {
    const intervalMonths = contract.paymentPeriodValue || 1;
    const totalMonths = differenceInMonths(end, start);
    const totalIntervals = Math.ceil(totalMonths / intervalMonths);
    const baseAmount = Math.floor(contract.totalAmount / totalIntervals);
    let remainingAmount = contract.totalAmount - baseAmount * totalIntervals;

    let currentDate = new Date(start);

    for (let i = 0; i < totalIntervals; i++) {
      let amount = baseAmount;
      if (remainingAmount > 0) {
        amount++;
        remainingAmount--;
      }

      revenues.push({
        amount,
        dueDate: format(currentDate, "yyyy-MM-dd"),
        contract: contract._id,
        tenant: contract.tenant,
        estate: contract.estate,
        account: contract.account,
        compound: contract.compound || null,
        landlord: contract.landlord || null,
      });

      currentDate = addMonths(currentDate, intervalMonths);
    }

    return revenues;
  } else {
    const intervalInDays =
      contract.paymentPeriodValue * unitMultipliers[contract.paymentPeriodUnit];

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const numIntervals = Math.ceil(totalDays / intervalInDays);

    const baseAmount = Math.floor(contract.totalAmount / numIntervals);
    let remainingAmount = contract.totalAmount - baseAmount * numIntervals;

    let currentDate = new Date(start);
    for (let i = 0; i < numIntervals; i++) {
      let amount = baseAmount;
      if (remainingAmount > 0) {
        amount++;
        remainingAmount--;
      }

      revenues.push({
        amount,
        dueDate: format(currentDate, "yyyy-MM-dd"),
        contract: contract._id,
        tenant: contract.tenant,
        estate: contract.estate,
        account: contract.account,
        compound: contract.compound || null,
        landlord: contract.landlord || null,
      });

      currentDate.setDate(currentDate.getDate() + intervalInDays);
    }

    return revenues;
  }
};

module.exports = calculateRevenues;
