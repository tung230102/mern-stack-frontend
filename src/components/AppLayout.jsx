import { Footer } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div>
      <Header />
      <Outlet />

      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Mern Stack {new Date().getFullYear()}
      </Footer>
    </div>
  );
}

export default AppLayout;
