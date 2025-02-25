import React, { useState } from "react";
import { Button, Input, InputNumber, Form, Typography, Modal, message } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
// import { handleStatusBook } from "@/utils/common";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import TextInput from "general/components/FormInput/TextInput";
import offlineOrderApi from "api/offlineOrderApi";
import ToastHelper from "general/helpers/ToastHelper";
import Utils from "general/utils/Utils";
import ScanBarcodePopUp from "../ScanBarcodePopUp";

const UpdateOrderBar = ({ orders, setOrders, disableSearch = false, setToggleHistory }) => {
    const [toggleScan, setToggleScan] = useState(false);
    const [messageContent, setMessageContent] = useState("");

    const schema = yup.object().shape({
        barcode: yup.string().trim().required("Vui lòng nhập thông tin").max(100),
        quantity: yup
            .number()
            .typeError("Vui lòng nhập số")
            .required("Vui lòng nhập số")
            .max(100),
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const onHandleSubmit = async (data) => {
        console.log("data", data);
        const existingOrder = orders.find((order) => order.barcode === data.barcode);
        if (existingOrder) {
            data.quantity += existingOrder.quantity;
        }

        const bookOrderDetail = await offlineOrderApi.getBookOfflineOrderDetail({
            barcode: data.barcode,
            quantity: data.quantity,
        });

        if (!bookOrderDetail?.result) {
            ToastHelper.showError(bookOrderDetail?.reason);
            return;
        }

        if (existingOrder) {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.barcode === data.barcode
                        ? {
                            ...order,
                            quantity: data.quantity,
                            totalPrice:
                                bookOrderDetail?.data?.price *
                                data.quantity *
                                (1 - order.discount / 100),
                        }
                        : order
                )
            );
        } else {
            setOrders((prevOrders) => [
                ...prevOrders,
                {
                    barcode: bookOrderDetail?.data?.barcode,
                    quantity: data.quantity,
                    author: bookOrderDetail?.data?.author || "",
                    name: bookOrderDetail?.data?.book_name || "",
                    price: bookOrderDetail?.data?.price || 0,
                    note: "",
                    totalPrice: bookOrderDetail?.data?.price * data.quantity || 0,
                    discount: 0,
                    type: Utils.handleStatusBook(bookOrderDetail?.data?.type || "") || "",
                },
            ]);
        }
        setMessageContent("");
        // reset();
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",

        }}>
            <Form layout="inline"
                onFinish={handleSubmit(onHandleSubmit)}
            >
                <TextInput
                    name="barcode"
                    label="Barcode"
                    placeholder="Vui lòng nhập barcode"
                    control={control}
                    errors={errors.barcode}
                    disabled={disableSearch}
                />
                <TextInput
                    name="quantity"
                    label="Số lượng"
                    control={control}
                    errors={errors.quantity}
                    type="number"
                    disabled={disableSearch}
                />
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={disableSearch}
                    >
                        + Thêm
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="default"
                        icon={<i className="fas fa-qrcode" />}
                        onClick={() => setToggleScan(!toggleScan)}
                        disabled={disableSearch}
                    >
                        Quét
                    </Button>
                </Form.Item>
            </Form>
            <div>
                <Button
                    type="default"
                    icon={<i className="fas fa-qrcode" />}
                    onClick={() => setToggleHistory(prev => !prev)}
                >
                    Lịch sử
                </Button>

            </div>
            {
                toggleScan && (
                    <ScanBarcodePopUp
                        togglePopUp={toggleScan}
                        setTogglePopUp={setToggleScan}
                        message={messageContent}
                        setMessage={setMessageContent}
                        handleScanBarcode={onHandleSubmit}
                    />
                )
            }

        </div>
    );
};

export default UpdateOrderBar;
