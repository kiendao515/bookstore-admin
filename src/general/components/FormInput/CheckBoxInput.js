import React from "react";
import { Form, Checkbox } from "antd";
import { Controller } from "react-hook-form";

const CheckboxInput = ({
  name,
  label,
  control,
  errors,
  defaultChecked = false,
}) => {
  return (
    <Form.Item
      validateStatus={errors ? "error" : ""}
      help={errors?.message}
    >
      <Controller
        name={name}
        control={control}
        defaultValue={defaultChecked}
        render={({ field }) => (
          <Checkbox {...field} checked={field.value}>
            {label}
          </Checkbox>
        )}
      />
    </Form.Item>
  );
};

export default CheckboxInput;
