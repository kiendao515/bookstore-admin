import React, { useState } from 'react'
import Webcam from 'react-webcam';
import ToastHelper from 'general/helpers/ToastHelper';
import axios from 'axios';
import { Button, Modal, Spin } from 'antd';
const videoConstraints = {
    facingMode: "user"
};

function base64ToFile(base64String, fileName) {
    // Decode the base64 string to binary data
    const byteString = atob(base64String.split(",")[1]);

    // Convert binary data to a Uint8Array
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // Create a blob with the Uint8Array and define the file type
    const blob = new Blob([ab], { type: "image/png" });

    // Create a File object from the blob
    return new File([blob], fileName, { type: "image/png" });
}

function WebcamComponent({ setShowCamera, setIsbn, setShowEditModel }) {
    const webcamRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const capture = React.useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                console.error("No image captured!");
                return;
            }

            try {
                setLoading(true);
                // Prepare the Base64 string
                const base64Image = imageSrc;
                const file = base64ToFile(base64Image, "image.png");
                const formData = new FormData();
                formData.append("image", file);

                // Send API request
                const response = await axios.post("https://hopsach.sytes.net/py/v1/ocr/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Important for multipart request
                    }
                });

                if (response.data.success) {
                    const isbn = response.data.data.isbn;
                    if (isbn == "") {
                        ToastHelper.showError('Chưa lấy được thông tin isbn');
                    } else {
                        setIsbn(isbn);
                        setShowEditModel(true);
                    }
                } else {
                    ToastHelper.showError('Chưa lấy được thông tin isbn');
                }
            } catch (error) {
                ToastHelper.showError('Chưa lấy được thông tin isbn');
            }
            setLoading(false);
            setShowCamera(false);
        },
        [webcamRef]
    );
    return (
        <Modal
      title="Chụp ảnh ISBN"
      visible={true}
      onCancel={() => setShowCamera(false)}
      footer={null}
      centered
      width={800}
    >
      <Spin spinning={loading}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={videoConstraints}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <Button type="primary" onClick={capture} disabled={loading}>
            Chụp ảnh
          </Button>
        </div>
      </Spin>
    </Modal>
    )
}

export default WebcamComponent