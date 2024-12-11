import React from 'react';
import { Table, Button, Space, Tag, Typography } from 'antd';

const { Title } = Typography;

const RevenueReport = () => {

  // Dummy data for table
  const dataSource = [
    {
      key: '1',
      bookName: 'Làm Giàu Không Khó',
      condition: 'Like New',
      stock: 10,
      sold: 20,
      closed: 15,
      commission: 10,
    },
    {
      key: '2',
      bookName: 'Trí Tuệc Xúc Cảm',
      condition: 'Used',
      stock: 5,
      sold: 12,
      closed: 10,
      commission: 15,
    },
    // Add more sample data as needed
  ];

  // Columns for the table
  const columns = [
    {
      title: 'Tên Sách',
      dataIndex: 'bookName',
      key: 'bookName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Tình Trạng',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition) => <Tag color={condition === 'Like New' ? 'green' : 'volcano'}>{condition}</Tag>,
    },
    {
      title: 'Tồn Kho',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Đã Bán',
      dataIndex: 'sold',
      key: 'sold',
    },
    {
      title: 'Đã Chốt',
      dataIndex: 'closed',
      key: 'closed',
    },
    {
      title: 'Phần Trăm Hoa Hồng (%)',
      dataIndex: 'commission',
      key: 'commission',
      render: (commission) => <span>{commission}%</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => exportReport(record)}>Xuất Báo Cáo</Button>
        </Space>
      ),
    },
  ];

  // Function to handle report export
  const exportReport = (record) => {
    console.log('Xuất báo cáo cho:', record);
    // Logic to export report for the specific record
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Báo Cáo Doanh Thu Hiệu Sách Cũ
      </Title>
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        bordered 
        pagination={{ pageSize: 5 }} 
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default RevenueReport;
