import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import ProductItemCard from "./ProductItemCard";
import ProductMore from "./ProductMore";
import { useProduct } from "./useProduct";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import * as ProductService from "../../services/ProductService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";

const StyledProducts = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

function Product() {
  const searchProduct = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [limit, setLimit] = useState(5);

  // const { isLoading, products } = useProduct();

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
      <StyledProducts
      // style={{
      //   // padding: "0 120px",
      //   // alignItems: "center",
      //   display: "flex",
      //   marginTop: "20px",
      //   gap: "14px",
      //   flexWrap: "wrap",
      // }}
      >
        {products.data?.map((product) => (
          <ProductItemCard key={product._id} product={product} />
        ))}
      </StyledProducts>

      {disableButtonMore || (
        <ProductMore
          onClick={handleLoadMore}
          isPlaceholderData={isPlaceholderData}
        />
      )}
    </>
  );
}

export default Product;
