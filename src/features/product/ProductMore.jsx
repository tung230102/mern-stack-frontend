import { Button, Pagination } from "antd";
import styled from "styled-components";
import SpinnerButton from "../../ui/SpinnerButton";

const ButtonMore = styled(Button)`
  border: "1px solid rgb(11,116,229)";
  color: "rgb(11,116,229)";
  width: "240px";
  height: "40px";
  border-radius: "4px";
`;

function ProductMore({ onClick, isPlaceholderData }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "10px",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <SpinnerButton isPending={isPlaceholderData}>
        <ButtonMore onClick={onClick} disabled={isPlaceholderData}>
          {isPlaceholderData ? "Đang tải..." : "Xem thêm"}
        </ButtonMore>
      </SpinnerButton>

      <Pagination defaultCurrent={1} total={50} />
    </div>
  );
}

export default ProductMore;
