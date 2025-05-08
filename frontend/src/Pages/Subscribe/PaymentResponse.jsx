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
import styles from "./Payment.module.css";
import PaymentDetails from "./PaymentDetails";

const PaymentResponse = () => {
  const token =
    useSelector((state) => state.userInfo.token) ||
    JSON.parse(localStorage.getItem("token"));
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const paymentId = localStorage.getItem("paymentId");
  const { t: key } = useTranslation();
  const navigate = useNavigate();
  const { status } = useParams();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   return () => {
  //     localStorage.removeItem("paymentId");
  //   };
  // }, []);

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

  useEffect(() => {
    if (data && data.status === "COMPLETED" && status === "success") {
      dispatch(fetchAccountData(token));
    }
  }, [data, status, dispatch, token]);

  const navigateToHome = () => {
    navigate(`/profile/${profileInfo?._id}`);
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center flex-column ${styles.container_page}`}
    >
      <div className={styles.response_body}>
        <MainTitle title={key("paymentDetails")} />
        {isFetching ? (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-5 d-flex justify-content-center align-items-center flex-column">
            <FontAwesomeIcon
              icon={faSpinner}
              className="fa-spin fa-3x mb-3 text-secondary"
            />
            <span className="fa fa-fade">{key("paymentLoading")}</span>
          </div>
        ) : data ? (
          <PaymentDetails data={data} />
        ) : (
          <NoData text={key("wrong")} smallSize />
        )}

        {!isFetching && (
          <div className="text-center position-relative mt-4">
            <ButtonOne borderd text={key("profile")} onClick={navigateToHome} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResponse;
