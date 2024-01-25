import { Button, Form, Modal, Radio } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  Label,
  StyledInfo,
  StyledLeft,
  StyledRadio,
  StyledRight,
  StyledTotal,
} from "./style";

import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as Message from "../../components/Message";
import { updateUser } from "../../redux/slices/userSlice";
import * as OrderService from "../../services/OrderService";
import * as UserService from "../../services/UserService";
import Spinner from "../../ui/Spinner";
import { convertPrice } from "../../utils/helper";
import FormOrder from "./FormOrder";
import { removeAllOrderProduct } from "../../redux/slices/orderSlide";

const initialValue = () => ({
  name: "",
  phone: "",
  address: "",
  city: "",
});

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
  // const [sdkReady, setSdkReady] = useState(false);

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
    // if (priceMemo >= 20000 && priceMemo < 500000) {
    //   return 10000;
    // } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
    //   return 30000;
    // } else {
    //   return 20000;
    // }

    if (priceMemo >= 20000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
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
  }, [
    isSuccess,
    dataAdd,
    navigate,
    delivery,
    payment,
    order,
    totalPriceMemo,
    dispatch,
  ]);

  // const onSuccessPaypal = (details, data) => {
  //   mutationAddOrder.mutate({
  //     token: user?.access_token,
  //     orderItems: order?.orderItemsSelected,
  //     fullName: user?.name,
  //     address: user?.address,
  //     phone: user?.phone,
  //     city: user?.city,
  //     paymentMethod: payment,
  //     itemsPrice: priceMemo,
  //     shippingPrice: deliveryPriceMemo,
  //     totalPrice: totalPriceMemo,
  //     user: user?.id,
  //     isPaid: true,
  //     paidAt: details.update_time,
  //     email: user?.email,
  //   });
  // };

  // End handle delivery

  if (isPending || isLoadingAddOrder) return <Spinner />;

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <StyledLeft>
            <StyledInfo>
              <div>
                <Label>Chọn phương thức giao hàng</Label>
                <StyledRadio onChange={handleDelivery} value={delivery}>
                  <Radio value="fast">
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      FAST
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </Radio>
                  <Radio value="gojek">
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      GO_JEK
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </Radio>
                </StyledRadio>
              </div>
            </StyledInfo>
            <StyledInfo>
              <div>
                <Label>Chọn phương thức thanh toán</Label>
                <StyledRadio onChange={handlePayment} value={payment}>
                  <Radio value="later_money">
                    {" "}
                    Thanh toán tiền mặt khi nhận hàng
                  </Radio>
                  <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                </StyledRadio>
              </div>
            </StyledInfo>
          </StyledLeft>
          <StyledRight>
            <div style={{ width: "100%" }}>
              <StyledInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {`${user?.address} ${user?.city} `}
                  </span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "#9255FD", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                </div>
              </StyledInfo>
              <StyledInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Giảm giá</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceDiscountMemo)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(deliveryPriceMemo)}
                  </span>
                </div>
              </StyledInfo>
              <StyledTotal>
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254, 56, 52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span style={{ color: "#000", fontSize: "11px" }}>
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </StyledTotal>
            </div>
            <Button
              size={40}
              style={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
              onClick={() => handleAddOrder()}
            >
              Đặt hàng
            </Button>
          </StyledRight>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        <FormOrder
          form={form}
          state={stateUserDetails}
          onChange={handleChangeDetails}
          disabled={isPending}
        />
      </Modal>
    </div>
  );
};

export default Payment;
