import {mainFormsHandlerTypeRaw } from "../../../util/Http";
import styles from "../Admin.module.css";
import SubscriptionItem from "./SubscriptionItem";
import { useTranslation, useMemo, useQuery, useSelector } from "../../../shared/hooks";
import { MainTitle, LoadingOne, NoData,PolicyList } from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const AllSubscriptions = () => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const {
    data: subscriptions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["subscriptions", token],
    queryFn: () =>
      mainFormsHandlerTypeRaw({
        type: "subscriptions",
        token: token,
        isLimited: true,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const policyContent = useMemo(
    () => [
      { label: "subCondition1", value: null },
      { label: "subCondition2", value: null },
      { label: "subCondition3", value: null },
    ],
    []
  );

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {(!subscriptions || isFetching) && <LoadingOne />}
        <div className="my-4">
          <MainTitle title={key("subscriptions")} />
        </div>

        <div className="my-4">
          <Row>
            <Col xl={7} lg={6} className="py-4">
              <PolicyList list={policyContent} />
            </Col>
            <Col xl={5} lg={6}>
              {subscriptions ? (
                subscriptions?.data?.length > 0 ? (
                  <div className="scrollableTable">
                    <table className={`${styles.contract_table} table`}>
                      <thead className={styles.table_head}>
                        <tr>
                          <th className={isArLang ? "text-end" : "text-start"}>
                            {key("features")}
                          </th>
                          <th>
                            {key("price")} ({key("sarSmall")})
                          </th>
                          <th>{key("actions")}</th>
                        </tr>
                      </thead>

                      <tbody className={styles.table_body}>
                        {subscriptions?.data?.map((sub, index) => (
                          <SubscriptionItem
                            key={`${sub.feature}_${index}`}
                            refetch={refetch}
                            sub={sub}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <NoData text={key("noData")} smallSize={true} />
                )
              ) : (
                <LoadingOne />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default AllSubscriptions;
