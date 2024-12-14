import React from "react";
import { Select, Form } from "antd";
import { Controller } from "react-hook-form";

const SelectInput = ({ name, label, placeholder, control, options, errors, ...props }) => {
  return (
    <Form.Item
      label={label}
      validateStatus={errors ? "error" : ""}
      help={errors?.message}
    >
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Select
            placeholder={placeholder}
            {...field}
            status={fieldState.error ? "error" : ""}
            options={options}
            {...props}
          />
        )}
      />
    </Form.Item>
  );
};

export default SelectInput;
