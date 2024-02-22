import { Card, Row, Typography } from "antd";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const { Title } = Typography;

function TodayActivity({ orders }) {
  // Process data to calculate total sales revenue by month
  if (!orders) return null;

  const revenueByMonth = orders?.data.reduce((acc, order) => {
    const createdAt = new Date(order.createdAt);
    const month = createdAt.getMonth(); // Extract month (0-indexed)
    const revenue = order.totalPrice;
    acc[month] = (acc[month] || 0) + revenue;
    return acc;
  }, {});

  // Convert revenueByMonth object into an array of objects for PieChart data
  const pieChartData = Object.entries(revenueByMonth).map(
    ([month, revenue]) => ({
      name: `Month ${parseInt(month) + 1}`, // Convert month index to month number (1-indexed)
      value: revenue,
    })
  );

  // Define colors for the PieChart segments
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF6666",
  ];

  return (
    <Card>
      <Row>
        <Title level={4}>Sales Revenue Per Month</Title>
      </Row>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart width={400} height={400}>
          <Pie
            data={pieChartData}
            cx="40%"
            cy="50%"
            innerRadius={85}
            outerRadius={110}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default TodayActivity;
