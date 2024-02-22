import { DeleteOutlined } from "@ant-design/icons";
import { Checkbox, Col, Form, Modal, Row, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ButtonDefault from "../../components/ButtonDefault";
import FormNumber from "../../components/FormNumber";
import ImagePreview from "../../components/ImagePreview";
import * as Message from "../../components/Message";
import StepOrder from "../../components/StepOrder";
import { useMutationHook } from "../../hooks/useMutationHook";
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
import FormAddress from "./FormAddress";
const { Title, Text } = Typography;

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

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
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
    <StyledOrderProduct>
      <StyledSpan onClick={() => navigate("/")}>Trang chủ</StyledSpan>
      <Text> - Giỏ hàng</Text>
      <Row>
        <Col span={18}>
          <StyledInfo className="margin-right">
            <StepOrder
              deliveryPriceMemo={deliveryPriceMemo}
              length={order?.orderItemsSelected?.length}
            />
          </StyledInfo>
          <StyledInfo className="margin-right">
            <Row>
              <Col span={11}>
                <Checkbox
                  onChange={handleCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></Checkbox>{" "}
                Tất cả ({order?.orderItems?.length} sản phẩm)
              </Col>
              <Col span={4}>Đơn giá</Col>
              <Col span={4}>Số lượng</Col>
              <Col span={4}>Thành tiền</Col>
              <Col span={1}>
                <DeleteOutlined onClick={handleRemoveAllOrder} />
              </Col>
            </Row>
          </StyledInfo>

          {order?.orderItems?.map((order) => {
            return (
              <StyledInfo className="margin-right" key={order.name}>
                <Row align="middle">
                  <Col span={11}>
                    <Checkbox
                      onChange={handleCheck}
                      value={order?.product}
                      checked={listChecked.includes(order?.product)}
                    ></Checkbox>
                    <ImagePreview src={order?.image} /> {order?.name}
                  </Col>
                  <Col span={4}> {convertPrice(order?.price)}</Col>
                  <Col span={4}>
                    <FormNumber
                      onClickDecrease={() =>
                        handleChangeCount(
                          "decrease",
                          order?.product,
                          order?.amount === 1
                        )
                      }
                      onClickIncrease={() =>
                        handleChangeCount(
                          "increase",
                          order?.product,
                          order?.amount === order.countInStock,
                          order?.amount === 1
                        )
                      }
                      defaultValue={order?.amount}
                      value={order?.amount}
                      max={order?.countInStock}
                      width={"40%"}
                    />
                  </Col>
                  <Col span={4}>
                    <Title level={5} type="danger">
                      {convertPrice(order?.price * order?.amount)}
                    </Title>
                  </Col>
                  <Col span={1}>
                    <DeleteOutlined
                      onClick={() => handleDeleteOrder(order?.product)}
                    />
                  </Col>
                </Row>
              </StyledInfo>
            );
          })}
        </Col>

        <Col span={6}>
          <StyledInfo>
            <Text strong>Địa chỉ: </Text>
            {user?.address && user?.city ? (
              <Text underline>{`${user?.address}, ${user?.city}`}</Text>
            ) : null}
            <StyledSpan onClick={handleChangeAddress}> Thay đổi</StyledSpan>
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

          <ButtonDefault
            text="Mua hàng"
            onClick={handleAddCard}
            marginTop={8}
          />
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

export default OrderProduct;
