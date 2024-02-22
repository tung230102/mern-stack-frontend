import { useQuery } from "@tanstack/react-query";
import { Button, Col, Row } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Text from "antd/es/typography/Text";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ImagePreview from "../../components/ImagePreview";
import * as Message from "../../components/Message";
import Spinner from "../../components/Spinner";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
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

  padding: 8px 16px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;

  border-bottom: 1px solid var(--color-grey-100);
  margin-bottom: 8px;
`;

const MyOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res?.data;
  };

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
  });

  function handleDetailsOrder(id) {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  }

  const {
    isPending,
    isSuccess,
    data: dataCancel,
    isError,
    mutate,
  } = useMutationHook((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutate(
      {
        id: order._id,
        token: state?.token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccess && dataCancel?.status === "OK") {
      Message.success();
    } else if (isSuccess && dataCancel?.status === "ERR") {
      Message.error(dataCancel?.message);
    } else if (isError) {
      Message.error();
    }
  }, [isError, isSuccess, dataCancel]);

  const renderProduct = (data) => {
    return (
      Array.isArray(data) &&
      data?.map((order) => (
        <StyledInfo key={order?._id}>
          <Row align="middle">
            <Col span={16}>
              <ImagePreview src={order?.image} />
              {order?.name}
            </Col>
            <Col span={8}>{convertPrice(order?.price)}</Col>
          </Row>
        </StyledInfo>
      ))
    );
  };

  if (isLoading || isPending) return <Spinner />;

  return (
    <StyledOrderProduct>
      <StyledSpan onClick={() => navigate("/")}>Trang chủ</StyledSpan>
      <Text> - Đơn hàng của tôi</Text>

      {Array.isArray(data) &&
        data?.map((order) => {
          return (
            <StyledInfo key={order?._id}>
              <StyledInfo>
                <Text strong>Trạng thái</Text>
                <Col>
                  <Text type="danger">Giao hàng: </Text>
                  {`${order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}`}
                </Col>
                <Col>
                  <Text type="danger">Thanh toán: </Text>
                  {`${order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`}
                </Col>
              </StyledInfo>
              {renderProduct(order?.orderItems)}
              <StyledInfo>
                <Row align="middle">
                  <Col span={16}>
                    <Text strong>Tổng tiền: </Text>
                    <Text type="danger">{convertPrice(order?.totalPrice)}</Text>
                  </Col>
                  <Col span={8}>
                    <Button
                      type="primary"
                      danger
                      onClick={() => handleCancelOrder(order)}
                    >
                      Hủy đơn hàng
                    </Button>
                    <Button onClick={() => handleDetailsOrder(order?._id)}>
                      Xem chi tiết
                    </Button>
                  </Col>
                </Row>
              </StyledInfo>
            </StyledInfo>
          );
        })}
    </StyledOrderProduct>
  );
};

export default MyOrder;
