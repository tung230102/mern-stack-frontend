import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload } from "antd";
import styled from "styled-components";
import ImagePreview from "./ImagePreview";

const StyledUploadForm = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledUpload = styled(Upload)`
  & .ant-upload-list-item-actions {
    display: none;
  }

  & button {
    height: 60px;
  }
`;

export function FormItemInput({
  label,
  name,
  prefix,
  value,
  onChange,
  disabled,
  type = "input",
  onUpload,
  image,
  options,
  placeholder,
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required: true,
          message: `Please input your ${name}!`,
        },
      ]}
    >
      {type === "password" && (
        <Input.Password
          prefix={prefix}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
      {type === "upload" && (
        <StyledUploadForm>
          <StyledUpload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            onChange={onUpload}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select photo</Button>
          </StyledUpload>
          {image && <ImagePreview src={image} size={60} border="none" />}
        </StyledUploadForm>
      )}
      {type === "input" && (
        <Input
          prefix={prefix}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
      {type === "select" && (
        <Select
          name="type"
          value={value}
          onChange={onChange}
          options={options}
        />
      )}
    </Form.Item>
  );
}
