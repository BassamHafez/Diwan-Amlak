import Placeholder from "react-bootstrap/Placeholder";

const ButtonsPlaceholders = ({size,bg}) => {
  return <Placeholder.Button xs={size?size:4} bg={bg?bg:"secondary"} className="border-0"  aria-hidden="true" />;
};

export default ButtonsPlaceholders;
