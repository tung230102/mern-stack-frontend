import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import AdminProduct from "./product/AdminProduct";
import AdminUser from "./user/AdminUser";

const StyleMenu = styled(Menu)`
  height: 100vh;
  box-shadow: 1px 1px 2px #ccc;
  & .anticon {
    padding: 8px;
  }
  & .ant-menu-item-selected .anticon.ant-menu-item-icon {
    background: rgb(24, 144, 255);
    color: #fff;
    border-radius: 8px;
  }
`;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Dashboard", "dashboard", <PieChartOutlined />),
  getItem("Người dùng", "user", <MailOutlined />),
  getItem("Sản phẩm", "product", <AppstoreOutlined />),
  getItem("Cài đặt", "setting", <SettingOutlined />),
];

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [keySelected, setKeySelected] = useState("");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  function handleClick({ key }) {
    setKeySelected(key);
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: !collapsed && "256px" }}>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <StyleMenu
          defaultSelectedKeys={["product"]}
          defaultOpenKeys={["product"]}
          mode="inline"
          // theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          onClick={handleClick}
        />
      </div>

      <div style={{ flex: 1, padding: 20 }}>
        {keySelected === "dashboard" && <p>dashboard</p>}
        {keySelected === "user" && <AdminUser />}
        {keySelected === "product" && <AdminProduct />}
        {keySelected === "setting" && <p>setting</p>}
      </div>
    </div>
  );
};
export default Admin;
