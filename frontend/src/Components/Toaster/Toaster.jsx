import { ToastContainer } from "react-toastify";

const Toaster = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <ToastContainer
      position={isArLang ? "bottom-right" : "bottom-left"}
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      draggable
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      className="toast_content"
    />
  );
};

export default Toaster;
