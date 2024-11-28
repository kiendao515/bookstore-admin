import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button, Input, Form, Select, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import orderApi from "api/orderApi"; // Giả sử bạn đã có API này

const { Title } = Typography;

const EditableTable = ({ show, onClose, orderInfo }) => {
  const { t } = useTranslation();
  const [dataSource, setDataSource] = useState([]);
  const [pickupOptions, setPickupOptions] = useState([]);

  useEffect(() => {
    setDataSource(orderInfo.filter(o=>o.status == "READY_TO_PACKAGE")); // Cập nhật lại dataSource từ prop
    const fetchPickupOptions = async () => {
      try {
        const data = await orderApi.getPickingAddress();
        if (data.result) {
          const pickupList = data.data.map(item => ({
            id: item.pick_address_id,
            name: item.address,
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
      const newRow = { ...newData[index] }; // Sao chép bản sao của hàng hiện tại
      newRow[column] = value; // Cập nhật giá trị của cột
      newData[index] = newRow; // Gán bản sao đã thay đổi vào mảng dữ liệu
      setDataSource(newData); // Cập nhật lại state
    }
  };

  const printOrder = async () => {
    console.log(dataSource);
    
    try {
      const response = await orderApi.printOrder({ orders: dataSource });
      if (response.success) {
        message.success(t("In thông tin đơn hàng thành công"));
      } else {
        message.error(t("Có lỗi khi in đơn hàng"));
      }
    } catch (error) {
      message.error(t("Lỗi kết nối khi in đơn hàng"));
    }
  };

  // API call for submitting the order
  const submitOrder = async () => {
    try {
      const response = await orderApi.submitOrder({ orders: dataSource });
      if (response.success) {
        message.success(t("Đăng đơn hàng thành công"));
        onClose(); // Đóng modal sau khi đăng đơn thành công
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
    { title: t("Giá trị hàng"), dataIndex: "total_amount", editable: false },
    {
      title: t("Tiền COD"),
      dataIndex: "payment_type",
      editable: false,
      render: (text, record) => {
        return !text ? record.total_amount : 0;
      },
    },
    {
      title: t("Hình thức lấy hàng"),
      dataIndex: "pickup_method",
      editable: true,
      render: (text, record) => (
        <Select
          value={text || 'Chọn hình thức'}  // Dùng value thay vì defaultValue để quản lý dữ liệu
          style={{ minWidth: '200px', width: '100%' }} // Đảm bảo ô Select có chiều rộng đủ lớn
          onChange={(value) => handleFieldChange(value, record.key, 'pickup_method')}
        >
          {pickupOptions.map((option) => (
            <Select.Option key={option.id} value={option.id}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const EditableCell = ({ title, editable, children, column, record, ...restProps }) => {
    return (
      <td {...restProps}>
        {editable ? (
          column === "pickup_method" ? (
            <Select
              value={children || 'Chọn hình thức'}  // Sử dụng value để cập nhật chính xác
              style={{ minWidth: '200px', width: '100%' }} // Đảm bảo chiều rộng ô select đủ lớn
              onChange={(value) => handleFieldChange(value, record.key, column)}
            >
              {pickupOptions.map((option) => (
                <Select.Option key={option.id} value={option.id}>
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
        ) : children}
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
        <Button key="print" onClick={printOrder}>
          {t("In thông tin đơn hàng")}
        </Button>,
      ]}
      width={'100%'}
    >
      <Title level={4}>{t("Danh sách đơn hàng")}</Title>
      <Table
        rowKey="id"
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
    </Modal>
  );
};

EditableTable.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderInfo: PropTypes.array.isRequired,
};

export default EditableTable;
