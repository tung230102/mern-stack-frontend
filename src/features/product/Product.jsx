import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import ButtonMore from "../../components/ButtonMore";
import Spinner from "../../components/Spinner";
import { useDebounce } from "../../hooks/useDebounce";
import * as ProductService from "../../services/ProductService";
import { limitProduct } from "../../utils/constants";
import ProductItemCard from "./ProductItemCard";

const StyledProducts = styled.div`
  padding: 0 40px;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

function Product() {
  const searchProduct = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [limit, setLimit] = useState(limitProduct);

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const {
    isLoading,
    data: products,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["product", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: keepPreviousData,
  });

  const disableButtonMore =
    products?.total === products?.data?.length || products?.totalPage === 1;

  function handleLoadMore() {
    setLimit((prev) => prev + 6);
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      <StyledProducts>
        {products.data?.map((product) => (
          <ProductItemCard key={product._id} product={product} />
        ))}
      </StyledProducts>
      {disableButtonMore || (
        <ButtonMore onClick={handleLoadMore} isPending={isPlaceholderData} />
      )}
    </>
  );
}

export default Product;
