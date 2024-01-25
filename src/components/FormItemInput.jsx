import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, Select, Upload } from "antd";
import styled from "styled-components";
import ButtonFullWidth from "./ButtonFullWidth";

const StyledUploadForm = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledUpload = styled(Upload)`
  /* & .ant-upload-list-item-actions.picture {
    display: none;
  } */
  & .ant-upload-list-item-actions {
    display: none;
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
          placeholder={name}
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
            <ButtonFullWidth ghost icon={<UploadOutlined />}>
              Chọn ảnh
            </ButtonFullWidth>
          </StyledUpload>
          {image && (
            <img
              src={image}
              alt="avatar"
              style={{
                height: "60px",
                width: "60px",
                objectFit: "cover",
              }}
            />
          )}
        </StyledUploadForm>
      )}
      {type === "input" && (
        <Input
          prefix={prefix}
          placeholder={name}
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
