import { StarFilled } from "@ant-design/icons";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { convertPrice } from "../../utils/helper";

export const StyledCardStyle = styled(Card)`
  width: 200px;
  & img {
    height: 200px;
    width: 200px;
  }
  position: relative;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#fff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const StyleNameProduct = styled.div`
  font-weight: 400;

  font-size: 12px;
  line-height: 16px;
  color: rgb(56, 56, 61);
  font-weight: 400;
`;

const StyledReportText = styled.div`
  font-size: 11px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  margin: 6px 0 0px;
`;

const StyledPriceText = styled.div`
  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 500;
`;

const StyledDiscountText = styled.span`
  color: rgb(255, 66, 78);
  font-size: 12px;
  font-weight: 500;
`;

const StyledStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;

function ProductItemCard({ product }) {
  const {
    countInStock,
    description,
    image,
    name,
    price,
    rating,
    type,
    _id,
    sold,
    discount,
  } = product;
  const navigate = useNavigate();

  // function handleDetailsProduct(id) {
  //   navigate(`/product-detail/${id}`);
  // }

  return (
    <div>
      <StyledCardStyle
        hoverable
        headStyle={{ width: "200px", height: "200px" }}
        style={{ width: 200 }}
        bodyStyle={{ padding: "10px" }}
        cover={<img alt="example" src={image} />}
        onClick={() => countInStock !== 0 && navigate(`/product-detail/${_id}`)}
        disabled={countInStock === 0}
      >
        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: "89px",
            height: "20px",
            position: "absolute",
            top: -1,
            left: -1,
            borderTopLeftRadius: "3px",
          }}
        />
        <StyleNameProduct>{name}</StyleNameProduct>
        <StyledReportText>
          <span style={{ marginRight: "4px" }}>
            <span>{rating} </span>
            <StarFilled style={{ fontSize: "12px", color: "#fadb14" }} />
          </span>
          <span> | Đã bán {sold || 1000}+</span>
        </StyledReportText>
        <StyledPriceText>
          {convertPrice(price)}
          <StyledDiscountText> {discount || 5}%</StyledDiscountText>{" "}
        </StyledPriceText>
      </StyledCardStyle>
    </div>
  );
}

export default ProductItemCard;
