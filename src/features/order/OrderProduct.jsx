import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  StyledCountOrder,
  StyledHeaderDelivery,
  StyledInfo,
  StyledItemOrder,
  StyledLeft,
  StyledListOrder,
  StyledRight,
  StyledStyleHeader,
  StyledTotal,
} from "./style";

import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Message from "../../components/Message";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slices/orderSlide";
import { updateUser } from "../../redux/slices/userSlice";
import * as UserService from "../../services/UserService";
import { convertPrice } from "../../utils/helper";
import FormOrder from "./FormOrder";
import { useMutationHook } from "../../hooks/useMutationHook";
import StepOrder from "../../components/StepOrder";

const initialValue = () => ({
  name: "",
  phone: "",
  address: "",
  city: "",
});

const OrderProduct = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState(initialValue());

  // Handle quantity product order
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const handleCheck = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct) => {
    if (type === "increase") {
      dispatch(increaseAmount({ idProduct }));
    } else {
      dispatch(decreaseAmount({ idProduct }));
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };
  // End handle quantity product order

  // Handle Calculate Price
  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);

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
    // if (priceMemo < 20000) {
    //   return 20000;
    // } else if (priceMemo >= 20000 && priceMemo < 500000) {
    //   return 30000;
    // } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
    //   return 30000;
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
  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      Message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

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

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isPending, data } = mutationUpdate;

  function handleUpdateInfoUser() {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
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

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <StyledLeft>
            <h4>Phí giao hàng</h4>
            <StyledHeaderDelivery>
              <StepOrder
                deliveryPriceMemo={deliveryPriceMemo}
                length={order?.orderItemsSelected?.length}
              />
            </StyledHeaderDelivery>
            <StyledStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox
                  onChange={handleCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></Checkbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllOrder}
                />
              </div>
            </StyledStyleHeader>
            <StyledListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <StyledItemOrder key={order.name}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Checkbox
                        onChange={handleCheck}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></Checkbox>
                      <img
                        alt="order"
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          width: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          {convertPrice(order?.price)}
                        </span>
                      </span>
                      <StyledCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount("decrease", order?.product)
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                        <Input
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount("increase", order?.product)
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                      </StyledCountOrder>
                      <span
                        style={{
                          color: "rgb(255, 66, 78)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </div>
                  </StyledItemOrder>
                );
              })}
            </StyledListOrder>
          </StyledLeft>
          <StyledRight>
            <div style={{ width: "100%" }}>
              <StyledInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {`${user?.address}, ${user?.city} `}
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
              // onClick={() => handleAddCard(productDetails, numProduct)}
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
              onClick={handleAddCard}
            >
              Mua hàng
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
          // onUpLoad={handleUploadDetails}
          // onCancel={() => setIsOpenDrawer(false)}
        />
      </Modal>
    </div>
  );
};

export default OrderProduct;
