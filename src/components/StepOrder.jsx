import { Steps } from "antd";
import styled from "styled-components";
const { Step } = Steps;

export const CustomStep = styled(Step)`
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
    background: #9255fd;
  }
`;

function StepOrder({ deliveryPriceMemo, length }) {
  const items = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000 VND",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "Free ship",
      description: "Trên 500.000 VND",
    },
  ];

  const current =
    deliveryPriceMemo === 10000
      ? 2
      : deliveryPriceMemo === 20000
      ? 1
      : length === 0
      ? 0
      : 3;

  console.log("current: ", current);

  return (
    <Steps current={current}>
      {items.map((item) => {
        console.log("item: ", item);
        return (
          <CustomStep
            key={item.title}
            title={item.title}
            description={item.description}
          />
        );
      })}
    </Steps>
  );
}

export default StepOrder;
