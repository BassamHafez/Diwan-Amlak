import Placeholder from "react-bootstrap/Placeholder";

const ParagraphPlaceholders = ({size}) => {
  return (
    <Placeholder as="p" animation="glow">
      <Placeholder xs={size?size:8} />
    </Placeholder>
  )
}

export default ParagraphPlaceholders
