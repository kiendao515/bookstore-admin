import React from "react";
import { Table, Card, Descriptions, Typography } from "antd";

const { Title } = Typography;

// Dummy data
const bookDetail = {
  name: "Cuốn nhật ký bí mật",
  author: "Nguyễn Văn A",
  inventory: 10,
  total_revenue: 400000,
};

const inventoryDetails = [
  { key: 1, location: "Kho A", quantity: 5 },
  { key: 2, location: "Kho B", quantity: 3 },
  { key: 3, location: "Kho C", quantity: 2 },
];

const orderItems = [
  {
    key: 1,
    order_id: "OD12345",
    date: "2024-06-01",
    quantity: 2,
    price: 100000,
    total: 200000,
  },
  {
    key: 2,
    order_id: "OD12346",
    date: "2024-06-05",
    quantity: 2,
    price: 100000,
    total: 200000,
  },
];

const BookRevenueDetail = () => {
  // Columns for inventory
  const inventoryColumns = [
    { title: "Kho hàng", dataIndex: "location", key: "location" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
  ];

  // Columns for order items
  const orderColumns = [
    { title: "Mã đơn hàng", dataIndex: "order_id", key: "order_id" },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn giá", dataIndex: "price", key: "price" },
    { title: "Tổng tiền", dataIndex: "total", key: "total" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Chi Tiết Doanh Thu</Title>

      {/* Book Information */}
      <Card title="Thông Tin Sách" style={{ marginBottom: 20 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên sách">{bookDetail.name}</Descriptions.Item>
          <Descriptions.Item label="Tác giả">{bookDetail.author}</Descriptions.Item>
          <Descriptions.Item label="Tồn kho">{bookDetail.inventory}</Descriptions.Item>
          <Descriptions.Item label="Tổng doanh thu">
            {bookDetail.total_revenue.toLocaleString()} VND
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Inventory Table */}
      <Card title="Chi Tiết Tồn Kho" style={{ marginBottom: 20 }}>
        <Table
          dataSource={inventoryDetails}
          columns={inventoryColumns}
          pagination={false}
          bordered
        />
      </Card>

      {/* Order Items Table */}
      <Card title="Chi Tiết Đơn Hàng">
        <Table
          dataSource={orderItems}
          columns={orderColumns}
          pagination={false}
          bordered
        />
      </Card>
    </div>
  );
};

export default BookRevenueDetail;
