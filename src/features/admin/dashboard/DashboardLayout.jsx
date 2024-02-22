import styled from "styled-components";
import useOrder from "../useOrder";
import useProduct from "../useProduct";
import useUser from "../useUser";

import PieChartOrder from "../order/PieChartOrder";
import SalesChart from "./SalesChart";
import Stats from "./Stats";
import TodayActivity from "./TodayActivity";
import { Col, Row } from "antd";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { data: orders, isLoading: isLoadingOrder } = useOrder();
  const { data: products, isLoading: isLoadingProduct } = useProduct();
  const { data: users, isLoading: isLoadingUsers } = useUser();
  // const { data: productType, isLoading: isLoadingProductType } =
  //   useProductType();

  const numDays = 7;

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Stats
          orders={orders}
          products={products}
          users={users}
          isLoadingOrder={isLoadingOrder}
          isLoadingProduct={isLoadingProduct}
          isLoadingUsers={isLoadingUsers}
        />
      </Col>
      <Col span={12}>
        <TodayActivity orders={orders} />
      </Col>

      <Col span={12}>
        <PieChartOrder data={orders?.data} />
      </Col>
      <Col span={24}>
        <SalesChart orders={orders} numDays={numDays} />
      </Col>
      <StyledDashboardLayout></StyledDashboardLayout>
    </Row>
  );
}

export default DashboardLayout;
