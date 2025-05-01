import styles from "../Admin.module.css";
import { FontAwesomeIcon } from "../../../shared/index";
import { faCircleCheck } from "../../../shared/constants";
import {
  useTranslation,
  useCurrentFeatures,
  useMemo,
} from "../../../shared/hooks";

const AccountFeatures = ({ account }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const currentFeatures = useCurrentFeatures(account);

  const { t: key } = useTranslation();

  const featuresList = useMemo(() => {
    return Object.entries(currentFeatures).map(([key, value]) => ({
      label: key,
      value,
    }));
  }, [currentFeatures]);

  return (
    <ul className={styles.features_list}>
      {featuresList?.map(
        (feature, index) =>
          feature.value !== false &&
          feature.value !== undefined &&
          Number(feature.value) > 0 && (
            <li key={index}>
              <FontAwesomeIcon
                className={`${styles.list_icon} ${isArLang ? "ms-2" : "me-2"}`}
                icon={faCircleCheck}
              />
              {key(feature.label)}{" "}
              {typeof feature.value !== "boolean"
                ? `(${Number(feature.value) > 0 ? feature.value : 0})`
                : feature.value === true
                ? ""
                : ""}
            </li>
          )
      )}
    </ul>
  );
};

export default AccountFeatures;
