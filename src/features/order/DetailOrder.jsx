import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import styled from "styled-components";
import ImagePreview from "../../components/ImagePreview";
import Loading from "../../components/Loading";
import * as OrderService from "../../services/OrderService";
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
  margin-bottom: 8px;
  min-height: 130px;

  &.margin-right {
    margin-right: 8px;
  }
`;

function DetailOrder() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const { isPending, data } = useQuery({
    queryKey: ["orders-details"],
    queryFn: fetchDetailsOrder,
    enabled: !!id,
  });

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);

  return (
    <Loading isPending={isPending}>
      <StyledOrderProduct>
        <StyledSpan onClick={() => navigate("/")}>Trang chủ</StyledSpan>
        <Text> - Chi tiết đơn hàng</Text>
        <Row>
          <Col span={8}>
            <StyledInfo className="margin-right">
              <Title level={4}>Địa chỉ người nhận</Title>
              <p>
                <Text strong>Tên người nhận: </Text>
                {data?.shippingAddress?.fullName}
              </p>
              <p>
                <Text strong>Địa chỉ: </Text>{" "}
                {`${data?.shippingAddress?.address}, ${data?.shippingAddress?.city}`}
              </p>
              <p>
                <Text strong>Điện thoại: </Text> {data?.shippingAddress?.phone}
              </p>
            </StyledInfo>
          </Col>
          <Col span={8}>
            <StyledInfo className="margin-right">
              <Title level={4}>Hình thức giao hàng</Title>
              <p>
                <Text type="warning">FAST </Text>
                Giao hàng tiết kiệm
              </p>
              <p>
                <Text strong>Phí giao hàng: </Text> {data?.shippingPrice}
              </p>
            </StyledInfo>
          </Col>
          <Col span={8}>
            <StyledInfo>
              <Title level={4}>Hình thức thanh toán</Title>
              <p>
                <Text>{orderConstant.payment[data?.paymentMethod]}</Text>
              </p>
              <p>
                <Text type="warning">
                  {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </Text>
              </p>
            </StyledInfo>
          </Col>
        </Row>
        <StyledInfo>
          <Row>
            <Col span={12}>
              <Title level={5}>Sản phẩm</Title>
            </Col>
            <Col span={4}>
              <Title level={5}>Giá</Title>
            </Col>
            <Col span={4}>
              <Title level={5}>Số lượng</Title>
            </Col>
            <Col span={4}>
              <Title level={5}>Giảm giá</Title>
            </Col>
          </Row>

          {data?.orderItems?.map((order) => {
            return (
              <Row key={order?._id} align="middle">
                <Col span={12}>
                  <ImagePreview src={order?.image} />
                  {order?.name}
                </Col>
                <Col span={4}>
                  <Text strong>{convertPrice(order?.price)}</Text>
                </Col>
                <Col span={4}>{order?.amount}</Col>
                <Col span={4}>
                  <Text strong>
                    {order?.discount
                      ? convertPrice((priceMemo * order?.discount) / 100)
                      : "0 VND"}
                  </Text>
                </Col>
              </Row>
            );
          })}
        </StyledInfo>
        <StyledInfo>
          <Row>
            <Col span={8}>
              <Title level={4}>Tạm tính</Title>
              <Text strong>{convertPrice(priceMemo)}</Text>
            </Col>
            <Col span={8}>
              <Title level={4}>Phí vận chuyển</Title>
              <Text strong>{convertPrice(data?.shippingPrice)}</Text>
            </Col>
            <Col span={8}>
              <Title level={4}>Tổng cộng</Title>
              <Title level={5} type="danger">
                {convertPrice(data?.totalPrice)}
              </Title>
            </Col>
          </Row>
        </StyledInfo>
      </StyledOrderProduct>
    </Loading>
  );
}

export default DetailOrder;
