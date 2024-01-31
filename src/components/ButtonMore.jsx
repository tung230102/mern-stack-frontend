import { Button } from "antd";
import styled from "styled-components";
import Loading from "./Loading";

const StyledButton = styled(Button)`
  border: 1px solid var(--color-brand-600);
  color: var(--color-brand-600);
  width: 240px;
  height: 40px;
  border-radius: 4px;

  &:hover {
    background-color: var(--color-brand-600);
    color: var(--color-grey-0) !important;
    border-style: none !important;
  }
`;

function ButtonMore({ onClick, isPending }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "12px",
      }}
    >
      <Loading isPending={isPending}>
        <StyledButton onClick={onClick} disabled={isPending}>
          {isPending ? "Đang tải..." : "Xem thêm"}
        </StyledButton>
      </Loading>
    </div>
  );
}

export default ButtonMore;
