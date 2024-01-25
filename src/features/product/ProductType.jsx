import { Col, Pagination, Row } from "antd";
import Product from "./Product";
import NavBar from "../../ui/NavBar";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useCallback, useEffect, useState } from "react";
import ProductItemCard from "./ProductItemCard";

import Spinner from "../../ui/Spinner";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import styled from "styled-components";

const StyledContent = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

function ProductType() {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);

  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  // const fetchProductType = async (type, page, limit) => {
  //   setLoading(true);
  //   const res = await ProductService.getProductType(type, page, limit);
  //   if (res?.status === "OK") {
  //     setLoading(false);
  //     setProducts(res?.data);
  //     setPaginate({ ...paginate, total: res?.totalPage });
  //   } else {
  //     setLoading(false);
  //   }
  // };

  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    try {
      const res = await ProductService.getProductType(type, page, limit);
      if (res?.status === "OK") {
        setLoading(false);
        setProducts(res?.data);
        setPaginate({ ...paginate, total: res?.totalPage });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, paginate.page, paginate.limit);
    }
  }, [state, paginate.page, paginate.limit]);

  function handlePagination(current, pageSize) {
    setPaginate({ ...paginate, page: current - 1, limit: pageSize });
  }

  const productFilter = products?.filter((product) => {
    if (searchDebounce === "") {
      return true;
    } else {
      return product?.name
        ?.toLowerCase()
        ?.includes(searchDebounce?.toLowerCase());
    }
  });

  return (
    <Row
      style={{
        padding: "0 120px",
        backgroundColor: "#efefef",
        flexWrap: "nowrap",
        paddingTop: "20px",
        height: "calc(100% - 20px)",
      }}
    >
      <Col
        span={4}
        style={{
          backgroundColor: "#fff",
          marginRight: "10px",
          padding: "10px",
          borderRadius: "6px",
        }}
      >
        <NavBar />
      </Col>
      <Col
        span={20}
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "6px",
        }}
      >
        <StyledContent>
          {loading ? (
            <Spinner />
          ) : (
            productFilter?.map((product) => (
              <ProductItemCard key={product._id} product={product} />
            ))
          )}
        </StyledContent>

        <Pagination
          defaultCurrent={paginate.page + 1}
          total={paginate?.total}
          onChange={handlePagination}
          style={{ textAlign: "center", marginTop: "10px" }}
        />
      </Col>
    </Row>
  );
}

export default ProductType;
