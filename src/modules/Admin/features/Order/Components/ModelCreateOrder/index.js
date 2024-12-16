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
        }
      } catch (error) {
        console.error("Error fetching pickup options:", error);
      }
    };
    fetchPickupOptions();
  }, [orderInfo]);

  // Cập nhật ô bảng
  const handleFieldChange = (value, key, column) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);

    if (index > -1) {
      newData[index] = { ...newData[index], [column]: value };
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

  // Editable Cell
  const EditableCell = ({ editable, children, record, column, ...restProps }) => {
    const inputNode = (
      <Input
        defaultValue={record ? record[column]: ""}
        onBlur={(e) => handleFieldChange(e.target.value, record.key, column)}
      />
    );

    return (
      <td {...restProps}>
        {editable ? (
          <Form.Item style={{ margin: 0 }}>
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    { title: t("Mã đơn"), dataIndex: "order_code", editable: false },
    { title: t("Địa chỉ"), dataIndex: "address", editable: false },
    { title: t("Tên khách hàng"), dataIndex: "customer_name", editable: true },
    { title: t("Số điện thoại"), dataIndex: "customer_phone", editable: true },
    { title: t("Ghi chú giao hàng"), dataIndex: "note", editable: true },
    { title: t("Khối lượng"), dataIndex: "weight", editable: true },
  ].map((col) => ({
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
        <Button key="submit" type="primary" onClick={submitOrder} disabled={dataSource.length==0}>
          {t("Đăng đơn")}
        </Button>,
      ]}
      width={"100%"}
    >
      <Form component={false}>
        <Table
          rowKey="key"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: true }}
          bordered
        />
      </Form>

      {/* {orderDetails && (
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
      )} */}
    </Modal>
  );
};

EditableTable.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderInfo: PropTypes.array.isRequired,
};

export default EditableTable;
