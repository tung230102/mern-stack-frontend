import { useQuery } from "@tanstack/react-query";

import * as ProductService from "../../services/ProductService";

function useProduct() {
  const queryOrder = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAllProduct,
  });

  return queryOrder;
}

export default useProduct;
