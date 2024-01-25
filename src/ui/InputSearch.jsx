import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";

const InputSearch = ({ ...rests }) => {
  return (
    <div style={{ display: "flex" }}>
      <Input size="large" placeholder="search..." {...rests} />
      <Button size="large" icon={<SearchOutlined />}>
        Search
      </Button>
    </div>
  );
};

export default InputSearch;
