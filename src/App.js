import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import AppLayout from "./components/AppLayout";
import Spinner from "./components/Spinner";
import OrderSuccess from "./features/order/OrderSuccess";
import AdminPage from "./pages/AdminPage";
import DetailOrderPage from "./pages/DetailOrderPage";
import HomePage from "./pages/HomePage";
import MyOrderPage from "./pages/MyOrderPage";
import OrderPage from "./pages/OrderPage";
import PageNotFound from "./pages/PageNotFound";
import PaymentPage from "./pages/PaymentPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductTypePage from "./pages/ProductTypePage";
import ProfilePage from "./pages/ProfilePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { resetUser, updateUser } from "./redux/slices/userSlice";
import * as UserService from "./services/UserService";
import GlobalStyles from "./styles/GlobalStyles";
import { isJsonString } from "./utils/helper";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const res = await UserService.getDetailsUser(id, token);
      dispatch(
        updateUser({
          ...res?.data,
          access_token: token,
          refreshToken: refreshToken,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    setIsLoading(true);
    const { decoded, storageData } = handleDecoded();

    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, [handleGetDetailsUser]);

  const handleDecoded = () => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};

    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date().getTime() / 1000;
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      if (decoded?.exp < currentTime) {
        if (decodedRefreshToken?.exp > currentTime) {
          const data = await UserService.refreshToken(refreshToken);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
          dispatch(resetUser());
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  if (isLoading) return <Spinner />;

  return (
    <>
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/my-order" element={<MyOrderPage />} />
            <Route path="/details-order/:id" element={<DetailOrderPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/product/:type" element={<ProductTypePage />} />
            <Route path="/product-detail/:id" element={<ProductDetailPage />} />
            <Route path="/profile-user" element={<ProfilePage />} />
          </Route>
          {user?.isAdmin && (
            <Route path="/system/admin" element={<AdminPage />} />
          )}

          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
