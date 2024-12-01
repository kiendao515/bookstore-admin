import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button, Input, Form, Select, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import orderApi from "api/orderApi";

const { Title } = Typography;

const EditableTable = ({ show, onClose, orderInfo }) => {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null); 

  useEffect(() => {
    const updatedOrderInfo = orderInfo.map((order, index) => ({
      ...order,
      key: order.id || index, 
      pick_address: "",
      weight: order.weight || 0,
    }));

    setDataSource(updatedOrderInfo.filter((o) => o.status === "READY_TO_PACKAGE"));
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
  }, [orderInfo]);

  const handleFieldChange = (value, key, column) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);

    if (index > -1) {
      const updatedRow = { ...newData[index] };
      updatedRow[column] = value; 
      newData[index] = updatedRow;
      setDataSource(newData);
    }
  };

  const submitOrder = async () => {
    try {
      const ordersToSubmit = dataSource.map((order) => ({
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
      console.log(ordersToSubmit);
      
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
          value={record.pick_address} // Hiển thị giá trị pick_address hiện tại
          style={{ minWidth: "200px", width: "100%" }}
          onChange={(value) => handleFieldChange(value, record.key, "pick_address")} // Lấy value là name
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
  const EditableCell = ({ title, editable, children, column, record, ...restProps }) => {
    return (
      <td {...restProps}>
        {editable ? (
          column === "pick_address" ? (
            <Select
              value={record[column]} // Hiển thị giá trị hiện tại là name
              style={{ minWidth: "200px", width: "100%" }}
              onChange={(value) => handleFieldChange(value, record.key, column)} // Cập nhật giá trị pick_address là name
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
              rules={[{ required: true, message: `${title} is required.` }]}>
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
  };

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
      title={t("Thông tin đơn hàng")}
      visible={show}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("Đóng")}
        </Button>,
        <Button key="submit" type="primary" onClick={submitOrder}>
          {t("Đăng đơn")}
        </Button>,
      ]}
      width={"100%"}
    >
      <Title level={4}>{t("Danh sách đơn hàng")}</Title>
      <Table
        rowKey="key"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={mergedColumns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: true }}
        bordered
      />

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
          <p><strong>{t("Thời gian ước tính lấy hàng")}:</strong> {orderDetails.estimated_pick_time}</p>
          <p><strong>{t("Thời gian ước tính giao hàng")}:</strong> {orderDetails.estimated_deliver_time}</p>
          <p><strong>{t("Tracking ID")}:</strong> {orderDetails.tracking_id}</p>
        </Modal>
      )}
    </Modal>
  );
};

EditableTable.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderInfo: PropTypes.array.isRequired,
};

export default EditableTable;
