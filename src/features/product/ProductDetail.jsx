import { MinusOutlined, PlusOutlined, StarFilled } from "@ant-design/icons";
import { Row, Col, Image, InputNumber, Button, Spin, Rate } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils/helper";
import { addOrderProduct } from "../../redux/slices/orderSlide";

const StyledImageSmall = styled(Image)`
  height: "64px";
  width: "64px";
`;

const StyledColImageSmall = styled(Col)`
  flex-basis: "unset";
  display: "flex";
`;

const StyledStyleImageSmall = styled(Image)`
  height: 64px;
  width: 64px;
`;

const StyledStyleColImage = styled(Col)`
  flex-basis: unset;
  display: flex;
`;

const StyledStyleNameProduct = styled.h1`
  color: rgb(36, 36, 36);
  font-size: 24px;
  font-weight: 300;
  line-height: 32px;
  word-break: break-word;
`;

const StyledStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;

const StyledPriceProduct = styled.div`
  background: rgb(250, 250, 250);
  border-radius: 4px;
`;

const StyledPriceTextProduct = styled.h1`
  font-size: 32px;
  line-height: 40px;
  margin-right: 8px;
  font-weight: 500;
  padding: 10px;
  margin-top: 10px;
`;

const StyledAddressProduct = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsisl;
  }
  span.change-address {
    color: rgb(11, 116, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }
`;

const StyledQualityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  width: 120px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 40px;
    border-top: none;
    border-bottom: none;
    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
`;

function ProductDetail() {
  const { id: idProduct } = useParams();
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };
  const { isLoading, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  function handleAddOrderProduct() {
    if (!user?.id) {
      navigate("/sign-in", { state: location.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInStock: productDetails?.countInStock,
            image: productDetails?.image,
          },
        })
      );
    }
  }

  if (isLoading) return <Spin />;

  return (
    <Row
      style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "4px" }}
    >
      <Col
        span={10}
        style={{ borderRadius: "1px solid #e5e5e5", paddingRight: "8px" }}
      >
        <Image src={productDetails.image} alt="product" preview={false} />
        <Row style={{ paddingTop: "12px", justifyContent: "center" }}>
          <StyledColImageSmall span={4}>
            <StyledImageSmall
              src="/test-small.webp"
              alt="product"
              preview={false}
            />
          </StyledColImageSmall>
          <StyledColImageSmall span={4}>
            <StyledImageSmall
              src="/test-small.webp"
              alt="product"
              preview={false}
            />
          </StyledColImageSmall>
          <StyledColImageSmall span={4}>
            <StyledImageSmall
              src="/test-small.webp"
              alt="product"
              preview={false}
            />
          </StyledColImageSmall>
          <StyledColImageSmall span={4}>
            <StyledImageSmall
              src="/test-small.webp"
              alt="product"
              preview={false}
            />
          </StyledColImageSmall>
          <StyledColImageSmall span={4}>
            <StyledImageSmall
              src="/test-small.webp"
              alt="product"
              preview={false}
            />
          </StyledColImageSmall>
          <StyledColImageSmall span={4}>
            <StyledImageSmall
              src="/test-small.webp"
              alt="product"
              preview={false}
            />
          </StyledColImageSmall>
        </Row>
      </Col>

      <Col span={14} style={{ paddingLeft: "10px" }}>
        <StyledStyleNameProduct>{productDetails.name}</StyledStyleNameProduct>
        <div>
          <Rate
            allowHalf
            defaultValue={productDetails?.rating}
            value={productDetails?.rating}
          />
          <StyledStyleTextSell> | Da ban 100+</StyledStyleTextSell>
        </div>
        <StyledPriceProduct>
          <StyledPriceTextProduct>
            {convertPrice(productDetails?.price)}
          </StyledPriceTextProduct>
        </StyledPriceProduct>
        <StyledAddressProduct>
          <span>Giao den </span>
          <span className="address">{user?.address}</span>
          <span className="change-address"> Doi dia chi</span>
        </StyledAddressProduct>
        <div
          style={{
            margin: "10px 0 20px",
            padding: "10px 0",
            borderTop: "1px solid #e5e5e5",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div style={{ borderBottom: "10px" }}>So luong</div>
          <StyledQualityProduct>
            <button
              style={{ border: "none", backgroundColor: "transparent" }}
              onClick={() => handleChangeCount("decrease", numProduct === 1)}
            >
              <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
            </button>
            <StyledInputNumber
              onChange={onChange}
              defaultValue={1}
              max={productDetails?.countInStock}
              min={1}
              value={numProduct}
              size="small"
            />
            <button
              style={{ border: "none", backgroundColor: "transparent" }}
              onClick={() =>
                handleChangeCount(
                  "increase",
                  numProduct === productDetails?.countInStock
                )
              }
            >
              <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
            </button>
          </StyledQualityProduct>
        </div>
        <div style={{ display: " flex", alignItems: "center", gap: "12px" }}>
          <Button
            size="large"
            style={{
              backgroundColor: "rgb(255,57,69)",
              height: "48px",
              width: "220px",
              color: "#fff",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={handleAddOrderProduct}
          >
            Chon mua
          </Button>
          <Button
            size="large"
            style={{
              backgroundColor: "#fff",
              height: "48px",
              width: "220px",
              color: "rgb(13,92,183)",
              fontSize: "16px",
              border: "1px solid rgb(13,92,183)",
            }}
          >
            Mua tra sau
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default ProductDetail;
