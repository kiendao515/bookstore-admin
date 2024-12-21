import React, { useEffect, useState } from 'react';
import { Modal, Spin, Table, Image, Row, Col } from 'antd';
import revenueApi from 'api/revenueApi';
import Utils from 'general/utils/Utils';

const ModalEditRevenue = ({
  show,
  onClose,
  onExistDone,
  collectionItem,
  onRefreshCollectionList,
  storeId,
}) => {
  const [loading, setLoading] = useState(false);
  const [bookDetail, setBookDetail] = useState(null);

  // Fetch chi tiết sách khi modal mở
  useEffect(() => {
    if (show && collectionItem) {
      fetchBookDetail(storeId, collectionItem.id);
    }
  }, [show, collectionItem]);

  const fetchBookDetail = async (storeId, bookId) => {
    setLoading(true);
    try {
      const { result, data } = await revenueApi.getDetailBookRevenue(storeId, bookId);
      if (result) setBookDetail(data);
      else console.error('Không thể tải chi tiết sách');
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sách:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình cột cho bảng "Thông tin tồn kho"
  const inventoryColumns = [
    { title: 'Tình trạng', dataIndex: 'type', key: 'type', render: (type) => (type ? Utils.getBookQuality(type) : 'N/A') },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (price ? `${price.toLocaleString()} VND` : 'N/A'),
    },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    {
      title: 'Ảnh bìa',
      dataIndex: 'book',
      key: 'coverImage',
      render: (book) =>
        book?.coverImage ? <Image width={50} src={book.coverImage} /> : 'Không có ảnh',
    },
  ];

  // Cấu hình cột cho bảng "Thông tin đã bán"
  const soldColumns = [
    { title: 'Mã đơn hàng', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Tình trạng', dataIndex: 'type', key: 'type', render: (type) => (type ? Utils.getBookQuality(type) : 'N/A') },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (price ? `${price.toLocaleString()} VND` : 'N/A'),
    },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Ngày bán', dataIndex: 'created_at', key: 'created_at', render: (created_at) => (created_at ? new Date(created_at).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) : 'N/A')
    },
  ];

  return (
    <Modal
      visible={show}
      title={<h2 style={{ fontWeight: 'bold', color: '#1890ff' }}>Chi tiết sách</h2>}
      onCancel={onClose}
      footer={null}
      width={1500}
      afterClose={onExistDone}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {bookDetail ? (
            <>
              <div style={{ marginBottom: '20px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <h3 style={{ fontSize: '1.5em' }}>{bookDetail.inventory[0]?.book?.name || 'N/A'}</h3>
                <p>
                  <strong>Tác giả:</strong> {bookDetail.inventory[0]?.book?.authorName || 'N/A'}
                </p>
                <p>
                  <strong>Nhà xuất bản:</strong> {bookDetail.inventory[0]?.book?.publisher || 'N/A'}
                </p>
              </div>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <h4 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#52c41a' }}>
                    🗂️ Thông tin tồn kho
                  </h4>
                  <Table
                    dataSource={bookDetail.inventory}
                    columns={inventoryColumns}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: true }}
                    bordered
                  />
                </Col>
                <Col xs={24} md={12}>
                  <h4 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#faad14' }}>
                    📦 Thông tin đã bán
                  </h4>
                  {bookDetail.order_items?.length > 0 ? (
                    <Table
                      dataSource={bookDetail.order_items}
                      columns={soldColumns}
                      rowKey="order_id"
                      pagination={false}
                      scroll={{ x: true }}
                      bordered
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#8c8c8c' }}>
                      <p>Hiện chưa có dữ liệu về sách đã bán.</p>
                    </div>
                  )}
                </Col>
              </Row>
            </>
          ) : (
            <p style={{ textAlign: 'center', color: '#8c8c8c' }}>Không có thông tin chi tiết</p>
          )}
        </>
      )}
    </Modal>
  );
};

export default ModalEditRevenue;
