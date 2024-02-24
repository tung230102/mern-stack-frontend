import { Row } from "antd";
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { convertPrice } from "../../../utils/helper";
import Stat from "./Stat";

function Stats({
  orders,
  isLoadingOrder,
  products,
  isLoadingProduct,
  users,
  isLoadingUsers,
}) {
  const sales = orders?.data?.reduce((acc, cur) => acc + cur.totalPrice, 0);

  return (
    <Row gutter={16}>
      <Stat
        title="Total Order"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={orders?.results}
        isPending={isLoadingOrder}
      />

      <Stat
        title="Total Product"
        color="green"
        icon={<HiOutlineCalendarDays />}
        value={products?.total}
        isPending={isLoadingProduct}
      />

      <Stat
        title="Sales"
        color="indigo"
        icon={<HiOutlineBanknotes />}
        value={convertPrice(sales)}
        isPending={isLoadingOrder}
      />

      <Stat
        title="Total User"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={users?.results}
        isPending={isLoadingUsers}
      />
    </Row>
  );
}

export default Stats;
