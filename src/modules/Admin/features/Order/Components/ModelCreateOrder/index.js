import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button, Input, Form, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import cloneDeep from "lodash/cloneDeep"; // Thêm lodash để sao chép sâu

const { Title } = Typography;

const EditableTable = ({ show, onClose, orderInfo }) => {
  const { t } = useTranslation();

  const [dataSource, setDataSource] = useState(cloneDeep(orderInfo));
  const [count, setCount] = useState(orderInfo.length);

  // Trạng thái dữ liệu lấy từ API
  const [pickupOptions, setPickupOptions] = useState([]);

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchPickupOptions = async () => {
      try {
        const response = await fetch('https://services-staging.ghtklab.com/services/shipment/list_pick_add', {
          method: 'POST',
          headers: {
            'TOKEN': '47B622D894fe3F19e3c3343B8763322DBbad50ce',
            'X-Client-Source': 'S16879546',
          }
        });
        const data = await response.json();
        
        if (data.success) {
          // Chỉ lấy phần dữ liệu cần thiết: id, tên người nhận, và địa chỉ
          const pickupList = data.data.map(item => ({
            id: item.pick_address_id,
            name: `${item.pick_name} - ${item.address}`, // Hiển thị tên người nhận và địa chỉ
          }));
          setPickupOptions(pickupList); // Lưu trữ danh sách vào state
        } else {
          console.error("Lỗi khi lấy dữ liệu từ API:", data.message);
        }
      } catch (error) {
        console.error('Error fetching pickup options:', error);
      }
    };

    fetchPickupOptions();
  }, []);

  const handleFieldChange = (value, key, column) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][column] = value;
      setDataSource(newData);
    }
  };

  const editableColumns = [
    { title: t("ID"), dataIndex: "id", editable: false },
    { title: t("Địa chỉ"), dataIndex: "address", editable: true },
    { title: t("Tên khách hàng"), dataIndex: "customer_name", editable: true },
    { title: t("Số điện thoại"), dataIndex: "customer_phone", editable: true },
    { title: t("Trạng thái"), dataIndex: "status", editable: true },
    { title: t("Ngày tạo"), dataIndex: "created_at", editable: true },
    { title: t("Tổng tiền"), dataIndex: "total_amount", editable: true },
    { title: t("Phí vận chuyển"), dataIndex: "shipping_fee", editable: true },
    { title: t("Miễn phí vận chuyển"), dataIndex: "is_freeship", editable: true, render: (text) => (text ? "Có" : "Không") },
    { 
      title: t("Hình thức lấy hàng"), 
      dataIndex: "pickup_method", 
      editable: true,
      render: (text, record) => (
        <Select 
          defaultValue={text || 'Chọn hình thức'}
          style={{ width: '100%' }}
          onChange={(value) => handleFieldChange(value, record.key, 'pickup_method')}
        >
          {pickupOptions.map((option) => (
            <Select.Option key={option.id} value={option.id}>
              {option.name} {/* Hiển thị tên người nhận và địa chỉ */}
            </Select.Option>
          ))}
        </Select>
      ),
    }
  ];

  const EditableCell = ({ title, editable, children, column, record, ...restProps }) => {
    return (
      <td {...restProps}>
        {editable ? (
          column === "pickup_method" ? (
            // Render ô Select khi cột là 'pickup_method'
            <Select
              defaultValue={children || 'Chọn hình thức'}
              style={{ width: '100%' }}
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
              rules={[
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ]}
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
      ]}
      width={1200}
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
