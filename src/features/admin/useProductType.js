import { useQuery } from "@tanstack/react-query";

import * as ProductService from "../../services/ProductService";

function useProductType() {
  const getAllProductType = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const queryProductType = useQuery({
    queryKey: ["type-product"],
    queryFn: getAllProductType,
  });

  return queryProductType;
}

export default useProductType;
