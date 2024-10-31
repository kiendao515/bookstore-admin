import AppData from 'general/constants/AppData';

const OrderHelper = {
  getOrderStatusText: (status) => {
    switch (status) {
      case AppData.ORDER_STATUS.SCANNED:
        return AppData.orderStatus.find((item) => item.value == AppData.ORDER_STATUS.SCANNED).name;
      case AppData.ORDER_STATUS.HANDED_OVER:
        return AppData.orderStatus.find((item) => item.value == AppData.ORDER_STATUS.HANDED_OVER)
          .name;
      case AppData.ORDER_STATUS.READY_TO_SHIP:
        return AppData.orderStatus.find((item) => item.value == AppData.ORDER_STATUS.READY_TO_SHIP)
          .name;
      case AppData.ORDER_STATUS.RETURNED:
        return AppData.orderStatus.find((item) => item.value == AppData.ORDER_STATUS.RETURNED).name;
      case AppData.ORDER_STATUS.CANCELED:
        return AppData.orderStatus.find((item) => item.value == AppData.ORDER_STATUS.CANCELED).name;

      default:
        return '';
    }
  },
  getOrderStatusColor: (status) => {
    switch (status) {
      case AppData.ORDER_STATUS.SCANNED:
        return 'info text-dark';
      case AppData.ORDER_STATUS.HANDED_OVER:
        return 'secondary';
      case AppData.ORDER_STATUS.READY_TO_SHIP:
        return 'success';
      case AppData.ORDER_STATUS.RETURNED:
        return 'warning text-dark';
      case AppData.ORDER_STATUS.CANCELED:
        return 'danger';

      default:
        return '';
    }
  },
};

export default OrderHelper;
