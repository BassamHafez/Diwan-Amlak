import { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import CustomPackageItem from "./CustomPackageItem";
import { useTranslation } from "react-i18next";
import styles from "./Packages.module.css";
import Select from "react-select";
import {
  checkBoxCircle,
  maxEstatesInCompoundOptions,
} from "../../Components/Logic/StaticLists";
import { MainTitle } from "../../shared/components";
import { Alert } from "../../shared/bootstrap";

const CustomPackages = () => {
  const [features, setFeatures] = useState({
    usersCount: 1,
    compoundsCount: 1,
    estatesCount: 1,
    maxEstatesInCompound: 3,
    isFavoriteAllowed: false,
    isRemindersAllowed: false,
    isAnalysisAllowed: false,
    isCompoundsReportsAllowed: false,
    isFilesExtractAllowed: false,
    isFinancialReportsAllowed: false,
    isOperationalReportsAllowed: false,
    isServiceContactsAllowed: false,
    isTasksAllowed: false,
    isUserPermissionsAllowed: false,
  });
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const curentLang = isArLang ? "ar" : "en";

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleFeatureChange = (e, isSelect) => {
    if (isSelect) {
      setFeatures((prevFeatures) => ({
        ...prevFeatures,
        ["maxEstatesInCompound"]: e.value,
      }));
      return;
    }
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : Number(value);

    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [id]: newValue,
    }));
  };

  const myFeatures = useMemo(() => {
    return Object.entries(features).map(([key, value]) => ({
      label: key,
      value,
    }));
  }, [features]);

  const listClasses = `checkbox-wrapper-15 my-3 ${
    isArLang ? "checkbox-wrapper_ar" : "checkbox-wrapper_en"
  }`;

  return (
    <div className="height_container">
      <Row>
        <Col sm={6} xl={8}>
          <div className="my-3">
            <MainTitle title={key("features")} />
          </div>
          <Row className="px-3">
            <Col sm={6}>
              <div className="field">
                <label htmlFor="usersCount">{key("usersCount")}</label>
                <input
                  type="number"
                  id="usersCount"
                  value={features.usersCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) >= 0) {
                      handleFeatureChange(e);
                    }
                  }}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="compoundsCount">{key("compoundsCount")}</label>
                <input
                  type="number"
                  id="compoundsCount"
                  value={features.compoundsCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) >= 0) {
                      handleFeatureChange(e);
                    }
                  }}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label htmlFor="estatesCount">{key("estatesCount")}</label>
                <input
                  type="number"
                  id="estatesCount"
                  value={features.estatesCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) >= 0) {
                      handleFeatureChange(e);
                    }
                  }}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="field">
                <label className="mb-0" htmlFor="maxEstatesInCompound">
                  {key("maxEstatesInCompound")}
                </label>
                <Select
                  options={maxEstatesInCompoundOptions[curentLang]}
                  onChange={(val) =>
                    handleFeatureChange(val ? val : null, true)
                  }
                  className={`${isArLang ? "text-end" : "text-start"} ${
                    styles.select_type
                  } my-3`}
                  isRtl={isArLang ? true : false}
                  placeholder={maxEstatesInCompoundOptions[curentLang][0]?.label}
                />
              </div>
            </Col>
            <Col sm={12}>
              <Row>
                <Col sm={6}>
                  <ul className={`p-0 ${isArLang ? "text-end" : "text-start"}`}>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isFavoriteAllowed"
                        checked={features.isFavoriteAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label className="cbx" htmlFor="isFavoriteAllowed">
                        {checkBoxCircle}
                        <span>
                          {key("add")} {key("bookmarked")}
                        </span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isRemindersAllowed"
                        checked={features.isRemindersAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label className="cbx" htmlFor="isRemindersAllowed">
                        {checkBoxCircle}
                        <span>{key("isRemindersAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isAnalysisAllowed"
                        checked={features.isAnalysisAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label className="cbx" htmlFor="isAnalysisAllowed">
                        {checkBoxCircle}
                        <span>{key("isAnalysisAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isTasksAllowed"
                        checked={features.isTasksAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label className="cbx" htmlFor="isTasksAllowed">
                        {checkBoxCircle}
                        <span>{key("isTasksAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isServiceContactsAllowed"
                        checked={features.isServiceContactsAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label className="cbx" htmlFor="isServiceContactsAllowed">
                        {checkBoxCircle}
                        <span>{key("isServiceContactsAllowed")}</span>
                      </label>
                    </li>
                  </ul>
                </Col>

                <Col sm={6}>
                  <ul className={`p-0 ${isArLang ? "text-end" : "text-start"}`}>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isCompoundsReportsAllowed"
                        checked={features.isCompoundsReportsAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label
                        className="cbx"
                        htmlFor="isCompoundsReportsAllowed"
                      >
                        {checkBoxCircle}
                        <span>{key("isCompoundsReportsAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isOperationalReportsAllowed"
                        checked={features.isOperationalReportsAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label
                        className="cbx"
                        htmlFor="isOperationalReportsAllowed"
                      >
                        {checkBoxCircle}
                        <span>{key("isOperationalReportsAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isFinancialReportsAllowed"
                        checked={features.isFinancialReportsAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label
                        className="cbx"
                        htmlFor="isFinancialReportsAllowed"
                      >
                        {checkBoxCircle}
                        <span>{key("isFinancialReportsAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isFilesExtractAllowed"
                        checked={features.isFilesExtractAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label className="cbx" htmlFor="isFilesExtractAllowed">
                        {checkBoxCircle}
                        <span>{key("isFilesExtractAllowed")}</span>
                      </label>
                    </li>
                    <li className={listClasses}>
                      <input
                        className="inp-cbx d-none"
                        type="checkbox"
                        id="isUserPermissionsAllowed"
                        checked={features.isUserPermissionsAllowed}
                        onChange={handleFeatureChange}
                      />
                      <label className="cbx" htmlFor="isUserPermissionsAllowed">
                        {checkBoxCircle}
                        <span>{key("isUserPermissionsAllowed")}</span>
                      </label>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
            <Alert variant="primary">{key("customPackageNote")}</Alert>
          </Row>
        </Col>
        <Col sm={6} xl={4}>
          <CustomPackageItem
            features={myFeatures}
            estatesCount={features.estatesCount}
            compoundsCount={features.compoundsCount}
            isNoFixedHeight={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CustomPackages;
