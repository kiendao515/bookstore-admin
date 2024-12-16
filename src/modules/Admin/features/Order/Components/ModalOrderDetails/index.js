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
    Button,
    message,
    Select,
    Input,
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
            dataIndex: "quantity",
            key: "quantity",
        }
    ];

    const [orderDetail, setOrderDetail] = useState(null);
    const [orderUpdate, setOrderUpdate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [status, setStatus] = useState("");
    const [ghtkOrder, setGhtkOrder] = useState(null);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getTraceOrder(orderDetail.shipping_code);
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
            setLoading(false);
        }
    };

    const fetchDetailOrder = async () => {
        setLoading(true);
        try {
            const rs = await orderApi.getOrderDetail(orderDetails?.id);
            setOrderDetail(rs.data);
            setStatus(rs.data?.status);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchOrderDetails();
            fetchDetailOrder();
        }
    }, [visible,status]);

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

    const handlePrintOrder = async () => {
        console.log("In đơn hàng:", orderDetail.order_code);
        try {
            const response = await orderApi.printOrder(orderDetail.order_code);
            if (response.result) {
                message.success("In thông tin đơn hàng thành công");

                const pdfBase64 = response.data;
                const pdfBlob = new Blob([new Uint8Array(atob(pdfBase64).split("").map(char => char.charCodeAt(0)))], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfUrl);
                setIsModalVisible(true);
            } else {
                message.error("Có lỗi khi in đơn hàng");
            }
        } catch (error) {
            message.error("Lỗi kết nối khi in đơn hàng");
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);  // Đóng modal
        setPdfUrl(null);  // Xóa URL PDF để tránh lỗi khi modal bị đóng
    };

    const isPrintable = () => {
        const status = orderDetail?.status;
        return !(status === "CREATED" || status === "READY_TO_PACKAGE");
    };
    const isCreateGHTKOrder = () => {
        const status = orderDetail?.status;
        return !(status === "READY_TO_PACKAGE");
    };
    const handleStatusChange = async (newStatus) => {
        try {
            const response = await orderApi.updateOrderStatus(orderDetail.order_code, { status: newStatus });
            if (response.result) {
                setStatus(newStatus);  // Update status in state
                message.success("Cập nhật trạng thái đơn hàng thành công!");
            } else {
                message.error("Không thể cập nhật trạng thái đơn hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
        }
    };
    const handleCreateGHTKOrder = async () => {
        try {
            const ordersToSubmit = [{
                order_code: orderDetail?.order_code,
                address: orderDetail?.address,
                customer_name: orderDetail?.customer_name,
                customer_phone: orderDetail?.customer_phone,
                note: orderDetail?.note,
                weight: weight,
                total_amount: orderDetail?.total_amount,
                payment_type: orderDetail?.payment_type,
                pickup_method: orderDetail?.pickup_method,
                pick_address: orderDetail?.pick_address,
            }]

            const response = await orderApi.createGHTKOrder(ordersToSubmit);
            if (response.result) {
                message.success("Đăng đơn hàng thành công");
                setGhtkOrder(response.data[0]);
                // onClose();
            } else {
                message.error("Có lỗi khi đăng đơn hàng");
            }
        } catch (error) {
            console.log(error);

            message.error("Lỗi kết nối khi đăng đơn hàng", error);
        }
    };

    const handleWeightChange = (e) => {
        setWeight(e.target.value);
    };
    const [weight, setWeight] = useState(null);

    return (
        <Modal
            title={<Title level={4}>Chi tiết đơn hàng - {orderDetail?.order_code}</Title>}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Đóng
                </Button>,
                <Button
                    key="order"
                    type="primary"
                    onClick={handleCreateGHTKOrder}
                    disabled={isCreateGHTKOrder()}
                >
                    Đăng đơn
                </Button>,
                <Button
                    key="print"
                    type="primary"
                    onClick={handlePrintOrder}
                    disabled={!isPrintable()}  // Disable the button based on the order status
                >
                    In đơn mã đơn hàng
                </Button>,
            ]}
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
                                            <Select
                                                value={orderDetail.status}
                                                onChange={handleStatusChange}
                                                style={{ width: "100%" }}
                                                disabled={orderDetail.status === "DONE"}
                                            >
                                                <Option value="CREATED">Chờ xác nhận</Option>
                                                <Option value="READY_TO_PACKAGE">Sẵn sàng đóng gói</Option>
                                                <Option value="READY_TO_SHIP">Sẵn sàng gửi</Option>
                                                <Option value="SHIPPING">Đang giao</Option>
                                                <Option value="DONE">Đã giao</Option>
                                            </Select>
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
                                        <Descriptions.Item label="Cân nặng">
                                            <Input
                                                value={weight}
                                                onChange={handleWeightChange}
                                                placeholder="Nhập cân nặng"
                                                suffix="kg"
                                            />
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
            <Modal
                title="Xem PDF"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width="80%"
                destroyOnClose={true}
            >
                {pdfUrl && (
                    <div style={{ height: '500px', overflowY: 'auto' }}>
                        <embed src={pdfUrl} width="100%" height="100%" type="application/pdf" />
                    </div>
                )}
            </Modal>
            {ghtkOrder && (
                <Modal
                    title="Đăng đơn hàng thành công"
                    visible={!!ghtkOrder}
                    onCancel={() => setGhtkOrder(null)}
                    footer={[
                        <Button key="ok" type="primary" onClick={() => setGhtkOrder(null)}>
                            OK
                        </Button>,
                    ]}
                >
                    <p><strong>Tình trạng:</strong> {ghtkOrder.status_id == 1 ? "Chưa tiếp nhận" : "Đã tiếp nhận"}</p>
                    <p><strong>Mã đơn hàng:</strong> {ghtkOrder.label}</p>
                    <p><strong>Khu vực:</strong> {ghtkOrder.area}</p>
                    <p><strong>Phí vận chuyển:</strong> {ghtkOrder.fee} VND</p>
                    <p><strong>Thời gian ước tính lấy hàng:</strong> {ghtkOrder.estimated_pick_time}</p>
                </Modal>
            )}
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
