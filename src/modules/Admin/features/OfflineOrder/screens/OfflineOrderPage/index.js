import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, InputNumber, Popover, Typography, Modal, message } from "antd";
import { useParams } from "react-router-dom";
import UpdateOrderBar from "../../Components/UpdateOrderBar";
import EditBookOrderPopUp from "../../Components/EditBookOrderPopUp";
import offlineOrderApi from "api/offlineOrderApi";
import ToastHelper from "general/helpers/ToastHelper";
import OfflineOrderHistoryPopUp from "../../Components/OfflineOrderHistoryPopUp";
import Utils from "general/utils/Utils";

const OfflineOrderPage = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState([]);
    const [openEditDetail, setOpenEditDetail] = useState(false);
    const [toggleHistory, setToggleHistory] = useState(false);
    const [billDiscount, setBillDiscount] = useState(0);
    const [totalBookPrice, setTotalBookPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState();
    const [disableSearch, setDisableSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [offlineOrder, setOfflineOrder] = useState(null);

    useEffect(() => {
        const fetchOfflineOrderDetail = async () => {
            try {
                const response = await offlineOrderApi.getOfflineOrderDetail(id);
                if (response?.result) {
                    setOfflineOrder(response); // Adjust based on your API response structure
                }
            } catch (error) {
                console.error('Error fetching offline order detail:', error);
            }
        };

        fetchOfflineOrderDetail();
    }, [id]); // Refetch whenever `id` changes

    useEffect(() => {
        if (offlineOrder?.result) {
            let data = [];
            for (let i = 0; i < offlineOrder.data.details.length; i++) {
                let orderItem = offlineOrder.data.details[i];
                data.push({
                    author: orderItem.author,
                    barcode: orderItem.barcode,
                    discount: orderItem.discount,
                    name: orderItem.book_name,
                    note: orderItem.note,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    type: Utils.handleStatusBook(orderItem.type),
                    totalPrice: orderItem.total_price
                })
            }
            setOrderData(data);
            setBillDiscount(offlineOrder.data.bill_discount || 0);
            setDisableSearch(true);
        } else {
            setDisableSearch(false);
            setOrderData([]);
            setBillDiscount(0);
        }
    }, [offlineOrder])

    const orders = useMemo(() => {
        return orderData.map((order, index) => ({
            key: index + 1,
            ...order,
            totalPrice: order.totalPrice,
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
        let totalBookPrice = 0
        let totalPrice = 0
        orders.map((order) => {
            totalBookPrice += order.price * order.quantity * (1 - order.discount / 100)
        })
        totalPrice = totalBookPrice * (1 - billDiscount / 100)

        setTotalBookPrice(totalBookPrice)
        setTotalPrice(totalPrice)
    }, [orders, billDiscount])

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

    const handlePayment = async () => {
        const bookOrders = orderData.map((order) => ({
            barcode: order.barcode,
            quantity: order.quantity,
            discount: order.discount,
            note: order.note,
        }));
        const result = await offlineOrderApi.createOfflineOrder({
            bill_discount: billDiscount,
            book_orders: bookOrders,
        });
        if (result.result) {
            ToastHelper.showSuccess("Thanh toán thành công")
            setOrderData([])
            setBillDiscount(0)
        } else {
            ToastHelper.showError(result.reason)
        }

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
            <UpdateOrderBar disableSearch={disableSearch} orders={orderData} setOrders={setOrderData} setDisableSearch={setDisableSearch} setToggleHistory={setToggleHistory} />
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
            {
                openEditDetail && (
                    <EditBookOrderPopUp
                        toggle={openEditDetail}
                        setToggle={setOpenEditDetail}
                        setOrders={setOrderData}
                        orders={orderData}
                        selectedOrder={selectedOrder}
                    />
                )
            }
            {
                toggleHistory && (
                    <OfflineOrderHistoryPopUp
                        togglePopUp={toggleHistory}
                        setTogglePopUp={setToggleHistory}
                    />
                )
            }
        </div>
    );
};

export default OfflineOrderPage;
