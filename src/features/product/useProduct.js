import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";

export function useProduct() {
  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const { isLoading, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  return { isLoading, products };
}

// import { useQuery } from "@tanstack/react-query";

// import * as ProductService from "../../services/ProductService";

// function useProduct() {
//   const queryOrder = useQuery({
//     queryKey: ["products"],
//     queryFn: ProductService.getAllProduct,
//   });

//   return queryOrder;
// }

// export default useProduct;
