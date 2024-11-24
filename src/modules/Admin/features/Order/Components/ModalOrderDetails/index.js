import React, { useEffect, useState } from "react";
import {
    Modal,
    Descriptions,
    Table,
    Typography,
    Row,
    Col,
    Timeline,
    Card,
    Badge,
} from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import orderApi from "api/orderApi";
import Utils from "general/utils/Utils";

const { Title, Text } = Typography;

function ModalOrderDetails({ visible, onClose, orderDetails }) {
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Mã sách",
            dataIndex: "bookInventoryId",
            key: "bookInventoryId",
        },
    ];
    const [orderUpdate, setOrderUpdate] = useState(null);
    const fetchOrderDetails = async () => {
        try {
            const response = await orderApi.getTraceOrder("S428925.MN6-01-TA61.1064754820")
            if (response.data.success) {
                const combinedLogs = [...response.data.data?.PickLog, ...response.data.data?.DeliverLog].sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                );
                console.log(combinedLogs);

                setOrderUpdate(combinedLogs);
            } else {
                console.error("Lỗi khi tải dữ liệu chi tiết đơn hàng");
            }
        } catch (error) {
            console.error("Lỗi gọi API:", error);
        }
    };
    useEffect(() => {
        if (visible) {
            fetchOrderDetails();
        }

    }, [visible]);
    const [visibleImage, setVisibleImage] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const showImage = (src) => {
        setImageSrc(src);
        setVisibleImage(true);
    };
    const handleClose = () => {
        setVisibleImage(false);
        setImageSrc("");
    };

    return (
        <Modal
            title={<Title level={4}>Chi tiết đơn hàng - {orderDetails?.order_code}</Title>}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            {orderDetails && (
                <div style={{ padding: "20px" }}>
                    <Row gutter={[16, 16]}>
                        {/* Cột Đơn hàng */}
                        <Col span={8}>
                            <Card
                                title={
                                    <Badge
                                        status="processing"
                                        text={<Text strong>Đơn hàng</Text>}
                                    />
                                }
                                bordered={false}
                                style={{ height: "100%" }}
                            >
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Mã đơn hàng">
                                        <Text strong>{orderDetails.order_code}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">
                                        <Badge
                                            status="success"
                                            text={Utils.handleOrderStatus(orderDetails.status) || "N/A"}
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ngày tạo">
                                        {orderDetails.created_at}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Hình thức thanh toán">
                                        {orderDetails.payment_type ? "Chuyển khoản" : "Thanh toán khi nhận hàng"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ghi chú">
                                        {orderDetails.note || "Không có"}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>

                        {/* Cột Khách hàng */}
                        <Col span={8}>
                            <Card
                                title={
                                    <Badge
                                        status="warning"
                                        text={<Text strong>Khách hàng</Text>}
                                    />
                                }
                                bordered={false}
                                style={{ height: "100%" }}
                            >
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Tên khách hàng">
                                        {orderDetails.customer_name || "N/A"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">
                                        {orderDetails.customer_phone || "N/A"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Email">
                                        {orderDetails.account?.email || "Không có"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ">
                                        {orderDetails.address}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>

                        {/* Cột Cập nhật */}
                        <Col span={8}>
                            <Card
                                title={
                                    <Badge
                                        status="processing"
                                        text={<Text strong>Cập nhập</Text>}
                                    />
                                }
                                bordered={false}
                                style={{ marginBottom: "20px" }}
                            >
                                <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}>
                                    {orderUpdate?.length > 0 ? (
                                        <Timeline>
                                            {orderUpdate.map((log, index) => (
                                                <Timeline.Item key={index}>
                                                    <Text strong>{log.created}</Text>: {log.desc}
                                                    {(log.image || log.deliveryImage) && (
                                                        <div>
                                                            <a
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    showImage(log.image || log.deliveryImage);
                                                                }}
                                                            >
                                                                Xem ảnh
                                                            </a>
                                                        </div>
                                                    )}
                                                </Timeline.Item>
                                            ))}
                                        </Timeline>
                                    ) : (
                                        <Text>Không có cập nhật</Text>
                                    )}
                                </div>

                            </Card>
                        </Col>
                    </Row>

                    {/* Danh sách sản phẩm */}
                    <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                        <Col span={24}>
                            <Card
                                title={<Text strong>Danh sách sản phẩm</Text>}
                                bordered={false}
                            >
                                <Table
                                    dataSource={orderDetails.order_items}
                                    columns={columns}
                                    pagination={false}
                                    rowKey="id"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
            <Modal
                visible={visibleImage}
                footer={null}
                onCancel={handleClose}
                centered
            >
                <img
                    src={imageSrc}
                    alt="Log Image"
                    style={{
                        width: "100%",
                        maxHeight: "80vh", 
                        objectFit: "contain",
                    }}
                />
            </Modal>
        </Modal>
    );
}

ModalOrderDetails.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    orderDetails: PropTypes.object,
};

ModalOrderDetails.defaultProps = {
    orderDetails: null,
};

export default ModalOrderDetails;
