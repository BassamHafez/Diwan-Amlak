import styles from "./AdminHome.module.css";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { FontAwesomeIcon, CountUp } from "../../../shared/index";
import {
  faStar,
  faBagShopping,
  faBalanceScale,
  faBox,
  faBoxes,
  faChartLine,
  faHouse,
  faUsers,
} from "../../../shared/constants";
import {
  useTranslation,
  useQuery,
  useState,
  useSelector,
  useEffect,
} from "../../../shared/hooks";
import { MainTitle, NoData, LoadingOne } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";
import {
  paid,
  profits,
  loss,
  pending,
  cash,
  transaction,
  office,
  accounts,
  topOffice,
  popular,
} from "../../../shared/images";

const AdminHome = () => {
  const [startCounter, setStartCounter] = useState(false);
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  useEffect(() => {
    setStartCounter(true);
    return () => setStartCounter(false);
  }, []);

  const { data: analytics, isFetching } = useQuery({
    queryKey: ["analytics", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "stats/admin",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const myData = analytics?.data;

  const analysisDataNumbers = [
    {
      label: "accountsCount",
      value: myData?.accountsCount || 0,
      icon: null,
      imgIcon: accounts,
    },
    {
      label: "usersCount2",
      value: myData?.usersCount || 0,
      icon: faUsers,
    },
    {
      label: "compoundsCount2",
      value: myData?.compoundsCount || 0,
      icon: null,
      imgIcon: office,
    },
    {
      label: "estatesCount",
      value: myData?.estatesCount || 0,
      icon: faHouse,
    },
    {
      label: "totalCompletedRevenue",
      value: myData?.totalCompletedRevenue || 0,
      icon: null,
      imgIcon: paid,
    },
    {
      label: "totalPendingTransactions",
      value: myData?.totalPendingTransactions || 0,
      icon: null,
      imgIcon: pending,
    },
    {
      label: "totalCompletedTransactions",
      value: myData?.totalCompletedTransactions || 0,
      icon: null,
      imgIcon: transaction,
    },
    {
      label: "numberOfPurchases",
      value: myData?.numberOfPurchases || 0,
      icon: null,
      imgIcon: cash,
    },
    {
      label: "customPackagePurchaseCount",
      value: myData?.customPackagePurchaseCount || 0,
      icon: faBox,
    },
    {
      label: "packagesPurchaseCount",
      value: myData?.packagesPurchaseCount || 0,
      icon: faBoxes,
    },
  ];

  const analysisDataAmounts = [
    {
      label: "totalPendingAmount",
      value: myData?.totalPendingAmount || 0,
      icon: null,
      imgIcon: loss,
    },

    {
      label: "totalCompletedAmount",
      value: myData?.totalCompletedAmount || 0,
      icon: null,
      imgIcon: profits,
    },
    {
      label: "averagePurchaseAmount",
      value: myData?.averagePurchaseAmount || 0,
      icon: faBalanceScale,
    },
    {
      label: "customPackagePurchaseAmount",
      value: myData?.customPackagePurchaseAmount || 0,
      icon: faChartLine,
    },
    {
      label: "packagesPurchaseAmount",
      value: myData?.packagesPurchaseAmount || 0,
      icon: faBagShopping,
    },
  ];

  const starIcon = (
    <FontAwesomeIcon
      className={`${isArLang ? "ms-2" : "ms-1"} text-warning`}
      icon={faStar}
    />
  );
  
  const lastChildClass = isArLang ? "me-auto" : "ms-auto";
  return (
    <div className="admin_body height_container position-relative p-2">
      {(!analytics || isFetching) && <LoadingOne />}

      <div className={styles.information_section}>
        <div className="my-4">
          <MainTitle title={key("keyMetrics")} />
        </div>
        <Row className="g-3 w-100">
          {analysisDataNumbers.map((item, index) => (
            <Col
              key={index}
              xl={4}
              lg={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div className={styles.box}>
                <div
                  className={`${styles.box_img} ${isArLang ? "ms-2" : "me-2"} ${
                    isArLang ? styles.box_img_ar : styles.box_img_en
                  }`}
                >
                  {item.icon ? (
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={styles.countUp_icon}
                    />
                  ) : (
                    <img src={item.imgIcon} alt="icon" />
                  )}
                </div>

                <div className={styles.box_caption}>
                  <span>{key(item.label)}</span>

                  <p>
                    {startCounter && (
                      <CountUp
                        start={0}
                        end={item.value}
                        duration={3}
                        delay={0}
                      />
                    )}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div className={styles.information_section}>
        <div className="my-4">
          <MainTitle title={key("financialOverview")} />
        </div>
        <Row className="g-3 w-100">
          {analysisDataAmounts.map((item, index) => (
            <Col
              key={index}
              xl={4}
              lg={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div className={styles.box}>
                <div
                  className={`${styles.box_img} ${isArLang ? "ms-2" : "me-2"} ${
                    isArLang ? styles.box_img_ar : styles.box_img_en
                  }`}
                >
                  {item.icon ? (
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={styles.countUp_icon}
                    />
                  ) : (
                    <img src={item.imgIcon} alt="icon" />
                  )}
                </div>

                <div className={styles.box_caption}>
                  <span>
                    {key(item.label)} ({key("sarSmall")})
                  </span>

                  <p>
                    {startCounter && (
                      <CountUp
                        start={0}
                        end={item.value}
                        duration={3}
                        delay={0}
                      />
                    )}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div className={`${styles.information_section} ${styles.sky_bg}`}>
        <div className="my-4">
          <MainTitle title={key("topAccountsBySpend")} />
          <Row className="g-4">
            <Col lg={6}>
              <div className={`${styles.caption} my-4`}>
                {myData?.topAccountsBySpend?.length > 0 ? (
                  <div className="scrollableTable">
                    <table className={`${styles.contract_table} table`}>
                      <thead className={styles.table_head}>
                        <tr>
                          <th className={isArLang ? "text-end" : "text-start"}>
                            {key("accName")}
                          </th>
                          <th>
                            {key("amount")} ({key("sarSmall")})
                          </th>
                        </tr>
                      </thead>

                      <tbody className={styles.table_body}>
                        {myData?.topAccountsBySpend?.map((acc, index) => (
                          <tr key={index}>
                            <td
                              className={isArLang ? "text-end" : "text-start"}
                            >
                              {acc.accountName}
                            </td>
                            <td>{acc.totalSpend}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <NoData text={key("noAcc")} smallSize={true} />
                )}
              </div>
            </Col>
            <Col
              lg={6}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="standard_img">
                <img className="w-100" src={topOffice} alt="topOffice" />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className={`${styles.information_section} ${styles.sky_bg2}`}>
        <div className="my-4">
          <MainTitle title={key("mostPopularPackage")} />
          <Row className="g-4">
            <Col lg={6}>
              <div className={`${styles.caption} my-4`}>
                <h4 className="mb-3">{key("packInfo")}</h4>
                <ul className={styles.caption_list}>
                  <li>
                    <span>
                      {starIcon}
                      {key("arTitle")}
                    </span>
                    <span className={lastChildClass}>
                      {myData?.mostPopularPackage?.arTitle}
                    </span>
                  </li>
                  <li>
                    <span>
                      {starIcon}
                      {key("enTitle")}
                    </span>
                    <span className={lastChildClass}>
                      {myData?.mostPopularPackage?.enTitle}
                    </span>
                  </li>
                  <li>
                    <span>
                      {starIcon}
                      {key("numberOfPurchases")}
                    </span>
                    <span className={lastChildClass}>
                      {myData?.mostPopularPackage?.numberOfPurchases}
                    </span>
                  </li>
                </ul>
              </div>
            </Col>
            <Col
              lg={6}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="standard_img">
                <img className="w-100" src={popular} alt="topOffice" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
