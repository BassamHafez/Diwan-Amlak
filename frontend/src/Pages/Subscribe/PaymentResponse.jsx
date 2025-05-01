import { mainFormsHandlerTypeRaw } from "../../util/Http";
import {
  useSelector,
  useTranslation,
  useQuery,
  useNavigate,
  useParams,
  useDispatch,
  useEffect,
} from "../../shared/hooks";
import { ButtonOne, MainTitle, NoData } from "../../shared/components";
import { FontAwesomeIcon } from "../../shared/index";
import { faSpinner } from "../../shared/constants";
import fetchAccountData from "../../Store/accountInfo-actions";
import FailPayment from "./FailPayment";
import styles from "./Payment.module.css";
import SuccessPayment from "./SuccessPayment";

const PaymentResponse = () => {
  const token =
    useSelector((state) => state.userInfo.token) ||
    JSON.parse(localStorage.getItem("token"));
  const paymentId = localStorage.getItem("paymentId");
  const { t: key } = useTranslation();
  const navigate = useNavigate();
  const { status } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      localStorage.removeItem("paymentId");
    };
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["paymentResponse", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: `accounts/purchases/${paymentId}`,
        token: token,
      }),
    enabled: !!paymentId && !!token,
    staleTime: Infinity,
  });
  console.log(data, "payment response data");
  useEffect(() => {
    if (data && data.status === "COMPLETED" && status === "success") {
      dispatch(fetchAccountData(token));
    }
  }, [data, status, dispatch, token]);

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center flex-column ${styles.container_page}`}
    >
      <div className={styles.response_body}>
        <MainTitle title={key("paymentDetails")} />
        {isFetching ? (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-5 d-flex justify-content-center align-items-center flex-column">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin fa-3x mb-3" />
            <span className="fa fa-fade">{key("paymentLoading")}</span>
          </div>
        ) : data && data.status === "COMPLETED" && status === "success" ? (
          <SuccessPayment />
        ) : data && data.status === "NOT_COMPLETED" && status === "faild" ? (
          <FailPayment />
        ) : (
          <NoData text={key("wrong")} smallSize />
        )}
        <div className="text-center position-relative mt-4">
          <ButtonOne borderd text={key("home")} onClick={navigateToHome} />
        </div>
      </div>
    </div>
  );
};

export default PaymentResponse;
