import UpdateConfigs from "./ConfigsForms/UpdateConfigs";
import styles from "../Admin.module.css";
import UpdateAssets from "./ConfigsForms/UpdateAssets";
import { useTranslation } from "../../../shared/hooks";
import { MainTitle } from "../../../shared/components";

const Configs = () => {
  const { t: key } = useTranslation();

  return (
    <div className="admin_body height_container position-relative p-2">
      <div className={styles.container}>
        <div className="mb-3">
          <MainTitle title={key("customization")} />
        </div>
        <UpdateConfigs />
      </div>
      <div className={styles.container}>
        <div className="mb-3">
          <MainTitle title={key("images")} />
        </div>
        <UpdateAssets />
      </div>
    </div>
  );
};

export default Configs;
