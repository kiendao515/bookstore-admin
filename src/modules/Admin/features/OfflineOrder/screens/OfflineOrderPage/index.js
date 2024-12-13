import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, InputNumber, Popover, Typography, Modal, message } from "antd";
import { useParams } from "react-router-dom";
import KT01BaseLayout from "general/components/BaseLayout/KT01BaseLayout";
import UpdateOrderBar from "../../Components/UpdateOrderBar";
// import { createOfflineOrder, useOfflineOrderDetail } from "@/api/offlineOrder";

const OfflineOrderPage = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState([]);
    const [billDiscount, setBillDiscount] = useState(0);
    const [totalBookPrice, setTotalBookPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [disableSearch, setDisableSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const orders = useMemo(() => {
        return orderData.map((order, index) => ({
            key: index + 1,
            ...order,
            action: (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                        type="link"
                        icon={<i className="fas fa-edit" />}
                        onClick={() => {
                            setSelectedOrder(order);
                            setOpenEditDetail(true);
                        }}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<i className="fas fa-trash-alt" />}
                        onClick={() => handleDelete(order.barcode)}
                    />
                </div>
            ),
        }));
    }, [orderData]);

    useEffect(() => {
        const totalBookPrice = orderData.reduce(
            (sum, order) => sum + order.price * order.quantity * (1 - order.discount / 100),
            0
        );
        const totalPrice = totalBookPrice * (1 - billDiscount / 100);
        setTotalBookPrice(totalBookPrice);
        setTotalPrice(totalPrice);
    }, [orderData, billDiscount]);

    const handleDelete = (barcode) => {
        setOrderData((orders) => orders.filter((order) => order.barcode !== barcode));
    };

    const handlePayment = () => {
        const bookOrders = orderData.map((order) => ({
            barcode: order.barcode,
            quantity: order.quantity,
            discount: order.discount,
            note: order.note,
        }));
        mutate({
            bill_discount: billDiscount,
            book_orders: bookOrders,
        });
    };

    const columns = [
        { title: "STT", dataIndex: "key", key: "key" },
        { title: "Barcode", dataIndex: "barcode", key: "barcode" },
        { title: "Tên sách", dataIndex: "name", key: "name" },
        { title: "Tác giả", dataIndex: "author", key: "author" },
        { title: "Tình trạng", dataIndex: "type", key: "type" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        { title: "Giá bán", dataIndex: "price", key: "price" },
        { title: "Chiết khấu (%)", dataIndex: "discount", key: "discount" },
        { title: "Thành tiền (VND)", dataIndex: "totalPrice", key: "totalPrice" },
        { title: "Ghi chú", dataIndex: "note", key: "note" },
        { title: "Hành động", dataIndex: "action", key: "action" },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <UpdateOrderBar orders={orderData} setOrders={setOrderData} setDisableSearch={setDisableSearch} />
            <Table dataSource={orders} columns={columns} pagination={false} />
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                <Typography.Text strong>Tổng: {totalBookPrice.toFixed(2)} VND</Typography.Text>
                <br />
                <Popover
                    content={
                        <InputNumber
                            min={0}
                            max={100}
                            value={billDiscount}
                            onChange={setBillDiscount}
                        />
                    }
                    trigger="click"
                >
                    <Typography.Text strong style={{ cursor: "pointer" }}>
                        Giảm giá: {billDiscount}%
                    </Typography.Text>
                </Popover>
                <br />
                <Typography.Text strong>Tổng hóa đơn: {totalPrice.toFixed(2)} VND</Typography.Text>
            </div>
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                {!disableSearch && (
                    <Button
                        type="primary"
                        loading={isLoading}
                        onClick={handlePayment}
                    >
                        Thanh toán
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OfflineOrderPage;
