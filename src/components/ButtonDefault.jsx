import { Button } from "antd";

function ButtonDefault({
  type,
  onClick,
  text,
  width = "100%",
  marginTop,
  ...rest
}) {
  return (
    <Button
      {...rest}
      size="large"
      type={type || "primary"}
      danger
      style={{
        height: "48px",
        width: width,
        color: "#fff",
        border: "none",
        outline: "none",
        fontWeight: "700",
        marginTop: marginTop,
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

export default ButtonDefault;
