import styles from "./Buttons.module.css";

const ButtonTwo = ({onClick,text,type,children,classes}) => {
  return (
    <button
      onClick={onClick}
      type={type ? type : "button"}
      className={`${styles.btn_two}  ${classes?classes:""}`}
    >
      {text ? text : children}
    </button>
  )
}

export default ButtonTwo
