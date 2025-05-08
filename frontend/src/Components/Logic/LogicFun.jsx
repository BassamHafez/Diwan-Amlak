import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import VerifyPhoneAlert from "../VerifyPhone/VerifyPhoneAlert";
import { toast } from "react-toastify";
import { mainAlertTime } from "./StaticLists";
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  addMonths,
  addYears,
  differenceInMonths,
  format,
  differenceInCalendarYears,
} from "date-fns";

// main func
const notifyAlert = () =>
  toast.warn(<VerifyPhoneAlert isModalAlert={true} />, {
    autoClose: false,
    draggable: true,
    position: "top-right",
  });

export const cleanUpData = (data) => {
  if (!data) {
    return;
  }
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== "")
  );
};
export const showPhoneAlertNotification = () => {
  const lastNotificationTime = localStorage.getItem("lastNotificationTime");
  const currentTime = new Date().getTime();

  if (
    !lastNotificationTime ||
    currentTime - lastNotificationTime >= mainAlertTime
  ) {
    notifyAlert();
    localStorage.setItem("lastNotificationTime", currentTime.toString());
  }
};

export const formattedDate = (date) => {
  const parsedDate = new Date(date);
  if (!date || isNaN(parsedDate)) {
    return "-";
  }
  return parsedDate.toISOString().split("T")[0];
};

export const convertISoIntoDate = (date) => {
  const myDate = new Date(date);
  return myDate.setHours(0, 0, 0, 0);
};

export const convertTpOptionsFormate = (arr) => {
  let arrOptions = [];
  if (arr?.length > 0) {
    arrOptions = arr.map((val) => {
      return { label: val.name, value: val._id };
    });
  }
  return arrOptions;
};

export const convertNumbersToFixedTwo = (num) => {
  if (!num || !isFinite(num) || isNaN(num)) {
    return 0;
  }
  return Number.isInteger(num) ? num : Number(num).toFixed(2);
};

export const checkAccountFeatures = (accInfo, value) => {
  const feature = accInfo[value];
  return typeof feature === "number" ? feature > 0 : Boolean(feature);
};

const notifyError = () =>
  toast(
    "Un Available Feature in your package!! - !!هذه الميزة غير متاحة في باقتك الحالية"
  );

export const handleDownloadExcelSheet = (
  data,
  name,
  title,
  isFilesExtractAllowed
) => {
  if (isFilesExtractAllowed === false) {
    notifyError();
    return;
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, `${title}`);

  XLSX.writeFile(wb, `${name}`);
};

