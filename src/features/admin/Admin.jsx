import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Breadcrumb, Layout, Menu, theme } from "antd";
import {
  AppstoreOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import * as OrderService from "../../services/OrderService";
import PieChartOrder from "./order/PieChartOrder";
import AdminUser from "./user/AdminUser";
import AdminProduct from "./product/AdminProduct";
import AdminOrder from "./order/AdminOrder";

const { Header, Content, Footer, Sider } = Layout;

const itemsMenu = [
  {
    key: "dashboard",
    icon: <PieChartOutlined />,
    label: "Dashboard",
  },
  {
    key: "user",
    icon: <UserOutlined />,
    label: "Tài khoản",
  },
  {
    key: "product",
    icon: <AppstoreOutlined />,
    label: "Sản phẩm",
  },
  {
    key: "order",
    icon: <ShoppingCartOutlined />,
    label: "Đơn hàng",
  },
  {
    key: "setting",
    icon: <SettingOutlined />,
    label: "Cài đặt",
  },
];

const App = () => {
  const [keySelected, setKeySelected] = useState("dashboard");
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function handleClick({ key }) {
    setKeySelected(key);
  }

  const user = useSelector((state) => state?.user);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const { isLoading: isLoadingOrders, data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" onClick={() => navigate("/")}>
          Logo
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          defaultOpenKeys={["dashboard"]}
          items={itemsMenu}
          onClick={handleClick}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px 0",
            overflow: "initial",
          }}
        >
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[
              { title: "Admin" },
              ...itemsMenu
                .filter((item) => keySelected === item.key)
                .map((item) => ({ title: item.label })),
            ]}
          />

          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {keySelected === "dashboard" && (
              <div style={{ height: 200, width: 200 }}>
                <PieChartOrder data={orders?.data} />
              </div>
            )}
            {keySelected === "dashboard" && <PieChartOrder />}
            {keySelected === "user" && <AdminUser />}
            {keySelected === "product" && <AdminProduct />}
            {keySelected === "order" && <AdminOrder />}
            {keySelected === "setting" && <p>setting</p>}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Mern Stack {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
