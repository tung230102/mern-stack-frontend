import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import * as OrderService from "../../services/OrderService";

function useOrder() {
  const user = useSelector((state) => state?.user);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  return queryOrder;
}

export default useOrder;
