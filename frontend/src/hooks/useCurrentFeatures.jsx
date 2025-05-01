import { useSelector } from "react-redux";

const useCurrentFeatures = (props) => {
  const accountInfo = useSelector((state) => state.accountInfo.data);

  const myAccount = props || accountInfo?.account;

  const currentFeatures = {
    allowedUsers: myAccount?.allowedUsers,
    allowedCompounds: myAccount?.allowedCompounds,
    allowedEstates: myAccount?.allowedEstates,
    maxEstatesInCompound: myAccount?.maxEstatesInCompound,
    isFavoriteAllowed: myAccount?.isFavoriteAllowed,
    isRemindersAllowed: myAccount?.isRemindersAllowed,
    isAnalysisAllowed: myAccount?.isAnalysisAllowed,
    isCompoundsReportsAllowed: myAccount?.isCompoundsReportsAllowed,
    isFilesExtractAllowed: myAccount?.isFilesExtractAllowed,
    isFinancialReportsAllowed: myAccount?.isFinancialReportsAllowed,
    isOperationalReportsAllowed: myAccount?.isOperationalReportsAllowed,
    isServiceContactsAllowed: myAccount?.isServiceContactsAllowed,
    isTasksAllowed: myAccount?.isTasksAllowed,
    isUserPermissionsAllowed: myAccount?.isUserPermissionsAllowed,
  };
  
  return currentFeatures;
};

export default useCurrentFeatures;
