import styles from "./ButtonThree.module.css";

const ButtonThree = ({ color, text, onClick,type,children }) => {
  let btn_type = color === "white" ? styles.white_btn : styles.main_color_btn;
  let first_layer =
  color === "white" ? styles.first_layer1 : styles.first_layer2;
  let second_layer =
  color === "white" ? styles.second_layer1 : styles.second_layer2;
  let third_layer =
  color === "white" ? styles.third_layer1 : styles.third_layer2;

  return (
    <div onClick={onClick} type={type?type:"button"} className={`${btn_type} btn`}>
      <div className={first_layer}></div>
      <div className={second_layer}></div>
      <div className={third_layer}></div>
      <span className={styles.btn_text}>{text?text:children}</span>
    </div>
  );
};

export default ButtonThree;
