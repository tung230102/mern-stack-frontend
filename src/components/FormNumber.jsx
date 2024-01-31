import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";

function FormNumber({
  onClickDecrease,
  onClickIncrease,
  onChange,
  max,
  value,
  min = 1,
  defaultValue = 1,
  width = "8%",
}) {
  return (
    <>
      <Button icon={<MinusOutlined />} onClick={onClickDecrease} />
      <Input
        style={{ width: width }}
        onChange={onChange}
        defaultValue={defaultValue}
        max={max}
        min={min}
        value={value}
      />
      <Button icon={<PlusOutlined />} onClick={onClickIncrease} />
    </>
  );
}

export default FormNumber;
