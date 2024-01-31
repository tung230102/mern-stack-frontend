import { StarFilled } from "@ant-design/icons";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { convertPrice } from "../../utils/helper";

export const StyledCardStyle = styled(Card)`
  width: 200px;
  height: 100%;
  border: 2px solid var(--color-grey-100);

  & img {
    height: 200px;
    width: 200px;
  }
  position: relative;
`;

const StyleNameProduct = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
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

function ProductItemCard({ product }) {
  const { image, name, price, rating, _id, sold, discount } = product;
  const navigate = useNavigate();

  return (
    <div>
      <StyledCardStyle
        hoverable
        headStyle={{ width: "200px", height: "200px" }}
        bodyStyle={{ padding: 8, overflow: "hidden" }}
        cover={<img alt="example" src={image} />}
        onClick={() => navigate(`/product-detail/${_id}`)}
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
            borderTopLeftRadius: "4px",
          }}
        />
        <StyleNameProduct>{name}</StyleNameProduct>
        <StyledReportText>
          <span style={{ marginRight: "4px" }}>
            <span>{rating} </span>
            <StarFilled style={{ fontSize: "12px", color: "#fadb14" }} />
          </span>
          <span> | Đã bán {sold || 100}+</span>
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
