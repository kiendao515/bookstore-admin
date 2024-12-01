import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button, Input, Form, Select, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import orderApi from "api/orderApi";

const { Title } = Typography;

const ModalMultiOrder = ({ show, onClose, orderInfo }) => {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([]); 
  const [pickupOptions, setPickupOptions] = useState([]); 
  const [orderDetails, setOrderDetails] = useState(null);

  // Nhóm đơn hàng theo customer_name
  useEffect(() => {
    const groupedOrders = orderInfo.reduce((acc, order) => {
      const accountId = order.account?.id;  
      if (!acc[accountId]) {
        acc[accountId] = [];
      }
      acc[accountId].push({
        ...order,
        key: order.id || order.account?.id, 
        pick_address: "",
        weight: order.weight || 0,
      });
      return acc;
    }, {});

    // Chuyển nhóm thành mảng
    const groupedOrdersArray = Object.keys(groupedOrders).map((accountId) => ({
      accountId,
      orders: groupedOrders[accountId],
    }));

    setDataSource(groupedOrdersArray); 
  }, [orderInfo]);

  // Lấy các địa chỉ lấy hàng
  useEffect(() => {
    const fetchPickupOptions = async () => {
      try {
        const data = await orderApi.getPickingAddress();
        if (data.result) {
          const pickupList = data.data.map((item) => ({
            id: `${item.pick_tel}-${item.pick_name}-${item.address}`,
            name: `${item.pick_tel}-${item.pick_name}-${item.address}`,
          }));
          setPickupOptions(pickupList);
        } else {
          console.error("Lỗi khi lấy dữ liệu từ API:", data.message);
        }
      } catch (error) {
        console.error("Error fetching pickup options:", error);
      }
    };
    fetchPickupOptions();
  }, []);

  const handleFieldChange = (value, key, column) => {
    const newData = [...dataSource];
    const accountIndex = newData.findIndex((item) => key === item.accountId);
    if (accountIndex > -1) {
      const orderIndex = newData[accountIndex].orders.findIndex(order => order.key === key);
      if (orderIndex > -1) {
        newData[accountIndex].orders[orderIndex][column] = value;  // Cập nhật giá trị của đơn hàng trong nhóm
        setDataSource(newData);
      }
    }
  };

  // Xử lý đăng đơn
  const submitOrder = async (orders) => {
    try {
      const ordersToSubmit = orders.map((order) => ({
        order_code: order.order_code,
        address: order.address,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        note: order.note,
        weight: order.weight,
        total_amount: order.total_amount,
        payment_type: order.payment_type,
        pickup_method: order.pickup_method,
        pick_address: order.pick_address,
      }));

      // Gửi các đơn đến API
      const response = await orderApi.createGHTKOrder(ordersToSubmit);
      if (response.result) {
        message.success(t("Đăng đơn hàng thành công"));
        setOrderDetails(response.data);
        onClose();
      } else {
        message.error(t("Có lỗi khi đăng đơn hàng"));
      }
    } catch (error) {
      message.error(t("Lỗi kết nối khi đăng đơn hàng"));
    }
  };

  // Xử lý in thông tin đơn hàng
  const printGroupOrder = async (orders) => {
    console.log(dataSource);
    
    try {
      const response = await orderApi.printOrder({ orders });
      if (response.success) {
        message.success(t("In thông tin đơn hàng thành công"));
      } else {
        message.error(t("Có lỗi khi in đơn hàng"));
      }
    } catch (error) {
      message.error(t("Lỗi kết nối khi in đơn hàng"));
    }
  };

  // Các cột có thể chỉnh sửa trong bảng
  const editableColumns = [
    { title: t("Mã đơn"), dataIndex: "order_code", editable: false },
    { title: t("Địa chỉ"), dataIndex: "address", editable: true },
    { title: t("Tên khách hàng"), dataIndex: "customer_name", editable: true },
    { title: t("Số điện thoại"), dataIndex: "customer_phone", editable: true },
    { title: t("Ghi chú giao hàng"), dataIndex: "note", editable: true },
    { title: t("Khối lượng"), dataIndex: "weight", editable: true },
    { title: t("Giá trị hàng"), dataIndex: "total_amount", editable: false },
    {
      title: t("Địa chỉ lấy hàng"),
      dataIndex: "pick_address",
      editable: true,
      render: (text, record) => (
        <Select
          value={record.pick_address}
          style={{ minWidth: "200px", width: "100%" }}
          onChange={(value) => handleFieldChange(value, record.key, "pick_address")}
        >
          {pickupOptions.map((option) => (
            <Select.Option key={option.name} value={option.name}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  // Component chỉnh sửa ô bảng
  const EditableCell = ({ title, editable, children, column, record, ...restProps }) => (
    <td {...restProps}>
      {editable ? (
        column === "pick_address" ? (
          <Select
            value={record[column]}
            style={{ minWidth: "200px", width: "100%" }}
            onChange={(value) => handleFieldChange(value, record.key, column)}
          >
            {pickupOptions.map((option) => (
              <Select.Option key={option.name} value={option.name}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Form.Item
            style={{ margin: 0 }}
            name={column}
            initialValue={record[column]}
            rules={[{ required: true, message: `${title} is required.` }]}
          >
            <Input
              defaultValue={children}
              onBlur={(e) => handleFieldChange(e.target.value, record.key, column)}
            />
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );

  const mergedColumns = editableColumns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      column: col.dataIndex,
    }),
  }));

  return (
    <Modal
      visible={show}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("Đóng")}
        </Button>,
      ]}
      width={"100%"}
    >
      <Title level={4}>{t("Đơn gom chung")}</Title>
      {dataSource.map((group) => (
        <div key={group.accountId}>
          <Title level={5}>{t("Đơn hàng của")} {group.orders[0]?.customer_name}</Title>
          <Table
            rowKey="key"
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={group.orders}
            pagination={false}
            scroll={{ x: true }}
            bordered
          />
          <Button
            key={`submit-${group.accountId}`}
            type="primary"
            onClick={() => submitOrder(group.orders)}
          >
            {t("Đăng đơn")}
          </Button>
          <Button
            key={`print-${group.accountId}`}
            onClick={() => printGroupOrder(group.orders)}
          >
            {t("In đơn hàng")}
          </Button>
        </div>
      ))}

      {orderDetails && (
        <Modal
          title={t("Thông tin đơn hàng thành công")}
          visible={!!orderDetails}
          onCancel={() => setOrderDetails(null)}
          footer={[
            <Button key="ok" type="primary" onClick={() => setOrderDetails(null)}>
              {t("OK")}
            </Button>,
          ]}
        >
          <p><strong>{t("Mã đơn hàng")}:</strong> {orderDetails.label}</p>
          <p><strong>{t("Khu vực")}:</strong> {orderDetails.area}</p>
          <p><strong>{t("Phí vận chuyển")}:</strong> {orderDetails.fee} VND</p>
          <p><strong>{t("Thời gian ước tính lấy hàng")}:</strong> {orderDetails.estimated_pickup_time}</p>
        </Modal>
      )}
    </Modal>
  );
};

ModalMultiOrder.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderInfo: PropTypes.array.isRequired,
};

export default ModalMultiOrder;
