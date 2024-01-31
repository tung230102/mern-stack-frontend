import { Col, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NavBarType from "../../components/NavBarType";
import * as ProductService from "../../services/ProductService";
import ProductItemCard from "./ProductItemCard";

import { useSelector } from "react-redux";
import styled from "styled-components";
import Spinner from "../../components/Spinner";
import { useDebounce } from "../../hooks/useDebounce";

const StyledRow = styled(Row)`
  padding: 0 40px;
  flex-wrap: nowrap;
  padding: 20px;
  height: 100%;
  background-color: var(--color-grey-100);
`;

const StyledCol = styled(Col)`
  background-color: var(--color-grey-0);
  padding: 8px;
  border-radius: 8px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, paginate.page, paginate.limit);
    }
  }, [state, paginate.page, paginate.limit]);

  function handlePagination(current, pageSize) {
    setPaginate({ page: current - 1, limit: pageSize, total: paginate.total });
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
    <StyledRow>
      <StyledCol span={4} style={{ marginRight: 12 }}>
        <NavBarType />
      </StyledCol>

      <StyledCol span={20}>
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
          total={(paginate.total - 1) * paginate.limit}
          onChange={handlePagination}
          style={{ textAlign: "center", marginTop: 12 }}
        />
      </StyledCol>
    </StyledRow>
  );
}

export default ProductType;
