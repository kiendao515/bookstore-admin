import { Form, DatePicker } from "antd";
import { Controller, Control } from "react-hook-form";

const DateInput = ({
    name,
    label,
    placeholder,
    control,
    errors,
    ...props // Spread additional props
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
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        format="YYYY-MM-DD"
                        placeholder={placeholder}
                        style={{ width: "100%" }}
                        {...props} // Apply additional props
                    />
                )}
            />
        </Form.Item>
    );
};

export default DateInput;
