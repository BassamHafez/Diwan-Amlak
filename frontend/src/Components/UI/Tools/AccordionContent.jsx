import Accordion from "react-bootstrap/Accordion";

const AccordionContent = (props) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <Accordion.Item eventKey={props.eventKey} dir={isArLang ? "rtl" : "ltr"}>
      <Accordion.Header className={`${isArLang ? "opposite_arrow" : ""}`}>
        {props.icon && <span className="mx-2">{props.icon}</span>}
        <span>{props.title}</span>
      </Accordion.Header>
      <Accordion.Body>{props.children}</Accordion.Body>
    </Accordion.Item>
  );
};

export default AccordionContent;
