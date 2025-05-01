import styles from "./MainTitle.module.css";

const MainTitle = ({title,children,small,colored,classes}) => {
  return (
    <h5 className={`${styles.main_title} ${colored?styles.colored:""} ${small?"fs-6":""} ${classes}`}>
      {title?title:children}
    </h5>
  )
}

export default MainTitle
