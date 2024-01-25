import { Button } from "antd";

function ButtonFullWidth({ children, type, height, disabled, ...props }) {
  return (
    <Button
      {...props}
      htmlType="submit"
      type={type || "primary"}
      disabled={disabled}
      style={{ width: "100%", outline: "none", height: height }}
    >
      {children}
    </Button>
  );
}

export default ButtonFullWidth;
