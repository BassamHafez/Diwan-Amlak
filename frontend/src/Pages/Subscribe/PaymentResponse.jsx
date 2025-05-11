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
<<<<<<< HEAD
import FailPayment from "./FailPayment";
import styles from "./Payment.module.css";
import SuccessPayment from "./SuccessPayment";
=======
import styles from "./Payment.module.css";
import PaymentDetails from "./PaymentDetails";
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41

const PaymentResponse = () => {
  const token =
    useSelector((state) => state.userInfo.token) ||
    JSON.parse(localStorage.getItem("token"));
<<<<<<< HEAD
=======
  const profileInfo = useSelector((state) => state.profileInfo.data);
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
  const paymentId = localStorage.getItem("paymentId");
  const { t: key } = useTranslation();
  const navigate = useNavigate();
  const { status } = useParams();
  const dispatch = useDispatch();

<<<<<<< HEAD
  useEffect(() => {
    return () => {
      localStorage.removeItem("paymentId");
    };
  }, []);
=======
  // useEffect(() => {
  //   return () => {
  //     localStorage.removeItem("paymentId");
  //   };
  // }, []);
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41

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
<<<<<<< HEAD
  console.log(data, "payment response data");
=======

>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
  useEffect(() => {
    if (data && data.status === "COMPLETED" && status === "success") {
      dispatch(fetchAccountData(token));
    }
  }, [data, status, dispatch, token]);

  const navigateToHome = () => {
<<<<<<< HEAD
    navigate("/");
=======
    navigate(`/profile/${profileInfo?._id}`);
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center flex-column ${styles.container_page}`}
    >
      <div className={styles.response_body}>
        <MainTitle title={key("paymentDetails")} />
        {isFetching ? (
          <div className="position-absolute top-0 start-0 w-100 h-100 rounded-5 d-flex justify-content-center align-items-center flex-column">
<<<<<<< HEAD
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
=======
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
>>>>>>> 55657230ff75f63e2de97fb902e0aa94a6756b41
      </div>
    </div>
  );
};

export default PaymentResponse;
