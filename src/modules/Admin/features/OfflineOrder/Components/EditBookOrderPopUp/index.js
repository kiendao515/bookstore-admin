import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Modal, Typography, Row, Col } from "antd";
import { useForm, Controller, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import offlineOrderApi from "api/offlineOrderApi";
import ToastHelper from "general/helpers/ToastHelper";
import TextInput from "general/components/FormInput/TextInput";

const EditBookOrderPopUp = ({ toggle, setToggle, orders, setOrders, selectedOrder }) => {
    const schema = yup.object().shape({
        quantity: yup
            .number()
            .typeError("Vui lòng nhập số")
            .required("Vui lòng nhập số")
            .max(100, "Số lượng tối đa là 100"),
        discount: yup
            .number()
            .typeError("Vui lòng nhập số")
            .max(100, "Chiết khấu tối đa là 100%"),
        note: yup.string().trim().max(100, "Ghi chú tối đa 100 ký tự"),
    });

    const formMethod = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        formMethod.reset({
            discount: selectedOrder?.discount || 0,
            quantity: selectedOrder?.quantity || 0,
            note: selectedOrder?.note || "",
        });
    }, [selectedOrder, formMethod]);
    console.log("selectedOrder", selectedOrder)

    const onHandleSubmit = async (data) => {
        console.log("data", data)
        const bookOfflineOrderDetail = await offlineOrderApi.getBookOfflineOrderDetail({
            barcode: selectedOrder?.barcode,
            quantity: data.quantity,
        });

        if (!bookOfflineOrderDetail.result) {
            ToastHelper.showError(bookOfflineOrderDetail.message);
            return;
        }

        const isExisted = orders.find((order) => order.barcode === selectedOrder?.barcode);
        console.log("isExist", isExisted)

        if (isExisted) {
            const updatedOrders = orders.map((order) => {
                if (order.barcode === selectedOrder?.barcode) {
                    order.quantity = data.quantity;
                    order.discount = data.discount || 0;
                    order.note = data.note || "";
                    order.totalPrice = order.price * data.quantity * (1 - (order.discount || 0) / 100);
                }
                return order;
            });
            setOrders(updatedOrders);
        }
        setToggle(false);
    };

    return (
        <Modal
            visible={toggle}
            onCancel={() => setToggle(false)}
            footer={null}
            title={<Typography.Title level={4}>Chỉnh sửa đơn hàng</Typography.Title>}
        >
            <FormProvider {...formMethod}>
                <Form
                    layout="vertical"
                    onFinish={formMethod.handleSubmit(onHandleSubmit)}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <TextInput
                                name="quantity"
                                label="Số lượng"
                                control={formMethod.control}
                                errors={formMethod.formState.errors.quantity}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <TextInput
                                name="discount"
                                label="Chiết khấu"
                                control={formMethod.control}
                                errors={formMethod.formState.errors.discount}
                                type="number"
                                min={0}
                                max={100}
                            />
                        </Col>
                    </Row>
                    <TextInput
                        name="note"
                        label="Ghi chú"
                        control={formMethod.control}
                        errors={formMethod.formState.errors.note}
                        type="text"
                    />
                    <div style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 8 }}
                        >
                            Cập nhật
                        </Button>
                        <Button onClick={() => setToggle(false)} danger>
                            Hủy
                        </Button>
                    </div>
                </Form>
            </FormProvider>
        </Modal>
    );
};

export default EditBookOrderPopUp;
