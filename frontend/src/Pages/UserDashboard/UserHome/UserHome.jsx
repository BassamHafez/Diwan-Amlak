import styles from "./UserHome.module.css";
import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import { faTriangleExclamation } from "../../../shared/constants";
import {
  ScrollTopBtn,
  LoadingOne,
  NoData,
  CheckSubscriptionRender,
} from "../../../shared/components";
import {
  useNavigate,
  useTranslation,
  useQuery,
  useSelector,
  useCallback,
  useMemo,
} from "../../../shared/hooks";
import { Link, FontAwesomeIcon } from "../../../shared/index";
import { Alert, Row, Col } from "../../../shared/bootstrap";
import CirleNumbers from "./CirleNumbers";
import FinancialOverview from "./FinancialOverview";
import RevenueByMonthChart from "./RevenueByMonthChart";
import TodayExAndRev from "./TodayExAndRev";
import OverdueTasks from "./OverdueTasks";
import PendingRevenues from "./PendingRevenues";

const UserHome = () => {
  const token = useSelector((state) => state.userInfo.token);
  const isTimeExpired = useSelector((state) => state.packageTime.isTimeExpired);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const isAnalysisAllowed = accountInfo?.account?.isAnalysisAllowed;
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["analytics", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "stats",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!isAnalysisAllowed && !!token,
  });

  const myData = useMemo(() => {
    return data?.data || {};
  }, [data]);

  const calculateTotal = useCallback((num1, num2) => {
    if (num1 !== null && num2 !== null) {
      return Number(num1) + Number(num2);
    }
    return 0;
  }, []);

  const totalExpenses = useMemo(
    () =>
      calculateTotal(myData?.totalPaidExpenses, myData?.totalPendingExpenses),
    [myData, calculateTotal]
  );

  const totalRevenues = useMemo(
    () =>
      calculateTotal(myData?.totalPaidRevenues, myData?.totalPendingRevenues),
    [myData, calculateTotal]
  );

  const getStatusBgColor = useCallback((status) => {
    const colors = {
      pending: styles.yellow,
      canceled: styles.red,
      paid: styles.green,
      cancelled: styles.red,
    };
    return colors[status] || "";
  }, []);

  const showDetails = useCallback(
    (estateId, compoundId) => {
      if (!estateId && !compoundId) return;
      navigate(
        estateId
          ? `/estate-unit-details/${estateId}`
          : `/estate-details/${compoundId}`
      );
    },
    [navigate]
  );

  const expiredAlert = useMemo(() => {
    return (
      isTimeExpired && (
        <Alert variant="warning" className="mt-4">
          <FontAwesomeIcon
            className="fa-fade mx-2"
            icon={faTriangleExclamation}
          />
          {key("subExpired")} <Link to={"/packages"}>{key("here")}</Link>
        </Alert>
      )
    );
  }, [isTimeExpired, key]);

  return (
    <div className="height_container d-flex flex-column justify-content-center align-items-center px-2 py-5 p-md-4">
      {isAnalysisAllowed === undefined && <LoadingOne />}
      {isAnalysisAllowed ? (
        <>
          {isFetching && <LoadingOne />}
          <ScrollTopBtn />
          <Row className="g-3 w-100 height_container">
            <Col xl={3} md={4} className="my-3">
              <CirleNumbers
                myData={myData}
                totalExpenses={totalExpenses}
                totalRevenues={totalRevenues}
              />
            </Col>

            <Col xl={9} md={8}>
              <Row className="g-3 w-100">
                {expiredAlert}

                <Col md={12} className="my-3">
                  <FinancialOverview
                    myData={myData}
                    totalExpenses={totalExpenses}
                    totalRevenues={totalRevenues}
                  />
                </Col>

                <Col md={12} className="my-3">
                  <RevenueByMonthChart myData={myData} />
                </Col>
              </Row>
            </Col>

            <TodayExAndRev
              myData={myData}
              getStatusBgColor={getStatusBgColor}
              showDetails={showDetails}
            />
            <CheckSubscriptionRender
              name="isTasksAllowed"
              accountData={accountInfo?.account}
            >
              <OverdueTasks
                myData={myData}
                refetch={refetch}
                accountInfo={accountInfo}
              />
            </CheckSubscriptionRender>
            <Col sm={12}>
              <PendingRevenues
                myData={myData}
                getStatusBgColor={getStatusBgColor}
                showDetails={showDetails}
              />
            </Col>
          </Row>
        </>
      ) : (
        <div>
          <NoData
            type="upgrade"
            verySmallSize={true}
            text={`${key("upgradePackage")} ${key("isAnalysisAllowed")}`}
          />
          {expiredAlert}
        </div>
      )}
    </div>
  );
};

export default UserHome;
