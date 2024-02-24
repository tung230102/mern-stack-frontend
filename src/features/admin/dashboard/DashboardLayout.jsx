import useOrder from "../useOrder";
import useProduct from "../useProduct";
import useUser from "../useUser";

import { Col, Row } from "antd";
import PieChartOrder from "../order/PieChartOrder";
import SalesChart from "./SalesChart";
import Stats from "./Stats";
import TodayActivity from "./TodayActivity";

function DashboardLayout() {
  const { data: orders, isLoading: isLoadingOrder } = useOrder();
  const { data: products, isLoading: isLoadingProduct } = useProduct();
  const { data: users, isLoading: isLoadingUsers } = useUser();

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
        <TodayActivity orders={orders} isLoadingOrder={isLoadingOrder} />
      </Col>
      <Col span={12}>
        <PieChartOrder orders={orders} isLoadingOrder={isLoadingOrder} />
      </Col>
      <Col span={24}>
        <SalesChart
          orders={orders}
          numDays={numDays}
          isLoadingOrder={isLoadingOrder}
        />
      </Col>
    </Row>
  );
}

export default DashboardLayout;
