import { Form } from "antd";
import { FormItemInput } from "../../components/FormItemInput";

function FormAddress({ form, state, onChange, disabled, onCancel }) {
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
    </Form>
  );
}

export default FormAddress;
