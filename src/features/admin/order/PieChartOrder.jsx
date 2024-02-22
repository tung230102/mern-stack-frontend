import { Card, Typography } from "antd";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { convertDataChart } from "../../../utils/helper";

const { Title } = Typography;

function PieChartOrder(props) {
  const data = convertDataChart(props?.data, "paymentMethod");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    ...rests
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <Title level={4}>Payment method</Title>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
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

export default PieChartOrder;
