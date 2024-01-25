import styled, { keyframes } from "styled-components";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const SpinnerMini = styled(Loading3QuartersOutlined)`
  width: 2.4rem;
  height: 2.4rem;
  animation: ${rotate} 1.5s infinite linear;
`;

export default SpinnerMini;
