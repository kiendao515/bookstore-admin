import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Table, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import offlineOrderApi from 'api/offlineOrderApi';

const OfflineOrderHistoryPopUp = ({ togglePopUp, setTogglePopUp, reload }) => {
    const navigate = useNavigate();
    const [offlineOrders, setOfflineOrders] = useState([]);

    const [params, setParams] = useState({
        page: 0,
        size: 100,
        reload: 0,
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    useEffect(() => {
        const fetchOfflineOrders = async () => {
            try {
                const response = await offlineOrderApi.getOfflineOrders({ ...params });
                setOfflineOrders(response);
                console.log(response);
            } catch (error) {
                console.error('Error fetching offline orders:', error);
            }
        };

        fetchOfflineOrders();
    }, [params]); // Dependencies: fetch new data whenever `params` changes


    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Ngày bán',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Tổng thanh toán',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Chi tiết',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        navigate(`/offline-order/${record.id}`);
                        setTogglePopUp(false);
                    }}
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    const dataSource = useMemo(() => {
        return (
            offlineOrders?.data?.map((order, index) => ({
                key: order?.id,
                id: order?.id,
                index: index + 1,
                created_at: moment(order?.created_at).format('DD/MM/YYYY HH:mm:ss'),
                quantity: order?.quantity,
                total: order?.total_price,
            })) || []
        );
    }, [offlineOrders]);

    return (
        <Modal
            title={<Typography.Text strong>Danh sách đơn hàng</Typography.Text>}
            visible={togglePopUp}
            onCancel={() => setTogglePopUp(false)}
            footer={
                <Button type="primary" danger onClick={() => setTogglePopUp(false)}>
                    Đóng
                </Button>
            }
            width="80%"
        >
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
                }}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    current: params.page + 1,
                    pageSize: params.size,
                    total: offlineOrders?.total_elements || 0,
                    onChange: (page, pageSize) => {
                        setParams((prev) => ({
                            ...prev,
                            page: page - 1,
                            size: pageSize,
                        }));
                    },
                }}
            />
        </Modal>
    );
};

export default OfflineOrderHistoryPopUp;
