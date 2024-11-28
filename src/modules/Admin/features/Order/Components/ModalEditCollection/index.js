import React from "react";
import PropTypes from "prop-types";
import { Modal, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

function ModalEditCollection({
  show,
  onClose,
  onRefreshCollectionList,
  collectionItem,
  onExistDone,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isEditMode = !!collectionItem;

  console.log(collectionItem);
  const handleSubmit = async (values) => {
    try {
      const updatedValues = { ...values };
      console.log("Submitted values:", updatedValues);

      if (isEditMode) {
        // Call update API here
        console.log("Updating collection:", updatedValues);
      } else {
        // Call create API here
        console.log("Creating new collection:", updatedValues);
      }

      if (onRefreshCollectionList) {
        onRefreshCollectionList();
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal
      title={isEditMode ? t("Sửa bộ sưu tập") : t("Thêm mới bộ sưu tập")}
      visible={show}
      onCancel={() => {
        form.resetFields();
        if (onClose) onClose();
        if (onExistDone) onExistDone();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            if (onClose) onClose();
          }}
        >
          {t("Đóng")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
        >
          {t("Lưu")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: collectionItem?.name || "",
          description: collectionItem?.description || "",
          image: collectionItem?.image || null,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label={t("Tên bộ sưu tập")}
          rules={[{ required: true, message: t("Tên bộ sưu tập không được để trống!") }]}
        >
          <Input placeholder={t("Nhập tên bộ sưu tập")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("Mô tả")}
          rules={[{ required: true, message: t("Mô tả không được để trống!") }]}
        >
          <TextArea rows={4} placeholder={t("Nhập mô tả")} />
        </Form.Item>

        <Form.Item
          name="image"
          label={t("Bìa bộ sưu tập")}
          rules={[{ required: true, message: t("Vui lòng tải lên bìa bộ sưu tập!") }]}
          valuePropName="file"
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent auto-upload
            onRemove={() => form.setFieldValue("image", null)}
          >
            <Button icon={<UploadOutlined />}>{t("Tải lên bìa")}</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

ModalEditCollection.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshCollectionList: PropTypes.func,
  collectionItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalEditCollection.defaultProps = {
  show: false,
  onClose: null,
  onRefreshCollectionList: null,
  collectionItem: null,
  onExistDone: null,
};

export default ModalEditCollection;
