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
      title: "30.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "Free ship",
      description: "Trên 500.000 VND",
    },
  ];

  const current =
    length === 0
      ? null
      : deliveryPriceMemo === 20000
      ? 0
      : deliveryPriceMemo === 30000
      ? 1
      : deliveryPriceMemo === 0
      ? 2
      : null;

  return (
    <Steps current={current}>
      {items.map((item) => {
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
