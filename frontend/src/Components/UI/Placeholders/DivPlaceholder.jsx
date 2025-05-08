import Placeholder from "react-bootstrap/Placeholder";

const DivPlaceholder = ({width,height}) => {
  return (
    <Placeholder bg="secondary" as="div" animation="glow">
      <Placeholder xs={12} style={{width:width,height:height}} />
    </Placeholder>
  );
};

export default DivPlaceholder;
