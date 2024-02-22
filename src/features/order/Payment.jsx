import { Col, Form, Modal, Radio, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Text from "antd/es/typography/Text";
import styled from "styled-components";
import ButtonDefault from "../../components/ButtonDefault";
import * as Message from "../../components/Message";
import Spinner from "../../components/Spinner";
import { removeAllOrderProduct } from "../../redux/slices/orderSlide";
import { updateUser } from "../../redux/slices/userSlice";
import * as OrderService from "../../services/OrderService";
import * as PaymentService from "../../services/PaymentService";
import * as UserService from "../../services/UserService";
import { convertPrice } from "../../utils/helper";
import FormAddress from "./FormAddress";
import Paypal from "./Paypal";

const initialValue = () => ({
  name: "",
  phone: "",
  address: "",
  city: "",
});

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

  &.margin-right {
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;

const StyledRadio = styled(Radio.Group)`
  margin-top: 4px;
  background-color: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Payment = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState(initialValue());

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");

  // Handle Calculate Price
  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order, priceMemo]);

  const deliveryPriceMemo = useMemo(() => {
    if (order?.orderItemsSelected?.length === 0) return 0;

    if (priceMemo < 200000) {
      return 20000;
    } else if (priceMemo < 500000) {
      return 30000;
    }

    return 0;
  }, [priceMemo, order]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);
  // End handle Calculate Price

  // Handle payment
  function handleCancelUpdate() {
    setStateUserDetails(initialValue());
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  }

  function handleChangeDetails(e) {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  }

  const mutationUpdate = useMutation({
    mutationFn: (data) => {
      const { id, token, ...rests } = data;
      return UserService.updateUser(id, { ...rests }, token);
    },
  });

  const { isPending } = mutationUpdate;

  function handleUpdateInfoUser() {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(
              updateUser({ ...stateUserDetails, name, address, city, phone })
            );
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  }

  // get detail user
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo, user]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      form.setFieldsValue(stateUserDetails);
    }
  }, [form, stateUserDetails, isOpenModalUpdateInfo]);
  // End handle payment

  // Handle address
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };
  // End handle address

  // Handle delivery
  function handleDelivery(e) {
    setDelivery(e.target.value);
  }

  function handlePayment(e) {
    setPayment(e.target.value);
  }

  const mutationAddOrder = useMutation({
    mutationFn: (data) => {
      const { token, ...rests } = data;
      return OrderService.createOrder({ ...rests }, token);
    },
  });

  const {
    data: dataAdd,
    isPending: isLoadingAddOrder,
    isSuccess,
  } = mutationAddOrder;

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      Message.success("Đặt hàng thành công");
      navigate("/order-success", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isSuccess && dataAdd?.status === "ERR") {
      Message.error();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, dataAdd, navigate, dispatch]);
  // End handle delivery

  // Paypal
  const [sdkReady, setSdkReady] = useState(false);

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderItemsSelected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
      email: user?.email,
    });
  };
  // End paypal

  if (isPending || isLoadingAddOrder) return <Spinner />;

  return (
    <StyledOrderProduct>
      <StyledSpan onClick={() => navigate("/")}>Trang chủ</StyledSpan>
      <Text> - Giỏ hàng</Text>
      <Row>
        <Col span={18}>
          <StyledInfo className="margin-right">
            <div>
              <Text strong>Chọn phương thức giao hàng</Text>
              <StyledRadio onChange={handleDelivery} value={delivery}>
                <Radio value="fast">
                  <Text style={{ color: "#ea8500", fontWeight: "bold" }}>
                    FAST
                  </Text>
                  Giao hàng tiết kiệm
                </Radio>
                <Radio value="gojek">
                  <Text style={{ color: "#ea8500", fontWeight: "bold" }}>
                    GO_JEK
                  </Text>
                  Giao hàng tiết kiệm
                </Radio>
              </StyledRadio>
            </div>
          </StyledInfo>
          <StyledInfo className="margin-right">
            <div>
              <Text strong>Chọn phương thức thanh toán</Text>
              <StyledRadio onChange={handlePayment} value={payment}>
                <Radio value="later_money">
                  Thanh toán tiền mặt khi nhận hàng
                </Radio>
                <Radio value="paypal">Thanh toán tiền bằng paypal</Radio>
              </StyledRadio>
            </div>
          </StyledInfo>
        </Col>

        <Col span={6}>
          <StyledInfo>
            <Text strong>Địa chỉ: </Text>
            <Text underline>{`${user?.address}, ${user?.city} `}</Text>
            <StyledSpan onClick={handleChangeAddress}>Thay đổi</StyledSpan>
          </StyledInfo>
          <StyledInfo>
            <Row>
              <Col span={8}>
                <Text strong>Tạm tính: </Text>
              </Col>
              <Col span={10} offset={6}>
                <Text>{convertPrice(priceMemo)}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Giảm giá: </Text>
              </Col>
              <Col span={10} offset={6}>
                <Text>{convertPrice(priceDiscountMemo)}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Phí giao hàng:</Text>
              </Col>
              <Col span={10} offset={6}>
                <Text>{convertPrice(deliveryPriceMemo)}</Text>
              </Col>
            </Row>
          </StyledInfo>
          <StyledInfo>
            <Row>
              <Col span={8}>
                <Text strong>Tổng tiền</Text>
              </Col>
              <Col span={10} offset={6}>
                <Text type="danger">{convertPrice(totalPriceMemo)}</Text>
              </Col>
            </Row>
          </StyledInfo>
          {payment === "paypal" && sdkReady ? (
            <div style={{ width: "320px" }}>
              <Paypal
                amount={Math.round(totalPriceMemo / 24590)}
                onSuccess={onSuccessPaypal}
              />
            </div>
          ) : (
            <ButtonDefault
              text="Đặt hàng"
              onClick={handleAddOrder}
              marginTop={8}
            />
          )}
        </Col>
      </Row>

      {/* Modal */}
      <Modal
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        <FormAddress
          form={form}
          state={stateUserDetails}
          onChange={handleChangeDetails}
          disabled={isPending}
        />
      </Modal>
    </StyledOrderProduct>
  );
};

export default Payment;
