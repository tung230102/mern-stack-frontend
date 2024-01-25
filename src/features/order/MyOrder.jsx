import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import * as Message from "../../components/Message";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
import { convertPrice } from "../../utils/helper";
import Spinner from "../../ui/Spinner";
import {
  StyledContainer,
  StyledFooterItem,
  StyledHeaderItem,
  StyledItemOrder,
  StyledListOrder,
  StyledStatus,
} from "./style";
import { Button } from "antd";

const MyOrderPage = () => {
  const { state } = useLocation();
  const user = useSelector((state) => state?.user);

  const fetchMyOrder = async () => {
    const res = await OrderService.getDetailsOrder(
      user?.id,
      user?.access_token
    );
    console.log("res: ", res);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
  });
  const { isLoading, data } = queryOrder;

  console.log("data: ", data);

  if (isLoading) return <Spinner />;

  return <div>Myorder</div>;
};

export default MyOrderPage;
