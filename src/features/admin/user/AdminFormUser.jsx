import { Button, Form } from "antd";
import { FormItemInput } from "../../../components/FormItemInput";

function AdminFormUser({
  onFinish,
  form,
  state,
  onChange,
  onUpLoad,
  disabled,
  onCancel,
}) {
  return (
    <Form
      name="basic"
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      form={form}
    >
      <FormItemInput
        label="Name"
        name="name"
        value={state?.name}
        onChange={onChange}
        disabled={disabled}
      />
      <FormItemInput
        label="Email"
        name="email"
        value={state?.email}
        onChange={onChange}
        disabled={disabled}
      />
      <FormItemInput
        label="Phone"
        name="phone"
        value={state?.phone}
        onChange={onChange}
        disabled={disabled}
      />

      <FormItemInput
        label="Address"
        name="address"
        value={state?.address}
        onChange={onChange}
        disabled={disabled}
      />

      <FormItemInput
        label="Avatar"
        name="avatar"
        onUpload={onUpLoad}
        disabled={disabled}
        type="upload"
        image={state?.avatar}
      />

      <Form.Item
        wrapperCol={{
          offset: 16,
          span: 16,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          onClick={onFinish}
          disabled={disabled}
        >
          Submit
        </Button>
        <Button onClick={onCancel} disabled={disabled}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AdminFormUser;
