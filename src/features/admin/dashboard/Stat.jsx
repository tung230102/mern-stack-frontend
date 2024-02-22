import { Card, Col } from "antd";
import Meta from "antd/es/card/Meta";
import styled from "styled-components";

const StyleMeta = styled(Meta)`
  & .ant-card-meta-avatar {
    aspect-ratio: 1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-${(props) => props.color}-100);
    margin-right: 4px;
    padding: 12px;

    & svg {
      width: 3.2rem;
      height: 3.2rem;
      color: var(--color-${(props) => props.color}-700);
    }
  }

  & .ant-card-meta-title {
    align-self: end;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
    color: var(--color-grey-500);
  }

  & .ant-card-meta-description {
    font-size: 2rem;
    line-height: 1;
    font-weight: 500;
    color: var(--color-silver-700);
  }
`;
function Stat({ icon, title, value, color, isPending }) {
  return (
    <Col span={6}>
      <Card loading={isPending}>
        <StyleMeta
          avatar={icon}
          title={title}
          description={value}
          className="meta"
          color={color}
        />
      </Card>
    </Col>
  );
}

export default Stat;
