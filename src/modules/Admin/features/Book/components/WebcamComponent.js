import React, { useState } from 'react'
import Webcam from 'react-webcam';
import ToastHelper from 'general/helpers/ToastHelper';
import axios from 'axios';
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

    const capture = React.useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                console.error("No image captured!");
                return;
            }

            try {
                // Prepare the Base64 string
                const base64Image = imageSrc;
                const file = base64ToFile(base64Image, "image.png");
                const formData = new FormData();
                formData.append("image", file);

                // Send API request
                const response = await axios.post("https://hopsach.webhop.me/py/v1/ocr/", formData, {
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
            setShowCamera(false);
        },
        [webcamRef]
    );
    return (
        <div style={{
            width: "100%",
            marginTop: "20px",
            display: 'flex',
            justifyContent: 'center',
        }}>
            <div style={{
                width: "700px",
                height: "500px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
            }}>
                <Webcam
                    audio={false}
                    height="80%"
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={videoConstraints}
                />
                <a
                    href="#"
                    onClick={capture}
                    className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
                >
                    Chụp ảnh
                </a>
            </div>
        </div>
    )
}

export default WebcamComponent