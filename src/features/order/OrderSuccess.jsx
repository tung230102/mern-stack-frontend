import React from "react";
import { useLocation } from "react-router-dom";
import {
  Label,
  StyledContainer,
  StyledInfo,
  StyledItemOrder,
  StyledItemOrderInfo,
  StyledValue,
} from "./style";
import { orderConstant } from "../../utils/constants";
import { convertPrice } from "../../utils/helper";

const OrderSuccess = () => {
  const { state } = useLocation();

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Đơn hàng đặt thành công</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <StyledContainer>
            <StyledInfo>
              <div>
                <Label>Phương thức giao hàng</Label>
                <StyledValue>
                  <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                    {orderConstant.delivery[state?.delivery]}
                  </span>{" "}
                  Giao hàng tiết kiệm
                </StyledValue>
              </div>
            </StyledInfo>
            <StyledInfo>
              <div>
                <Label>Phương thức thanh toán</Label>

                <StyledValue>
                  {orderConstant.payment[state?.payment]}
                </StyledValue>
              </div>
            </StyledInfo>
            <StyledItemOrderInfo>
              {state?.orders?.map((order) => {
                return (
                  <StyledItemOrder key={order?.name}>
                    <div
                      style={{
                        width: "500px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <img
                        alt="order_image"
                        src={order.image}
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
                        gap: "10px",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          Giá tiền: {convertPrice(order?.price)}
                        </span>
                      </span>
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          Số lượng: {order?.amount}
                        </span>
                      </span>
                    </div>
                  </StyledItemOrder>
                );
              })}
            </StyledItemOrderInfo>
            <div>
              <span style={{ fontSize: "16px", color: "red" }}>
                Tổng tiền: {convertPrice(state?.totalPriceMemo)}
              </span>
            </div>
          </StyledContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
