import { Button, Form } from "antd";
import { FormItemInput } from "../../components/FormItemInput";

function FormOrder({ form, state, onChange, disabled, onCancel }) {
  return (
    <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      autoComplete="on"
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
        label="City"
        name="city"
        value={state?.city}
        onChange={onChange}
        disabled={disabled}
      />

      {/* <Form.Item
        wrapperCol={{
          offset: 16,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" disabled={disabled}>
          Submit
        </Button>
        <Button onClick={onCancel} disabled={disabled}>
          Cancel
        </Button>
      </Form.Item> */}
    </Form>
  );
}

export default FormOrder;