export const generatePDF = (id, name, isFilesExtractAllowed) => {
  if (isFilesExtractAllowed === false) {
    notifyError();
    return;
  }
  const element = document.getElementById(`${id}`);
  const options = {
    margin: [10, 0, 10, 0],
    filename: name ? name : "file",
    html2canvas: { scale: 4 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf(element, options);
};

export const filterAndRenameKeys = (
  data,
  keysToKeepAndRename,
  nestedObjects
) => {
  return data?.map((item) => {
    const filteredItem = {};

    // Process nested objects
    nestedObjects.forEach((nestedObj) => {
      if (item[nestedObj]) {
        const nestedData = item[nestedObj];
        for (const [oldKey, newKey] of Object.entries(keysToKeepAndRename)) {
          const [objName, key] = oldKey.split("."); // Split nested object and key
          if (objName === nestedObj && key in nestedData) {
            filteredItem[newKey] = nestedData[key];
          }
        }
      }
    });

    // Process top-level keys
    for (const [oldKey, newKey] of Object.entries(keysToKeepAndRename)) {
      if (!oldKey.includes(".") && oldKey in item) {
        filteredItem[newKey] = item[oldKey];
      }
    }

    return filteredItem;
  });
};

// estates
const estateStatus = {
  en: {
    available: "Available",
    pending: "Pending",
    rented: "Rented",
  },
  ar: {
    available: "شاغرة",
    pending: "معلقة",
    rented: "مؤجرة",
  },
};

export const renamedEstateStatus = (type, language) => {
  const mappings = estateStatus[language];
  return mappings?.[type] || "";
};

//compounds
export const calculateRentedPercentage = (rented, total) => {
  if (!rented || total === 0 || rented === 0) {
    return 0;
  }
  const percentage = (rented / total) * 100;
  if (!percentage || !isFinite(percentage) || isNaN(percentage)) {
    return 0;
  }
  return Number.isInteger(percentage) ? percentage : percentage.toFixed(1) || 0;
};

//contact func
const contactTypeMappings = {
  en: {
    broker: "Agent",
    tenant: "Tenant",
    landlord: "Landlord",
    service: "Service",
  },
  ar: {
    broker: "وسيط",
    tenant: "مستأجر",
    landlord: "مالك",
    service: "مزود خدمة",
  },
};

export const renameContactType = (type, language) => {
  const mappings = contactTypeMappings[language];
  return mappings?.[type] || "";
};

export const formatPhoneNumber = (phone) => {
  if (!phone) {
    return undefined;
  }
  const countryCode = "+966";
  if (phone.startsWith("0") && phone.length === 10) {
    return `${countryCode}${phone.substring(1)}`;
  }
  return phone;
};

export const formatWhatsAppLink = (phone) => {
  if (!phone) {
    return undefined;
  }
  const countryCode = "966";
  if (phone.startsWith("0") && phone.length === 10) {
    phone = phone.substring(1);
  }
  return `https://wa.me/${countryCode}${phone}`;
};

//contract func
export const generatePeriodOptions = (
  unit,
  startDate,
  endDate,
  renamedUnit,
  pluralUnit,
  everyWord
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let values = [];
  switch (unit) {
    case "day": {
      const daysDifference = differenceInCalendarDays(end, start);
      values = [1, 2, 3, 7, 14, 30].filter((val) => val <= daysDifference);
      break;
    }
    case "week": {
      const daysDifference = differenceInCalendarDays(end, start);
      values = [1, 2, 4, 6, 8].filter((val) => val * 7 <= daysDifference);
      break;
    }
    case "month": {
      const monthsDifference = differenceInCalendarMonths(end, start);
      values = [1, 2, 3, 6, 12].filter((val) => val <= monthsDifference);
      break;
    }
    case "year": {
      const yearsDifference = differenceInCalendarYears(end, start);
      values = [1, 2, 5, 10].filter((val) => val <= yearsDifference);
      break;
    }
    default:
      values = [];
  }

  return values.map((val) => ({
    label: `${everyWord} ${val !== 1 ? `${val} ${pluralUnit}` : renamedUnit}`,
    value: val,
  }));
};

export const filterTimeUnitDpendsOnDaysDifference = (
  unitOptions,
  startDate,
  endDate,
  isArLang
) => {
  const daysDifference = differenceInCalendarDays(
    new Date(endDate),
    new Date(startDate)
  );
  const monthsDifference = differenceInCalendarMonths(
    new Date(endDate),
    new Date(startDate)
  );
  const yearsDifference = differenceInCalendarYears(
    new Date(endDate),
    new Date(startDate)
  );

  const filteredUnits = unitOptions[isArLang ? "ar" : "en"].filter((unit) => {
    switch (unit.value) {
      case "day":
        return daysDifference >= 1;
      case "week":
        return daysDifference >= 7;
      case "month":
        return monthsDifference >= 1;
      case "year":
        return yearsDifference >= 1;
      default:
        return false;
    }
  });

  return filteredUnits;
};

const contractStatus = {
  en: {
    active: "Active",
    upcoming: "Upcoming",
    canceled: "Canceled",
    completed: "Completed",
  },
  ar: {
    active: "ساري",
    upcoming: "قادم",
    canceled: "ملغي",
    completed: "مكتمل",
  },
};

export const renamedContractStatus = (type, language) => {
  const mappings = contractStatus[language];
  return mappings?.[type] || "";
};

export const getContractStatus = (isCanceled, startDate, endDate) => {
  if (isCanceled) return "canceled";

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const start = convertISoIntoDate(startDate);
  const end = convertISoIntoDate(endDate);

  if (currentDate < start) {
    return "upcoming";
  } else if (currentDate >= start && currentDate <= end) {
    return "active";
  } else if (currentDate > end) {
    return "completed";
  }

  return "unknown";
};

// revenues
export const calculateRevenues = (
  totalAmount,
  paymentPeriodValue,
  paymentPeriodUnit,
  startDate,
  endDate
) => {
  const revenues = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const unitMultipliers = {
    day: 1,
    week: 7,
    month: 30,
  };

  if (
    !paymentPeriodUnit ||
    (paymentPeriodUnit !== "year" && !unitMultipliers[paymentPeriodUnit])
  ) {
    return [];
  }

  if (paymentPeriodUnit === "year") {
    const intervalYears = paymentPeriodValue || 1;
    const totalIntervals = Math.ceil(
      (end.getFullYear() - start.getFullYear() + 1) / intervalYears
    );
    const baseAmount = Math.floor(totalAmount / totalIntervals);
    let remainingAmount = totalAmount - baseAmount * totalIntervals;

    let currentDate = new Date(start);

    for (let i = 0; i < totalIntervals; i++) {
      let amount = baseAmount;
      if (remainingAmount > 0) {
        amount++;
        remainingAmount--;
      }

      revenues.push({
        amount: amount,
        dueDate: format(currentDate, "yyyy-MM-dd"),
      });

      currentDate = addYears(currentDate, intervalYears);
    }

    return revenues;
  } else if (paymentPeriodUnit === "month") {
    const intervalMonths = paymentPeriodValue || 1;
    const totalMonths = differenceInMonths(end, start);
    const totalIntervals = Math.ceil(totalMonths / intervalMonths);
    const baseAmount = Math.floor(totalAmount / totalIntervals);
    let remainingAmount = totalAmount - baseAmount * totalIntervals;

    let currentDate = new Date(start);

    for (let i = 0; i < totalIntervals; i++) {
      let amount = baseAmount;
      if (remainingAmount > 0) {
        amount++;
        remainingAmount--;
      }

      revenues.push({
        amount: amount,
        dueDate: format(currentDate, "yyyy-MM-dd"),
      });

      currentDate = addMonths(currentDate, intervalMonths);
    }

    return revenues;
  } else {
    const intervalInDays =
      paymentPeriodValue * unitMultipliers[paymentPeriodUnit];

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const numIntervals = Math.ceil(totalDays / intervalInDays);

    const baseAmount = Math.floor(totalAmount / numIntervals);
    let remainingAmount = totalAmount - baseAmount * numIntervals;

    let currentDate = new Date(start);
    for (let i = 0; i < numIntervals; i++) {
      let amount = baseAmount;
      if (remainingAmount > 0) {
        amount++;
        remainingAmount--;
      }

      revenues.push({
        amount: amount,
        dueDate: format(currentDate, "yyyy-MM-dd"),
      });

      currentDate.setDate(currentDate.getDate() + intervalInDays);
    }

    return revenues;
  }
};

const revenuesStatus = {
  en: {
    pending: "pending",
    canceled: "canceled",
    paid: "paid",
  },
  ar: {
    pending: "معلق",
    canceled: "ملغي",
    paid: "مدفوع",
  },
};

export const renamedRevenuesStatus = (type, language) => {
  const mappings = revenuesStatus[language];
  return mappings?.[type] || "";
};
const paymentMethod = {
  en: {
    cash: "Cash",
    "bank-transfer": "Bank transfer",
    online: "Online",
  },
  ar: {
    cash: "كاش",
    "bank-transfer": "حوالة بنكية",
    online: "أونلاين",
  },
};

export const renamedPaymentMethod = (type, language) => {
  const mappings = paymentMethod[language];
  return mappings?.[type] || "";
};

export const calculatePeriod = (startDate, endDate, isArLang) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);

  const weeks = Math.floor(totalDays / 7);
  const days = totalDays;

  if (years >= 1) {
    return isArLang ? `${years} سنة` : `${years} year${years > 1 ? "s" : ""}`;
  } else if (months >= 1) {
    return isArLang
      ? `${months} شهر`
      : `${months} month${months > 1 ? "s" : ""}`;
  } else if (weeks >= 1) {
    return isArLang ? `${weeks} أسبوع` : `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else {
    return isArLang ? `${days} يوم` : `${days} day${days > 1 ? "s" : ""}`;
  }
};

export const revenueTypes = {
  en: {
    day: "daily",
    week: "weekly",
    month: "monthly",
    year: "annual",
  },
  ar: {
    day: "يومي",
    week: "أسبوعي",
    month: "شهري",
    year: "سنوي",
  },
};

export const renamedRevenuesType = (type, language) => {
  const mappings = revenueTypes[language];
  return mappings?.[type] || "";
};

//expenses
export const expensesStatusOptions = {
  en: {
    pending: "Pending",
    paid: "Paid",
    cancelled: "Cancelled",
  },
  ar: {
    pending: "معلقة",
    paid: "مدفوعة",
    cancelled: "ملغية",
  },
};

export const renamedExpensesStatusMethod = (type, language) => {
  const mappings = expensesStatusOptions[language];
  return mappings?.[type] || "";
};

//packages

export const calculateRemainingTime = (
  endDate,
  expText,
  days,
  oneMonth,
  months
) => {
  const now = new Date();
  const targetDate = new Date(endDate);
  const timeDiff = targetDate - now;

  if (timeDiff <= 0) return expText || 0;

  const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const monthsLeft = Math.floor(daysLeft / 30);
  const remainingDays = daysLeft % 30;

  if (monthsLeft > 0) {
    return monthsLeft > 1
      ? `${monthsLeft} ${months || ""} ${
          remainingDays > 0 ? `(${remainingDays} ${days || ""})` : ""
        }`
      : `${oneMonth || ""} ${
          remainingDays > 0 ? `(${remainingDays} ${days || ""})` : ""
        }`;
  }
  return `${daysLeft} ${days || ""}`;
};
