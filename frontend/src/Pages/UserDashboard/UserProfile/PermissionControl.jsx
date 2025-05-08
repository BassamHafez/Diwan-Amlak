import Row from "react-bootstrap/esm/Row";
import styles from "./PermissionControl.module.css";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import { Alert } from "../../../shared/bootstrap";

const PermissionControl = ({ userPermissions, allPermissions }) => {
  const { t: key } = useTranslation();
  const filteredAllPermissions = allPermissions?.filter(
    (perm) => !userPermissions.includes(perm)
  );

  return (
    <div className={styles.perm_header}>
      <h5>{key("availablePermissions")}</h5>
      <Row>
        {userPermissions?.map((perm, index) => (
          <Col
            className="d-flex justify-content-center align-items-center"
            sm={6}
            lg={4}
            xl={3}
            key={`${perm}_${index}`}
          >
            <div className={styles.perm_item}>
              <span>{key(perm)}</span>
            </div>
          </Col>
        ))}
      </Row>
      <hr />
      <h5>{key("remainingPermissions")}</h5>
      <Row>
        {filteredAllPermissions?.length > 0 ? (
          filteredAllPermissions?.map((perm, index) => (
            <Col
              className="d-flex justify-content-center align-items-center"
              sm={6}
              lg={4}
              xl={3}
              key={`${perm}_${index}`}
            >
              <div className={styles.perm_item}>
                <span>{key(perm)}</span>
              </div>
            </Col>
          ))
        ) : (
          <Alert variant="warning">
            <span>{key("noPermissionsLeft")}</span>
          </Alert>
        )}
      </Row>
    </div>
  );
};

export default PermissionControl;
