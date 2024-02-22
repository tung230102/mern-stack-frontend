import { Outlet } from "react-router-dom";
import FooterLayout from "./FooterLayout";
import Header from "./Header";

function AppLayout() {
  return (
    <div>
      <Header />
      <Outlet />

      <FooterLayout />
    </div>
  );
}

export default AppLayout;
