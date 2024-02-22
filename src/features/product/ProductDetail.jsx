import { useQuery } from "@tanstack/react-query";
import { Col, Image, Rate, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import ButtonDefault from "../../components/ButtonDefault";
import ButtonLike from "../../components/ButtonLike";
import Comments from "../../components/Comments";
import FormNumber from "../../components/FormNumber";
import * as Message from "../../components/Message";
import { addOrderProduct, resetOrder } from "../../redux/slices/orderSlide";
import * as ProductService from "../../services/ProductService";
import { convertPrice, initFacebookSDK } from "../../utils/helper";

const { Title, Text } = Typography;

const StyledProductDetail = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 40px;
  background-color: var(--color-grey-100);
`;

const StyledSpan = styled.span`
  font-weight: bold;
  font-size: 1.6rem;
  cursor: pointer;
  &:hover {
    color: var(--color-brand-600);
  }
`;

const StyledRow = styled(Row)`
  padding: 16px;
  background-color: var(--color-grey-0);
  border-radius: 4px;
`;

const StyledColImageSmall = styled(Col)`
  flex-basis: unset;
  display: flex;
`;

const StyledImageSmall = styled(Image)`
  height: 64px;
  width: 64px;
`;

const StyledQuantity = styled.div`
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid var(--color-grey-200);
  border-bottom: 1px solid var(--color-grey-200);
`;

function ProductDetail() {
  const { id: idProduct } = useParams();
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);

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

  //
  useEffect(() => {
    if (order.isSuccessOrder) {
      Message.success("Đã thêm vào giỏ hàng");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSuccessOrder, dispatch]);

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetails?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
      (!orderRedux && productDetails?.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct, order, productDetails]);

  function handleAddOrderProduct() {
    if (!user?.id) {
      navigate("/sign-in", { state: location.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );

      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInStock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
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
      } else {
        setErrorLimitOrder(true);
      }
    }
  }

  // FB
  useEffect(() => {
    initFacebookSDK();
  }, []);

  if (isLoading) return <Spin />;

  return (
    <StyledProductDetail>
      <StyledSpan onClick={() => navigate("/")}>Home</StyledSpan>
      <span> - Product details</span>
      <StyledRow>
        <Col span={10}>
          <Image src={productDetails.image} alt="product" preview={false} />

          <Row>
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

        <Col span={14}>
          <Title level={2}>{productDetails.name}</Title>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />
            <Text> | Sold {productDetails?.sold || 1000}+</Text>
          </div>

          <Title level={2}>{convertPrice(productDetails?.price)}</Title>

          <Text>Delivered: </Text>
          {user.address && user.city ? (
            <Text underline>
              {user?.address}, {user?.city}
            </Text>
          ) : null}
          <StyledSpan onClick={() => navigate("/profile-user")}>
            {" "}
            Change address
          </StyledSpan>

          <ButtonLike
            dataHref={
              process.env.REACT_APP_IS_LOCAL
                ? "https://developers.facebook.com/docs/plugins/"
                : window.location.href
            }
          />
          <StyledQuantity>
            <Text>Quantity: </Text>
            <FormNumber
              onClickDecrease={() =>
                handleChangeCount("decrease", numProduct === 1)
              }
              onClickIncrease={() =>
                handleChangeCount(
                  "increase",
                  numProduct === productDetails?.countInStock
                )
              }
              onChange={onChange}
              max={productDetails?.countInStock}
              value={numProduct}
            />
          </StyledQuantity>
          <div>
            <ButtonDefault
              onClick={handleAddOrderProduct}
              text="Add to Cart"
              width={200}
            />
            {errorLimitOrder && (
              <Text type="danger"> The product is out of stock</Text>
            )}
          </div>
        </Col>
        <Comments
          dataHref={
            process.env.REACT_APP_IS_LOCAL
              ? "https://developers.facebook.com/docs/plugins/comments#configurator"
              : window.location.href
          }
          width="1260"
        />
      </StyledRow>
    </StyledProductDetail>
  );
}

export default ProductDetail;
