import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Col, Popover, Row } from "antd";

import InputSearch from "./InputSearch";
import * as UserService from "../services/UserService";
import { resetUser } from "../redux/slices/userSlice";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import SearchProduct from "../features/product/SearchProduct";

const StyledRow = styled(Row)`
  padding: 10px 120px;
  background-color: var(--primary-color);
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
`;

export const StyledTextHeader = styled.span`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
`;

export const StyledHeaderAccout = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
`;

const StyledSpan = styled.span`
  color: var(--color-grey-0);
  font-size: 1.4rem;
  white-space: nowrap;
`;

const StyledIcon = styled.span`
  color: var(--color-grey-0);
  font-size: 2.4rem;
  padding: 4px;
`;

const StyledCursor = styled.p`
  cursor: pointer;
  &:hover {
    color: #4096ff;
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const StyleLink = styled(Link)`
  font-size: 20px;
  color: white;
  &:hover {
    color: white;
  }
`;

function Header() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const order = useSelector((state) => state?.order.orderItems.length);

  useEffect(() => {
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
  }, [user?.name, user?.avatar]);

  function handleNavigate() {
    navigate("/sign-in");
  }

  async function handleLogout() {
    await UserService.logoutUser();
    dispatch(resetUser());
    // localStorage.removeItem("access_token");
    localStorage.removeItem("access_token");
  }

  const content = (
    <div>
      <StyledCursor onClick={handleLogout}>Đăng xuất</StyledCursor>
      <StyledCursor onClick={() => navigate("/my-order")}>
        Don hang cua toi
      </StyledCursor>
      <StyledCursor onClick={() => navigate("/profile-user")}>
        Thông tin người dùng
      </StyledCursor>
      {user?.isAdmin && (
        <StyledCursor onClick={() => navigate("/system/admin")}>
          Quản lý hệ thống
        </StyledCursor>
      )}
    </div>
  );

  return (
    <StyledRow gutter={16}>
      <Col span={6}>
        <StyleLink to="/">Mern Stack</StyleLink>
      </Col>

      <Col span={12}>
        <SearchProduct />
      </Col>

      <StyledCol span={6}>
        <StyledHeaderAccout>
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="avatar"
              style={{
                height: "32px",
                width: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "4px",
              }}
            />
          ) : (
            <StyledIcon>
              <UserOutlined />
            </StyledIcon>
          )}

          {user?.name ? (
            <Popover placement="bottomRight" content={content} trigger="hover">
              <p style={{ cursor: "pointer" }}>{userName}</p>
            </Popover>
          ) : (
            <div>
              <StyledSpan
                onClick={handleNavigate}
                style={{ cursor: "pointer" }}
              >
                Đăng nhập/Đăng ký
              </StyledSpan>
              <div>
                <StyledSpan>Tài khoản</StyledSpan>
                <CaretDownOutlined />
              </div>
            </div>
          )}
        </StyledHeaderAccout>

        <div onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
          <Badge count={order} size="small">
            <StyledIcon>
              <ShoppingCartOutlined />
            </StyledIcon>
          </Badge>
          <StyledSpan>Giỏ hàng</StyledSpan>
        </div>
      </StyledCol>
    </StyledRow>
  );
}

export default Header;
