import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import PageNotFound from "./pages/PageNotFound";
import ProductDetailPage from "./pages/ProductDetailPage";
// import ProductPage from "./pages/ProductPage";
import ProductTypePage from "./pages/ProductTypePage";
import ProfilePage from "./pages/ProfilePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { updateUser } from "./redux/slices/userSlice";
import * as UserService from "./services/UserService";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import { isJsonString } from "./utils/helper";
import Spinner from "./ui/Spinner";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./features/order/OrderSuccess";
import MyOrderPage from "./pages/MyOrderPage";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
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
    let storageData = localStorage.getItem("access_token");
    let decoded = {};

    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date().getTime() / 1000;
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
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
            <Route path="/payment" element={<PaymentPage />} />
            {/* <Route path="/products" element={<ProductPage />} /> */}
            <Route path="/product/:type" element={<ProductTypePage />} />
            <Route path="/product-detail/:id" element={<ProductDetailPage />} />
            <Route path="/profile-user" element={<ProfilePage />} />
            {user?.isAdmin && (
              <Route path="/system/admin" element={<AdminPage />} />
            )}
          </Route>

          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
