import React, { useState } from "react";
import { Table, Modal, Button, Descriptions, Input } from "antd";

const orders = [
  {
    id: "Z66J2QJ5MI0ENODFNK",
    recipientName: "Hanh Nguyen",
    phone: "0352328651",
    email: "bedeuilisavablackpink1009@gmail.com",
    address: "60e2 đường số 2 phường 7, TP Bến Tre",
    status: "Chờ gói hàng",
    createDate: "23/11/2024 12:58:07",
    courier: "Giao hàng tiết kiệm",
    trackingCode: "a",
    totalAmount: 395000,
    shippingFee: 0,
    note: "a",
    details: [
      { name: "Tác phẩm triết học", condition: "khá", quantity: 1, price: 150000 },
      { name: "Văn chương lâm nguy", condition: "đẹp", quantity: 1, price: 100000 },
      { name: "Những di chúc bị phản bội", condition: "đẹp", quantity: 1, price: 145000 },
    ],
  },
  // Thêm các đơn hàng khác ở đây
];

const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: "Tên người nhận",
      dataIndex: "recipientName",
      key: "recipientName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${amount.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showOrderDetails(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={orders} columns={columns} rowKey="id" />

      <Modal
        title={`Đơn ${selectedOrder?.id}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Trạng thái đơn hàng">
                {selectedOrder.status}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo đơn">
                {selectedOrder.createDate}
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị vận chuyển">
                {selectedOrder.courier}
              </Descriptions.Item>
              <Descriptions.Item label="Mã vận đơn">
                {selectedOrder.trackingCode}
              </Descriptions.Item>
              <Descriptions.Item label="Tên người nhận">
                {selectedOrder.recipientName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.address}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.email}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {selectedOrder.note}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng cộng">
                {`${(selectedOrder.totalAmount + selectedOrder.shippingFee).toLocaleString()}đ`}
              </Descriptions.Item>
            </Descriptions>

            <h3>Chi tiết đơn</h3>
            <Table
              dataSource={selectedOrder.details}
              columns={[
                {
                  title: "Tên sản phẩm",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Tình trạng",
                  dataIndex: "condition",
                  key: "condition",
                },
                {
                  title: "Số lượng",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "Giá",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => `${price.toLocaleString()}đ`,
                },
              ]}
              pagination={false}
              rowKey="name"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;