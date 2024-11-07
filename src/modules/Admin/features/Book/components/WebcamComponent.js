import React, { useState } from 'react'
import Webcam from 'react-webcam';
import { Dispatch, SetStateAction } from 'react';
import { createWorker } from 'tesseract.js';
import ToastHelper from 'general/helpers/ToastHelper';
const videoConstraints = {
    facingMode: "user"
};

function WebcamComponent({ setShowCamera, setImageUrl }) {
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImageUrl(imageSrc)
            console.log(imageSrc);
            const worker = await createWorker('eng');
            const { data: { text } } = await worker.recognize(imageSrc);
            console.log(text);
            const isbnRegex = /\bISBN(?:-13)?:?\s?(\d{1,5}-?\d{1,7}-?\d{1,7}-?\d{1,7}-?\d{1})\b|\bISBN(?:-10)?:?\s?(\d{9}[0-9Xx])\b/;
            const match = text.match(isbnRegex);
            if (match) {
                return match[1] || match[2];
            }else{
                ToastHelper.showError('Chưa lấy được thông tin isbn');
            }
            setShowCamera(false)
        },
        [webcamRef]
    );
    return (
        <div style={{
            marginTop: "10px"
        }}>
            <div style={{
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