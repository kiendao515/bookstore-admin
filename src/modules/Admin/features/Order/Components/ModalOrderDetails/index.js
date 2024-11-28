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
    Spin,  // Import Spin for loading indicator
} from "antd";
import PropTypes from "prop-types";
import orderApi from "api/orderApi";
import Utils from "general/utils/Utils";

const { Title, Text } = Typography;

function ModalOrderDetails({ visible, onClose, orderDetails }) {
    const columns = [
        {
            title: "Tên",
            dataIndex: "bookName",
            key: "bookName",
        },
        {
            title: "Tình trạng",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Số lượng",
            dataIndex : "quantity",
            key : "quantity"
        }
    ];
    
    const [orderDetail, setOrderDetail] = useState(null);
    const [orderUpdate, setOrderUpdate] = useState(null);
    const [loading, setLoading] = useState(false);  // State to track loading
    
    const fetchOrderDetails = async () => {
        setLoading(true);  // Set loading to true when starting to fetch
        try {
            const response = await orderApi.getTraceOrder("S428925.MN6-01-TA61.1064754820");
            if (response.data.success) {
                const combinedLogs = [...response.data.data?.PickLog, ...response.data.data?.DeliverLog].sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                );
                setOrderUpdate(combinedLogs);
            } else {
                console.error("Lỗi khi tải dữ liệu chi tiết đơn hàng");
            }
        } catch (error) {
            console.error("Lỗi gọi API:", error);
        } finally {
            setLoading(false);  // Set loading to false after the request is complete
        }
    };

    const fetchDetailOrder = async () => {
        setLoading(true);  // Set loading to true when starting to fetch
        try {
            const rs = await orderApi.getOrderDetail(orderDetails?.id);
            setOrderDetail(rs.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
        } finally {
            setLoading(false);  // Set loading to false after the request is complete
        }
    };

    useEffect(() => {
        if (visible) {
            fetchOrderDetails();
            fetchDetailOrder();
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
            title={<Title level={4}>Chi tiết đơn hàng - {orderDetail?.order_code}</Title>}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
        >
            {/* Show loading spinner if loading is true */}
            <Spin spinning={loading} tip="Đang tải dữ liệu..." size="large">
                {orderDetail && (
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
                                            <Text strong>{orderDetail.order_code}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">
                                            <Badge
                                                status="success"
                                                text={Utils.handleOrderStatus(orderDetail.status) || "N/A"}
                                            />
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày tạo">
                                            {orderDetail.created_at}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Hình thức thanh toán">
                                            {orderDetail.payment_type ? "Chuyển khoản" : "Thanh toán khi nhận hàng"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ghi chú">
                                            {orderDetail.note || "Không có"}
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
                                            {orderDetail.customer_name || "N/A"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Số điện thoại">
                                            {orderDetail.customer_phone || "N/A"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Email">
                                            {orderDetail.email || "Không có"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa chỉ">
                                            {orderDetail.address}
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
                                        dataSource={orderDetail.order_items}
                                        columns={columns}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Spin>

            {/* Modal to view image */}
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
