import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import styles from "./ContactsIcon.module.css";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ContactsIcon = ({ type }) => {
  const configs = useSelector((state) => state.configs);

  const classes =
    type === "one" ? styles.social_icon_type_one : styles.social_icon_type_two;
  const container_class =
    type === "one" ? styles.icons_div_one : styles.icons_div_two;

  return (
    <div className={`${container_class} d-flex`}>
      <div className={styles.footer_links}>
        {configs?.whatsappNumber && (
          <Link
            target="_blank"
            to={`https://wa.me/${configs?.whatsappNumber}`}
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon className={`${classes} mx-3`} icon={faWhatsapp} />
          </Link>
        )}
        {configs?.instagramLink && (
          <Link target="_blank" to={`${configs?.instagramLink}`}>
            <FontAwesomeIcon
              className={`${classes} ${type === "two" && styles.fa_face} me-3`}
              icon={faInstagram}
            />
          </Link>
        )}

        {configs?.email && (
          <Link target="_blank" to={`mailto:${configs.email}`}>
            <FontAwesomeIcon className={`${classes} mx-3`} icon={faEnvelope} />
          </Link>
        )}
        {configs?.twitterLink && (
          <Link target="_blank" to={`${configs?.twitterLink}`}>
            <FontAwesomeIcon className={`${classes} mx-3`} icon={faXTwitter} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ContactsIcon;
