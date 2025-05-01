import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./Store/index";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./i18n";
import "aos/dist/aos.css";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
