import { Card, Typography } from "antd";
import styled from "styled-components";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const { Title } = Typography;

const colors = {
  totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
  extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
  text: "#374151",
  background: "#fff",
};

function SalesChart({ orders, numDays, isLoadingOrder }) {
  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: orders?.data
        ?.filter((order) => isSameDay(date, new Date(order.createdAt)))
        ?.reduce((acc, cur) => acc + cur.totalPrice, 0),
    };
  });

  return (
    <Card loading={isLoadingOrder}>
      <Title level={4}>Sales from</Title>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="VND"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
            width={100}
          />
          <CartesianGrid strokeDasharray="4" />

          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total Sales"
            unit="VND"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default SalesChart;
