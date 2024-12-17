import React, { useEffect, useState } from 'react';
import { Modal, Spin, Table, Image, Row, Col } from 'antd';
import axios from 'axios';
import revenueApi from 'api/revenueApi';

const ModalEditRevenue = ({
  show,
  onClose,
  onExistDone,
  collectionItem,
  onRefreshCollectionList,
  storeId
}) => {
  const [loading, setLoading] = useState(false);
  const [bookDetail, setBookDetail] = useState(null);

  useEffect(() => {
    if (show && collectionItem) {
      fetchBookDetail(storeId, collectionItem.id);
    }
  }, [show, collectionItem]);

  const fetchBookDetail = async (storeId, bookId) => {
    setLoading(true);
    try {
      const response = await revenueApi.getDetailBookRevenue(storeId, bookId);
      if (response.result) {
        setBookDetail(response.data);
      } else {
        console.error('Failed to fetch book details');
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const inventoryColumns = [
    {
      title: 'Tình trạng',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `${price.toLocaleString()} VND` : 'N/A',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Cover Image',
      dataIndex: 'book',
      key: 'coverImage',
      render: (book) => book?.coverImage ? <Image width={50} src={book.coverImage} /> : 'No Image',
    }
  ];

  const soldColumns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `${price.toLocaleString()} VND` : 'N/A',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Date Sold',
      dataIndex: 'date_sold',
      key: 'date_sold',
    }
  ];

  return (
    <Modal
      visible={show}
      title="Book Inventory and Sales Detail"
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
              <h3>Book Name: {bookDetail.inventory[0]?.book?.name}</h3>
              <p><strong>Author:</strong> {bookDetail.inventory[0]?.book?.authorName}</p>
              <p><strong>Publisher:</strong> {bookDetail.inventory[0]?.book?.publisher}</p>
              <p><strong>Description:</strong> {bookDetail.inventory[0]?.book?.description}</p>

              <Row gutter={16}>
                <Col xs={24} md={12} lg={12}>
                  <h4>Inventory Information</h4>
                  <Table
                    dataSource={bookDetail.inventory}
                    columns={inventoryColumns}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: true }}
                  />
                </Col>
                <Col xs={24} md={12} lg={12}>
                  <h4>Sold Information</h4>
                  <Table
                    dataSource={bookDetail.order_items}
                    columns={soldColumns}
                    rowKey="order_id"
                    pagination={false}
                    scroll={{ x: true }}
                  />
                </Col>
                
              </Row>

            </>
          ) : (
            <p>No details available</p>
          )}
        </>
      )}
    </Modal>
  );
};

export default ModalEditRevenue;
