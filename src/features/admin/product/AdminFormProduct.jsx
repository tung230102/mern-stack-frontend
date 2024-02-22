import { Button, Form } from "antd";
import { FormItemInput } from "../../../components/FormItemInput";

function AdminFormProduct({
  onFinish,
  form,
  state,
  onChange,
  onUpload,
  onSelected,
  options,
  disabled,
  onCancel,
}) {
  return (
    <Form
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      // onFinish={onFinish}
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
        label="Type"
        name="type"
        type="select"
        value={state.type}
        onChange={onSelected}
        options={options}
      />

      {state.type === "add_type" && (
        <FormItemInput
          label="New type"
          name="newType"
          value={state.newType}
          onChange={onChange}
          options={options}
        />
      )}

      <FormItemInput
        label="CountInStock"
        name="countInStock"
        value={state?.countInStock}
        onChange={onChange}
        disabled={disabled}
      />
      <FormItemInput
        label="Price"
        name="price"
        value={state?.price}
        onChange={onChange}
        disabled={disabled}
      />
      <FormItemInput
        label="Description"
        name="description"
        value={state?.description}
        onChange={onChange}
        disabled={disabled}
      />
      <FormItemInput
        label="Rating"
        name="rating"
        value={state?.rating}
        onChange={onChange}
        disabled={disabled}
      />
      <FormItemInput
        label="Discount"
        name="discount"
        value={state?.discount}
        onChange={onChange}
        disabled={disabled}
      />

      <FormItemInput
        label="Image"
        name="image"
        onUpload={onUpload}
        disabled={disabled}
        type="upload"
        image={state?.image}
      />

      <Form.Item
        wrapperCol={{
          offset: 16,
          span: 16,
        }}
      >
        {/* <Button type="primary" htmlType="submit" disabled={disabled}>
          Submit
        </Button> */}
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => onFinish()}
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

export default AdminFormProduct;
