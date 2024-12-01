import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';  // SockJS
import { Client } from '@stomp/stompjs';  // StompJS
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.scss';

function KT07Header(props) {
  const { t } = useTranslation();
  const currentLoggedInUser = useSelector((state) => state.auth?.user);

  const [newOrder, setNewOrder] = useState(null);
  const [orderId, setOrderId] = useState('');  // Đặt orderId là state để lắng nghe thay đổi

  useEffect(() => {
    if (orderId === '') return;

    // Thiết lập kết nối WebSocket
    const socket = new SockJS(process.env.REACT_APP_BASE_URL + '/socket'); // API_URL là URL của server của bạn
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Delay khi kết nối lại
    });

    // Khi kết nối thành công
    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      // Đăng ký lắng nghe sự kiện `/topic/order`
      stompClient.subscribe(`/topic/order`, (message) => {
        const order = JSON.parse(message.body);
        console.log('New Order:', order);  // In thông tin đơn hàng ra console

        // Cập nhật trạng thái để hiển thị thông báo
        setNewOrder(order);
      });
    };

    // Kích hoạt kết nối WebSocket
    stompClient.activate();

    // Dọn dẹp khi component unmount
    return () => {
      stompClient.deactivate();
    };
  }, [orderId]);  // Re-run khi orderId thay đổi

  return (
    <div className="header">
      <div className="container">
        <div className="d-flex align-items-center flex-wrap mr-1 mt-5 mt-lg-0">
          {/* Heading */}
          <div className="d-flex align-items-baseline flex-wrap mr-5">
            <h4 className="text-dark font-weight-bold my-1 mr-5">{t('Orders')}</h4>
          </div>
        </div>

        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-item">
            <div>
              <span className="text-muted font-weight-bold mr-1">{`${t('Hello')}, `}</span>
              <span className="text-dark-75 font-weight-bold mr-3">
                {currentLoggedInUser?.displayName}
              </span>
              <div className="btn btn-icon btn-bg-white btn-hover-primary btn-icon-primary btn-circle overflow-hidden">
                <img
                  alt="avatar"
                  className="h-100 w-100 align-self-end"
                  style={{
                    objectFit: 'cover',
                  }}
                  src={currentLoggedInUser?.avatarUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị thông báo đơn mới nếu có */}
      {newOrder && (
        <div className="new-order-notification">
          <span>{t('You have a new order!')}</span>
          <Link to={`/orders/${newOrder.id}`} className="btn btn-primary">
            {t('View Order')}
          </Link>
        </div>
      )}
    </div>
  );
}

export default KT07Header;
