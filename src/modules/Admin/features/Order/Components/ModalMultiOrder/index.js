import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button, Input, Form, Select, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import orderApi from "api/orderApi";

const { Title } = Typography;

const ModalMultiOrder = ({ show, onClose, orderInfo }) => {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    orderInfo = orderInfo.filter((order) => order.related_order_id != null && order.status === "READY_TO_PACKAGE");
    const groupedOrders = orderInfo.reduce((acc, order) => {
      const rootOrderId = order.related_order_id || order.order_code;
      if (!acc[rootOrderId]) {
        acc[rootOrderId] = [];
      }
      acc[rootOrderId].push(order);
      return acc;
    }, {});
  
    const groupedOrdersArray = Object.keys(groupedOrders).map((rootOrderId) => {
      const orders = groupedOrders[rootOrderId];
      const firstOrder = orders[0]; // Lấy bản ghi đầu tiên
      return {
        rootOrderId,
        customer_name: firstOrder?.customer_name || "",
        customer_phone: firstOrder?.customer_phone || "",
        address: firstOrder?.address || "",
        note: firstOrder?.note || "",
        weight: firstOrder?.weight || "",
        orders,
      };
    });
  
    setDataSource(groupedOrdersArray);
  }, [orderInfo]);

  const submitOrder = async (orders) => {
    console.log(orders);
    
    try {
      const ordersToSubmit = {
        order_code: orders[0].rootOrderId,
        address: orders[0].address,
        customer_name: orders[0].customer_name,
        customer_phone: orders[0].customer_phone,
        note: orders[0].note,
        weight: orders[0].weight,
        total_amount: orders[0].total_amount,
        payment_type: orders[0].payment_type,
        pickup_method: orders[0].pickup_method,
        pick_address: orders[0].pick_address,
      };
      const response = await orderApi.createGHTKCombinedOrder(ordersToSubmit);
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
    { title: t("Giá trị hàng"), dataIndex: "total_amount", editable: false },
  ];
  const handleFieldChange = (value, key, column) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);

    if (index > -1) {
      newData[index] = { ...newData[index], [column]: value };
      setDataSource(newData);
    }
  };

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
    { title: t("Mã đơn gốc"), dataIndex: "rootOrderId", editable: false },
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

  const mergedColumns = editableColumns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      column: col.dataIndex,
    }),
  }));
  console.log(dataSource.length == 0, orderInfo);
  

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
            rowKey="order_code"
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            expandable={{
              expandedRowRender: (record) => (
                <Table
                  rowKey="order_code"
                  columns={mergedColumns}
                  dataSource={record.orders}
                  pagination={false}
                  scroll={{ x: true }}
                  bordered
                />
              ),
              rowExpandable: (record) => record.orders.length > 1, // Chỉ mở rộng nếu có đơn hàng con
            }}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: true }}
            bordered
          />

          <Button
            key={`submit-${group.accountId}`}
            type="primary"
            onClick={() => submitOrder(dataSource)}
            disabled={dataSource.length == 0}
          >
            {t("Đăng đơn")}
          </Button>
          <Button
            key={`print-${group.accountId}`}
            onClick={() => printGroupOrder(dataSource)}
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
