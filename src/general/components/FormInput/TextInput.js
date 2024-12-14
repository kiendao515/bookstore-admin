import React from "react";
import { Form, Input } from "antd";
import { Controller, FieldError } from "react-hook-form";

const TextInput = ({
  name,
  label,
  placeholder,
  control,
  errors,
  type = "text",
  ...props
}) => {
  return (
    <Form.Item
      label={label}
      validateStatus={errors ? "error" : ""}
      help={errors?.message}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === "password" ? (
            <Input.Password {...field} placeholder={placeholder} {...props} />
          ) : (
            <Input {...field} placeholder={placeholder}  {...props} />
          )
        }
      />
    </Form.Item>
  );
};

export default TextInput;
