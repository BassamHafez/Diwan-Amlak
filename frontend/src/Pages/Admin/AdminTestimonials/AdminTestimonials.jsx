import { mainFormsHandlerTypeRaw } from "../../../util/Http";
import TestimonialItem from "../../../Components/TestimonialItem/TestimonialItem";
import AddTestimonial from "./TestimonialsForms/AddTestimonial";
import {
  useState,
  useTranslation,
  useCallback,
  useMemo,
  useQuery,
} from "../../../shared/hooks";
import {
  SearchField,
  NoData,
  MainTitle,
  LoadingOne,
  ModalForm,
  ButtonOne,
} from "../../../shared/components";
import { Row, Col } from "../../../shared/bootstrap";

const AdminTestimonials = () => {
  const [showAddTestimonialsModal, setShowAddTestimonialsModal] =
    useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const { t: key } = useTranslation();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => mainFormsHandlerTypeRaw({ type: "testimonials",isLimited:true }),
    staleTime: Infinity,
  });

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    const lowerCasedFilter = searchFilter.trim().toLowerCase();
    return data?.data?.filter((comment) => {
      const nameMatches = comment.name
        .trim()
        .toLowerCase()
        .includes(lowerCasedFilter);
      const titleMatches = comment.title
        .trim()
        .toLowerCase()
        .includes(lowerCasedFilter);
      return !searchFilter || nameMatches || titleMatches;
    });
  }, [data, searchFilter]);

  const hideTestimonialsModalHandler = useCallback(() => {
    setShowAddTestimonialsModal(false);
  }, []);

  const showTestimonialsModalHandler = useCallback(() => {
    setShowAddTestimonialsModal(true);
  }, []);

  return (
    <>
      <div className="admin_body height_container position-relative p-2">
        {!filteredData || (isFetching && <LoadingOne />)}

        <div className="my-4">
          <MainTitle title={key("testimonials")} />
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap position-relative my-3 p-2">
          <div className="my-2">
            <SearchField onSearch={onSearch} text={key("searchTestimonials")} />
          </div>
          <div>
            <ButtonOne
              onClick={showTestimonialsModalHandler}
              borderd={true}
              text={key("add")}
              classes="my-2"
            />
          </div>
        </div>
        <Row className="g-3">
          {filteredData?.length > 0 ? (
            filteredData?.map((content) => (
              <Col key={content?._id} sm={12}>
                <TestimonialItem
                  isAdmin={true}
                  content={content}
                  refetch={refetch}
                />
              </Col>
            ))
          ) : (
            <NoData text={key("noTestimonials")} />
          )}
        </Row>
      </div>
      {showAddTestimonialsModal && (
        <ModalForm
          show={showAddTestimonialsModal}
          onHide={hideTestimonialsModalHandler}
        >
          <AddTestimonial
            refetch={refetch}
            hideModal={hideTestimonialsModalHandler}
          />
        </ModalForm>
      )}
    </>
  );
};

export default AdminTestimonials;
