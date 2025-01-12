import React, { useRef, useState } from "react";
import { Modal, Button, Input, Row, Col } from "antd";
import { Barcode } from "@progress/kendo-react-barcodes";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";

const PrintBarcodeDialog = (props) => {
  const { toggle, setToggle, barcode } = props;
  const [quantity, setQuantity] = useState(1);
  const contentRef = useRef(null);
console.log("open print dialog");

  const reactToPrintFn = useReactToPrint({
    pageStyle: `
      @media print {
        @page {
          size: 11cm 2.2cm; 
          margin: 0cm;
        }
        body {
          width: 11cm;
          height: 2.2cm;
        }
      }
    `,
    content: () => contentRef.current,
  });

  const cmToPx = (cm) => cm * 37.795;

  return (
    <Modal
      title="Vui lòng chọn số lượng in"
      visible={toggle}
      onCancel={() => setToggle(false)}
      footer={null}
      centered
      width="600px"
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Barcode
          value={barcode}
          width={cmToPx(5)}
          height={cmToPx(2.2)}
          type="Code128"
        />
      </div>
      <Input
        type="number"
        placeholder="Số lượng"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ marginBottom: "20px" }}
      />
      <div style={{ display: "none" }} ref={contentRef}>
        <Row gutter={[16, 16]}>
          {Array.from({ length: quantity }).map((_, index) => (
            <Col span={8} key={index} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: cmToPx(3.8),
                  height: cmToPx(2.2),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "0.2cm",
                }}
              >
                <Barcode
                  value={barcode}
                  width={cmToPx(3.7)}
                  height={cmToPx(1.9)}
                  type="Code128"
                  padding={0}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={()=>{
            console.log("contentRef:", contentRef.current);
            reactToPrintFn();
          }}
          style={{ marginRight: "10px" }}
        >
          IN
        </Button>
        <Button onClick={() => setToggle(false)}>HỦY</Button>
      </div>
    </Modal>
  );
};

export default PrintBarcodeDialog;
