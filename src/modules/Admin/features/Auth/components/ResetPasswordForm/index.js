import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, Input, message, Typography, Modal } from "antd";
import * as yup from "yup";
import authApi from "api/authApi";

const { Text } = Typography;

const ResetPasswordForm = ({ isVisible, onClose }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    const schema = yup.object().shape({
        new_password: yup
            .string()
            .trim()
            .required("This field is required.")
            .min(6, "Password must be at least 6 characters.")
            .max(100, "Password must be less than 100 characters."),
        confirm_password: yup
            .string()
            .trim()
            .required("This field is required.")
            .oneOf([yup.ref("new_password")], "Passwords must match."),
        token: yup.string().required("Token is required."),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            token,
        },
    });

    const { mutate, isLoading } = useMutation(authApi.resetPassword, {
        onSuccess: (data) => {
            if (data.result) {
                message.success(data.result);
                navigate("/?is_change_pwd_success=1");
                onClose();
            } else {
                message.error(data.reason);
            }
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || "An error occurred.");
        },
    });

    const onSubmit = (values) => {
        console.log("Form Values:", values); // Debugging: Ensure values are correct
        mutate(values);
    };

    return (
        <Modal
            title="Thay đổi mật khẩu"
            centered
            visible={true}
            onCancel={onClose}
            footer={null}
        >
            <Form
                layout="vertical"
                style={{ maxWidth: 400, margin: "0 auto" }}
                onFinish={handleSubmit(onSubmit)}
            >
                <Form.Item
                    label="Mật khẩu mới"
                    validateStatus={errors.new_password ? "error" : ""}
                    help={errors.new_password?.message}
                >
                    <Controller
                        name="new_password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password
                                {...field}
                                placeholder="Enter your new password"
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu"
                    validateStatus={errors.confirm_password ? "error" : ""}
                    help={errors.confirm_password?.message}
                >
                    <Controller
                        name="confirm_password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password
                                {...field}
                                placeholder="Confirm your new password"
                            />
                        )}
                    />
                </Form.Item>

                {/* <Controller
                    name="token"
                    control={control}
                    render={({ field }) => <input type="hidden" {...field} />}
                /> */}
                <Controller
    name="token"
    control={control}
    defaultValue={token} // Ensure token is a string from the start
    render={({ field }) => <input type="hidden" {...field} />}
 />

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading} block>
                        Gửi
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ResetPasswordForm;
