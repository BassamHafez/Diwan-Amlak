import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getisLoginState,
  getRoleState,
  getToken,
  getUserInfoFromLocalStorage,
} from "./Store/userInfo-actions";
import fetchProfileData from "./Store/profileInfo-actions";
import fetchAccountData from "./Store/accountInfo-actions";
import fetchConfigs from "./Store/configs-actions";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import Root from "./Pages/Root";
import { LoadingOne } from "./shared/components";
const Home = lazy(() => import("./Pages/Home/Home"));
const About = lazy(() => import("./Pages/About/About"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));
const Login = lazy(() => import("./Pages/Auth/Login/Login"));
const Register = lazy(() => import("./Pages/Auth/Register/Register"));
const Packages = lazy(() => import("./Pages/Packages/Packages"));
const CustomPackages = lazy(() => import("./Pages/Packages/CustomPackages"));
const UserHome = lazy(() => import("./Pages/UserDashboard/UserHome/UserHome"));
const Properties = lazy(() =>
  import("./Pages/UserDashboard/Properties/Properties")
);
const PropertyDetails = lazy(() =>
  import("./Pages/UserDashboard/PropertyDetails/PropertyDetails")
);
const CompoundDetails = lazy(() =>
  import("./Pages/UserDashboard/PropertyDetails/CompoundDetails")
);
const Contacts = lazy(() => import("./Pages/UserDashboard/Contacts/Contacts"));
const Tasks = lazy(() => import("./Pages/UserDashboard/Tasks/Tasks"));
const UserProfile = lazy(() =>
  import("./Pages/UserDashboard/UserProfile/UserProfile")
);
const Reports = lazy(() => import("./Pages/UserDashboard/Reports/Reports"));
const TermsAndConditions = lazy(() =>
  import("./Pages/UserDashboard/TermsAndConditions/TermsAndConditions")
);
const PaymentResponse = lazy(() => import("./Pages/Subscribe/PaymentResponse"));
const ForgetPassword = lazy(() =>
  import("./Pages/Auth/ForgetPassword/ForgetPassword")
);
const AdminHome = lazy(() => import("./Pages/Admin/AdminHome/AdminHome"));
const AllSubscriptions = lazy(() =>
  import("./Pages/Admin/Subscriptions/AllSubscriptions")
);
const AllAdmins = lazy(() => import("./Pages/Admin/myAdmins/AllAdmins"));
const AllAccounts = lazy(() => import("./Pages/Admin/Accounts/AllAccounts"));
const AllUsers = lazy(() => import("./Pages/Admin/Users/AllUsers"));
const AllPackages = lazy(() => import("./Pages/Admin/Packages/AllPackages"));
const AdminAccountSetting = lazy(() =>
  import("./Pages/Admin/Setting/AdminAccountSetting")
);
const Configs = lazy(() => import("./Pages/Admin/Configs/Configs"));
const AdminTestimonials = lazy(() =>
  import("./Pages/Admin/AdminTestimonials/AdminTestimonials")
);
const Support = lazy(() => import("./Pages/Admin/Support/Support"));
const AdminTerms = lazy(() => import("./Pages/Admin/AdminTerms/AdminTerms"));
const AdminSecurity = lazy(() =>
  import("./Pages/Admin/AdminSecurity/AdminSecurity")
);
const Help = lazy(() => import("./Pages/Help/Help"));
const VerifyPhonePage = lazy(() =>
  import("./Components/VerifyPhone/VerifyPhonePage")
);
const PageNotFound = lazy(() => import("./Pages/Error/PageNotFound"));
const MainError = lazy(() => import("./Pages/Error/MainError"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      errorElement: <MainError />,
      children: [
        //public pages
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "packages", element: <Packages /> },
        { path: "custom-package", element: <CustomPackages /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "help", element: <Help /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "terms-conditions", element: <TermsAndConditions /> },

        //private pages
        {
          path: "verify-phone",
          element: (
            <ProtectedRoute>
              <VerifyPhonePage />
            </ProtectedRoute>
          ),
        },

        //role userDashboard
        {
          path: "dashboard",
          element: (
            <ProtectedRoute requiredRole="user">
              <UserHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "properties",
          element: (
            <ProtectedRoute requiredRole="user">
              <Properties />
            </ProtectedRoute>
          ),
        },
        {
          path: "estate-unit-details/:propId",
          element: (
            <ProtectedRoute requiredRole="user">
              <PropertyDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "estate-details/:compId",
          element: (
            <ProtectedRoute requiredRole="user">
              <CompoundDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "contacts",
          element: (
            <ProtectedRoute requiredRole="user">
              <Contacts />
            </ProtectedRoute>
          ),
        },
        {
          path: "tasks",
          element: (
            <ProtectedRoute requiredRole="user">
              <Tasks />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/:userId",
          element: (
            <ProtectedRoute requiredRole="user">
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "reports",
          element: (
            <ProtectedRoute requiredRole="user">
              <Reports />
            </ProtectedRoute>
          ),
        },
        {
          path: "payment-response/:status",
          element: (
            <ProtectedRoute requiredRole="user">
              <PaymentResponse />
            </ProtectedRoute>
          ),
        },

        //role adminDashboard
        {
          path: "admin-dashboard",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminHome />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-subscriptions",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AllSubscriptions />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-members",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AllAdmins />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-accounts",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AllAccounts />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-users",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AllUsers />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-packages",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AllPackages />{" "}
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-settings",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminAccountSetting />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-configs",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Configs />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-testimonials",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminTestimonials />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-support",
          element: (
            <ProtectedRoute requiredRole="admin">
              <Support />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-terms",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminTerms />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin-security",
          element: (
            <ProtectedRoute requiredRole="admin">
              <AdminSecurity />
            </ProtectedRoute>
          ),
        },

        //else
        { path: "*", element: <PageNotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

function App() {
  const queryClient = new QueryClient();
  const { i18n: control } = useTranslation();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.userInfo.token);
  const role = useSelector((state) => state.userInfo.role);

  useEffect(() => {
    const updateFontFamily = () => {
      if (control.language === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("lang", "ar");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.setAttribute("lang", "en");
      }
    };
    updateFontFamily();

    control.on("languageChanged", updateFontFamily);

    return () => {
      control.off("languageChanged", updateFontFamily);
    };
  }, [control]);

  //fetchMainConfigs
  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  // get profile data from api
  useEffect(() => {
    if (token) {
      dispatch(fetchProfileData(token));
    }
  }, [dispatch, token]);

  // get account data from api
  useEffect(() => {
    if ((token, role === "user")) {
      dispatch(fetchAccountData(token));
    }
  }, [dispatch, token, role]);

  // recieve user data from localStorage with login and role states
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("userData"))) {
      dispatch(getUserInfoFromLocalStorage());
    }
    if (JSON.parse(localStorage.getItem("token"))) {
      dispatch(getRoleState());
      dispatch(getToken());
    }
    dispatch(getisLoginState());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingOne />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
