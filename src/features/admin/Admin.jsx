import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppstoreOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";

import styled from "styled-components";
import FooterLayout from "../../components/FooterLayout";
import Loading from "../../components/Loading";
import DashboardLayout from "./dashboard/DashboardLayout";
import AdminOrder from "./order/AdminOrder";
import PieChartOrder from "./order/PieChartOrder";
import AdminProduct from "./product/AdminProduct";
import AdminUser from "./user/AdminUser";

const { Header, Content, Sider } = Layout;

const StyledLogo = styled.div`
  text-align: center;
  margin-top: 8px;
`;

const Img = styled.img`
  height: 10rem;
  width: auto;
`;

const itemsMenu = [
  {
    key: "home",
    icon: <PieChartOutlined />,
    label: "Home",
  },
  {
    key: "user",
    icon: <UserOutlined />,
    label: "User",
  },
  {
    key: "product",
    icon: <AppstoreOutlined />,
    label: "Product",
  },
  {
    key: "order",
    icon: <ShoppingCartOutlined />,
    label: "Order",
  },
  {
    key: "setting",
    icon: <SettingOutlined />,
    label: "Setting",
  },
];

const App = () => {
  const [keySelected, setKeySelected] = useState("home");
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function handleClick({ key }) {
    setKeySelected(key);
  }

  return (
    <Loading isPending={false}>
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
            background: colorBgContainer,
          }}
        >
          <StyledLogo onClick={() => navigate("/")}>
            <Img src="/logo-light.png" alt="Logo" />
          </StyledLogo>

          <Menu
            // theme="dark"
            mode="inline"
            defaultSelectedKeys={["home"]}
            defaultOpenKeys={["home"]}
            items={itemsMenu}
            onClick={handleClick}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: 200,
          }}
        >
          {/* <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          /> */}
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

            {keySelected === "home" && <DashboardLayout />}

            {keySelected !== "home" && (
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                {keySelected === "home" && <PieChartOrder />}
                {keySelected === "user" && <AdminUser />}
                {keySelected === "product" && <AdminProduct />}
                {keySelected === "order" && <AdminOrder />}
                {keySelected === "setting" && <p>setting</p>}
              </div>
            )}
          </Content>

          <FooterLayout />
        </Layout>
      </Layout>
    </Loading>
  );
};
export default App;
