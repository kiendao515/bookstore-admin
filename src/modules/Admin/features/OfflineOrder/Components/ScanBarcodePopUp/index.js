import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Typography, Input, notification } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const ScanBarcodePopUp = ({ togglePopUp, setTogglePopUp, handleScanBarcode, message, setMessage }) => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState('');
    const [prevResult, setPrevResult] = useState('');
    const [isTabFocused, setIsTabFocused] = useState(true);
    // const inputRef = useRef(null);

    const handleToggleScan = () => {
        setScanning(!scanning);
        if (!scanning) {
            setResult(''); // Reset result when starting or stopping scan
        }
    };

    const handleScan = () => {
        if (result) {
            notification.success({ message: `Barcode entered: ${result}` });
            setPrevResult(result);
            handleScanBarcode({
                barcode: result,
                quantity: 1,
            });
            setResult(''); // Clear the result after scanning
        }
    };

    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter') {
    //         handleScan(); // Trigger scan manually when Enter is pressed
    //     }
    // };

    useEffect(() => {
        handleScan();
    }, [result]);

    useEffect(() => {
        setMessage('');
    }, [togglePopUp]);

    // useEffect(() => {
    //     if (inputRef.current) {
    //         inputRef.current.focus();
    //     }
    // }, [result, togglePopUp]);

    // const handleBlur = () => {
    //     if (inputRef.current) {
    //         inputRef.current.focus();
    //     }
    // };

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabFocused(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        const handleWindowFocus = () => setIsTabFocused(true);
        const handleWindowBlur = () => setIsTabFocused(false);

        window.addEventListener('focus', handleWindowFocus);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            window.removeEventListener('focus', handleWindowFocus);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, []);

    return (
        <Modal
            visible={togglePopUp}
            title="Quét mã"
            onCancel={() => {
                setTogglePopUp(false);
                setResult('');
            }}
            footer={[
                <Button
                    key="close"
                    onClick={() => {
                        setTogglePopUp(false);
                        setResult('');
                    }}
                    type="primary"
                    danger
                >
                    Close
                </Button>,
            ]}
        >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Typography.Text strong style={{ fontSize: '16px' }}>
                    Thay đổi chế độ gõ của máy tính sang tiếng Anh
                </Typography.Text>
            </div>

            {!isTabFocused && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Typography.Text italic style={{ color: 'red' }}>
                        Vui lòng click vào trang để có thể quét mã
                    </Typography.Text>
                </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <BarcodeScannerComponent
                    width={300}
                    height={300}
                    onUpdate={(err, result) => {
                        if (result) setResult(result.text);
                    }}
                    onClick={handleToggleScan}
                />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                {prevResult ? (
                    <Typography.Text>
                        Mã barcode vừa quét: <strong>{prevResult}</strong>
                    </Typography.Text>
                ) : (
                    <Typography.Text>Vui lòng quét mã bằng scanner</Typography.Text>
                )}
            </div>

            {message && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Typography.Text italic style={{ color: 'red' }}>
                        {message}
                    </Typography.Text>
                </div>
            )}

            {/* <Input
                ref={inputRef}
                type="text"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleBlur}
                placeholder="Enter barcode manually"
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    border: 'none',
                }}
            /> */}
        </Modal>
    );
};

export default ScanBarcodePopUp;
