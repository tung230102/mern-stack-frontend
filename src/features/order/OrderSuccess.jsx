import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Col, Row } from "antd";
import Text from "antd/es/typography/Text";
import styled from "styled-components";
import ImagePreview from "../../components/ImagePreview";
import { orderConstant } from "../../utils/constants";
import { convertPrice } from "../../utils/helper";

const StyledOrderProduct = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 40px;
  background-color: var(--color-grey-100);
`;

const StyledSpan = styled(Text)`
  font-weight: 700;
  font-size: 1.6rem;
  cursor: pointer;
  &:hover {
    color: var(--color-brand-600);
  }
`;

const StyledInfo = styled.div`
  background-color: var(--color-grey-0);
  border-bottom: 1px solid var(--color-grey-100);
  padding: 12px 16px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

const StyledValue = styled.div`
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  padding: 8px;
  width: fit-content;
  border-radius: 4px;
  margin-top: 4px;
`;

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <StyledOrderProduct>
      <StyledSpan onClick={() => navigate("/")}>Trang chủ</StyledSpan>
      <Text> - Đơn hàng đặt thành công</Text>

      <Row>
        <Col span={24}>
          <StyledInfo>
            <Text strong>Phương thức giao hàng</Text>
            <StyledValue>
              <Text style={{ color: "#ea8500", fontWeight: "bold" }}>
                {orderConstant.delivery[state?.delivery]}
              </Text>{" "}
              Giao hàng tiết kiệm
            </StyledValue>
          </StyledInfo>
          <StyledInfo>
            <Text strong>Phương thức thanh toán</Text>
            <StyledValue>{orderConstant.payment[state?.payment]}</StyledValue>
          </StyledInfo>

          <StyledInfo>
            {state?.orders?.map((order) => {
              return (
                <Row align="middle" key={order?.name}>
                  <Col span={10}>
                    <ImagePreview src={order.image} /> {order?.name}
                  </Col>
                  <Col span={4}>
                    <Text style={{ fontSize: "13px", color: "#242424" }}>
                      Đơn giá: {convertPrice(order?.price)}
                    </Text>
                  </Col>
                  <Col span={4}>
                    <Text style={{ fontSize: "13px", color: "#242424" }}>
                      Số lượng: {order?.amount}
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Text style={{ fontSize: "16px", color: "red" }}>
                      Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                    </Text>
                  </Col>
                </Row>
              );
            })}
          </StyledInfo>
        </Col>
      </Row>
    </StyledOrderProduct>
  );
};

export default OrderSuccess;
