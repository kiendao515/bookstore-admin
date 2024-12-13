import React, { useState } from "react";
import { Button, Input, InputNumber, Form, Typography, Modal, message } from "antd";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { handleStatusBook } from "@/utils/common";

const UpdateOrderBar = ({ orders, setOrders, disableSearch = false }) => {
  const [toggleScan, setToggleScan] = useState(false);
  const [messageContent, setMessageContent] = useState("");

//   const schema = yup.object().shape({
//     barcode: yup.string().trim().required("Vui lòng nhập thông tin").max(100),
//     quantity: yup
//       .number()
//       .typeError("Vui lòng nhập số")
//       .required("Vui lòng nhập số")
//       .max(100),
//   });

//   const { handleSubmit, register, reset } = useForm({
//     resolver: yupResolver(schema),
//   });

  const onHandleSubmit = async (data) => {
    const existingOrder = orders.find((order) => order.barcode === data.barcode);
    if (existingOrder) {
      data.quantity += existingOrder.quantity;
    }

    // const bookorderdetail = await getbookofflineorderdetail({
    //   barcode: data.barcode,
    //   quantity: data.quantity,
    // });

    if (!bookOrderDetail?.success) {
      message.error(bookOrderDetail?.message);
      setMessageContent(bookOrderDetail?.message);
      return;
    }

    if (existingOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.barcode === data.barcode
            ? {
                ...order,
                quantity: data.quantity,
                totalPrice:
                  bookOrderDetail?.data?.price *
                  data.quantity *
                  (1 - order.discount / 100),
              }
            : order
        )
      );
    } else {
      setOrders((prevOrders) => [
        ...prevOrders,
        {
          barcode: bookOrderDetail?.data?.barcode,
          quantity: data.quantity,
          author: bookOrderDetail?.data?.author || "",
          name: bookOrderDetail?.data?.book_name || "",
          price: bookOrderDetail?.data?.price || 0,
          note: "",
          totalPrice: bookOrderDetail?.data?.price * data.quantity || 0,
          discount: 0,
          type: handleStatusBook(bookOrderDetail?.data?.type || "") || "",
        },
      ]);
    }
    setMessageContent("");
    reset();
  };

  return (
    <>
      <Form layout="inline">
        <Form.Item label="Barcode">
          <Input
            // {...register("barcode")}
            disabled={disableSearch}
            placeholder="Nhập barcode"
          />
        </Form.Item>
        <Form.Item label="Số lượng">
          <InputNumber
            // {...register("quantity")}
            disabled={disableSearch}
            placeholder="Nhập số lượng"
            min={1}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={disableSearch}
          >
            + Thêm
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            icon={<i className="fas fa-qrcode" />}
            onClick={() => setToggleScan(!toggleScan)}
            disabled={disableSearch}
          >
            Quét
          </Button>
        </Form.Item>
      </Form>

    </>
  );
};

export default UpdateOrderBar;
