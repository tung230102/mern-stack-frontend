import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Col, Popover, Row } from "antd";

import Text from "antd/es/typography/Text";
import { useEffect, useState } from "react";
import SearchProduct from "../features/product/SearchProduct";
import { resetUser } from "../redux/slices/userSlice";
import * as UserService from "../services/UserService";
import ImagePreview from "./ImagePreview";
import Loading from "./Loading";

const StyledCursorPopover = styled.p`
  cursor: pointer;
  &:hover {
    color: var(--color-brand-600);
  }
`;

const StyledRow = styled(Row)`
  width: 100%;
  height: 100%;
  padding: 8px 40px;
  background-color: var(--color-brand-600);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCol = styled(Col)`
  display: flex;
  justify-content: space-evenly;
`;

const StyleLink = styled(Link)`
  font-size: 2rem;
  color: var(--color-grey-0);
  &:hover {
    color: var(--color-grey-0);
  }
`;

const StyledHeaderItem = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-grey-0);
`;

const StyledIcon = styled.span`
  color: var(--color-grey-0);
  font-size: 2.4rem;
  padding: 4px;
`;

const StyledText = styled(Text)`
  color: var(--color-grey-0);
  cursor: pointer;
`;

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state?.order.orderItems.length);

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  async function handleLogout() {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    localStorage.removeItem("access_token");
    navigate("/");
    setLoading(false);
  }

  const content = (
    <>
      <StyledCursorPopover
        onClick={() =>
          navigate("/my-order", {
            state: {
              id: user?.id,
              token: user?.access_token,
            },
          })
        }
      >
        My Order
      </StyledCursorPopover>
      <StyledCursorPopover onClick={() => navigate("/profile-user")}>
        User Info
      </StyledCursorPopover>
      {user?.isAdmin && (
        <StyledCursorPopover onClick={() => navigate("/system/admin")}>
          System
        </StyledCursorPopover>
      )}
      <StyledCursorPopover onClick={handleLogout}>Log Out</StyledCursorPopover>
    </>
  );

  return (
    <StyledRow>
      <Col span={6}>
        <StyleLink to="/">MobileMart</StyleLink>
      </Col>

      <Col span={12}>
        <SearchProduct />
      </Col>

      <StyledCol span={6}>
        <Loading isPending={loading}>
          <StyledHeaderItem>
            {userAvatar ? (
              <ImagePreview
                size={32}
                src={userAvatar}
                borderRadius="50%"
                border="none"
              />
            ) : (
              <StyledIcon>
                <UserOutlined />
              </StyledIcon>
            )}

            {user?.name ? (
              <Popover
                placement="bottomRight"
                content={content}
                trigger="hover"
              >
                <StyledText>{userName}</StyledText>
              </Popover>
            ) : (
              <>
                <StyledText onClick={() => navigate("/sign-in")}>
                  Login /
                </StyledText>

                <StyledText onClick={() => navigate("/sign-up")}>
                  Sign Up
                </StyledText>
              </>
            )}
          </StyledHeaderItem>
        </Loading>
        {user?.name && (
          <StyledHeaderItem onClick={() => navigate("/order")}>
            <Badge count={order} size="small">
              <StyledIcon>
                <ShoppingCartOutlined />
              </StyledIcon>
            </Badge>
            <StyledText>Cart</StyledText>
          </StyledHeaderItem>
        )}
      </StyledCol>
    </StyledRow>
  );
}

export default Header;
