import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Loading = ({ children, isPending, delay = 200 }) => {
  return (
    <Spin
      spinning={isPending}
      delay={delay}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    >
      {children}
    </Spin>
  );
};

export default Loading;
