import { unwrapResult } from '@reduxjs/toolkit';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import KeenSearchBarNoFormik from 'general/components/OtherKeenComponents/KeenSearchBarNoFormik';
import Pagination from 'general/components/Pagination';
import AppResource from 'general/constants/AppResource';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { setPaginationPerPage, thunkGetListCollection, thunkGetListOrder } from '../../orderSlice';
import collectionApi from 'api/collectionApi';
import { Radio, Tabs } from 'antd';
import ModalOrderDetails from '../../Components/ModalOrderDetails';
import ModalCreateOrder from '../../Components/ModelCreateOrder';
import ModalMultiOrder from '../../Components/ModalMultiOrder';
const { TabPane } = Tabs;
OrderHomePage.propTypes = {};

const sTag = '[OrderHomePage]';

function OrderHomePage(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Global.gFilterOrderList);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [toggledClearEmployees, setToggledClearEmployees] = useState(true);
  const { order, isGettingOrder, pagination } = useSelector((state) => state.order);
  const [activeTab, setActiveTab] = useState('ALL');

  const statuses = [
    { key: 'ALL', label: t('Tất cả'), value: '' },
    { key: 'CREATED', label: t('Chờ xác nhận'), value: 'CREATED' },
    { key: 'READY_TO_PACKAGE', label: t('Chờ gói hàng'), value: 'READY_TO_PACKAGE' },
    { key: 'READY_TO_SHIP', label: t('Sẵn sàng gửi'), value: 'READY_TO_SHIP' },
    { key: 'SHIPPING', label: t('Đang gửi'), value: 'SHIPPING' },
    { key: 'COMPLETED', label: t('Thành công'), value: 'DONE' },
    { key: 'CANCELED', label: t('Hủy'), value: 'CANCELED' },
  ];
  const handleTabChange = (key) => {
    setActiveTab(key);
    const status = statuses.find((s) => s.key === key)?.value || '';
    setFilters({ ...filters, status })
  };
  const needToRefreshData = useRef(order?.length === 0);
  const refLoading = useRef(false);
  const [value, setValue] = useState(1);

  const onChange = (e) => {
    setValue(e.target.value);
    setFilters({ ...filters, type: e.target.value });
  };
  const columns = useMemo(() => {
    return [
      {
        name: t('Mã đơn hàng'),
        sortable: false,
        center: 'true',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold d-flex align-items-center"
            >
              {row?.order_code}
            </div>
          )
        },
      },
      {
        name: t('Tên người nhận'),
        sortable: false,
        center: 'true',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold d-flex align-items-center"
            >
              {row?.customer_name}
            </div>
          )
        },
      },
      {
        name: t('Số điện thoại'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.customer_phone}
            </div>
          );
        },
      },
      {
        name: t('Địa chỉ'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.address}

            </div>
          );
        },
      },
      {
        name: t('Tổng tiền'),
        sortable: true,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.total_amount}
            </div>
          );
        },
      },
      {
        name: t('Phí giao hàng'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.shipping_fee}
            </div>
          );
        },
      },
      {
        name: t('Phương thức thanh toán'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.payment_type == true ? "Chuyển khoản" : "COD"}
            </div>
          );
        },
      },
      {
        name: t('Trạng thái'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {Utils.handleOrderStatus(row?.status)}
            </div>
          );
        },
      },
      {
        name: t('Tài khoản'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.account.email}
            </div>
          );
        },
      },
      {
        name: '',
        center: 'true',
        width: '200px',
        cell: (row) => (
          <div className="d-flex align-items-center">
            <KTTooltip text={t('Xem')}>
              <a
                className="btn btn-icon btn-sm btn-primary mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  // handleEditCollection(row);
                  handleShowOrderDetails(row)
                }}
              >
                <i class="fa-regular fa-eye icon-1x"></i>
              </a>
            </KTTooltip>

            <KTTooltip text={t('Delete')}>
              <a
                className="btn btn-icon btn-sm btn-danger btn-hover-danger mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(row);

                  handleDeleteCollection(row);
                }}
              >
                <i className="fa-solid fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>
          </div>
        ),
      },
    ];
  }, []);
  const [selectedOrderItem, setSelectedOrderItem] = useState([]);
  const [modalOrderEditShowing, setModalOrderEditShowing] = useState(false);
  const [modalMultiOrder, setModalMultiOrder] = useState(false)
  const [modalEmployeeResetPasswordShowing, setModalEmployeeResetPasswordShowing] = useState(false);
  const [modalOrderDetailsVisible, setModalOrderDetailsVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const handleShowOrderDetails = (order) => {
    setSelectedOrderDetails(order);
    setModalOrderDetailsVisible(true);
  };

  // MARK: --- Functions ---
  // Get employee list
  async function getEmployeeList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListOrder(filters)));
    } catch (error) {
      console.log(`${sTag} get employee list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedEmployeesChanged(state) {
    const selectedEmployees = state.selectedRows;
    setSelectedOrder(selectedEmployees);
  }

  function clearSelectedEmployees() {
    setSelectedOrder([]);
    setToggledClearEmployees(!toggledClearEmployees);
  }

  function handleEditCollection(employee) {
    setSelectedOrderItem(employee);
    setModalOrderEditShowing(true);
  }

  function handleDeleteMultiEmployees() {
    const arrIdsToDelete = selectedOrder.map((item) => item.id);
    console.log(`${sTag} handle delete multi employees: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiEmployee', {
        employees: JSON.stringify(arrIdsToDelete.length),
      }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('Yes'),
      cancelButtonText: t('Cancel'),
      customClass: {
        confirmButton: 'btn btn-danger font-weight-bolder',
        cancelButton: 'btn btn-light font-weight-bolder',
      },
    }).then(async function (result) {
      if (result.value) {
        const employeeIds = arrIdsToDelete;
        try {
          const res = await collectionApi.deleteEmployee(employeeIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedEmployees();
            Global.gNeedToRefreshOrderList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFilterOrderList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedEmployeesChanged(state) {
    const selectedEmployees = state.selectedRows;
    setSelectedOrderItem(selectedEmployees);
  }


  function handleDeleteCollection(employee) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteEmployee', { name: employee?.name }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('Yes'),
      cancelButtonText: t('Cancel'),
      customClass: {
        confirmButton: 'btn btn-danger font-weight-bolder',
        cancelButton: 'btn btn-light font-weight-bolder',
      },
    }).then(async function (result) {
      if (result.value) {
        try {
          const res = await collectionApi.deleteCollection(employee);
          const { result } = res;
          if (result == true) {
            Global.gNeedToRefreshCollectionList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersCollectionList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`Delete employee error: ${error?.message}`);
        }
      }
    });
  }
  const conditionalRowStyles = [
    {
      when: row => !row.related_order_id,
      style: {
        // backgroundColor: "#E3F2FD",
        userSelect: "none",
        color: "#0D47A1"
      },
    },
    {
      when: row => row.related_order_id === row.order_code,
      style: {
        backgroundColor: "#C8E6C9",
        color: "white",
        userSelect: "none",
      },
    },
    {
      when: row => row.related_order_id && row.related_order_id !== row.order_code,
      style: {
        backgroundColor: "#FFF9C4",
        color: "black",
        userSelect: "none",
      },
    },
  ];
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshOrderList)) {
      getEmployeeList();
      Global.gNeedToRefreshOrderList = false;
    }
  }, [filters]);
  const prepareGroupedData = (data) => {
    return data
      .filter((order) => !order.related_order_id || order.related_order_id === order.order_code) // Exclude child orders
      .map((order) => {
        if (!order.related_order_id) {
          return { ...order, type: "single" }; // Single order
        } else if (order.related_order_id === order.order_code) {
          return { ...order, type: "root_combined" }; // Root combined order
        }
      });
  };
  
  // Expanded row component for child orders
  const ExpandedComponent = ({ data }) => {
    if (data.type === "root_combined") {
      const childOrders = order.filter(
        (o) => o.related_order_id === data.order_code && o.related_order_id !== o.order_code
      );
  
      return (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <strong>Đơn gom cùng:</strong>
          <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Mã đơn</th>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Người nhận</th>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Số điện thoại</th>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Địa chỉ</th>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Tổng tiền</th>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Phí giao hàng</th>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Phương thức</th>
                <th style={{ textAlign: "left", padding: "5px", borderBottom: "1px solid #ddd" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {childOrders.map((child) => (
                <tr key={child.order_code}>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{child.order_code}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{child.customer_name}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{child.customer_phone}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{child.address}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{child.total_amount}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{child.shipping_fee}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>
                    {child.payment_type ? "Chuyển khoản" : "COD"}
                  </td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{Utils.handleOrderStatus(child.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  
    return null; // For other types, no expansion is rendered
  };
  
  


  const groupedOrderData = useMemo(() => prepareGroupedData(order), [order]);


  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('Đơn hàng')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${selectedOrder.length === 0 ? 'd-none' : 'd-flex'
                  } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiEmployees();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedOrder.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalOrderEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="fa-solid fa-plus"></i>
                {t('Đăng đơn giao hàng')}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalMultiOrder(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="fa-solid fa-plus"></i>
                {t('Gom đơn')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFiltersCollectionList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFiltersCollectionList = {
                  ...filters,
                  q: text,
                  page: 0,
                };
                setFilters({
                  ...filters,
                  q: text,
                  page: 0,
                });
              }}
            />
          </div>
          <div d-flex flex-wrap>
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Đơn lẻ</Radio>
              <Radio value={2}>Đơn gom</Radio>
            </Radio.Group>
          </div>
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <div>
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
              {statuses.map((status) => (
                <TabPane tab={status.label} key={status.key} />
              ))}
            </Tabs>
          </div>
          <DataTable
            columns={columns}
            data={groupedOrderData}
            customStyles={customDataTableStyle}
            responsive={true}
            noHeader
            striped
            conditionalRowStyles={conditionalRowStyles}
            expandableRows
            expandableRowExpanded={(row) => row.type === "root_combined"}
            expandableRowsComponent={ExpandedComponent}
            noDataComponent={
              <div className="pt-12">
                <Empty
                  text={t('NoData')}
                  visible={false}
                  imageEmpty={AppResource.icons.icEmptyBox}
                  imageEmptyPercentWidth={170}
                />
              </div>
            }
            progressPending={isGettingOrder}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedEmployeesChanged}
            clearSelectedRows={toggledClearEmployees}
            onRowClicked={(row) => {
              handleShowOrderDetails(row)
            }}
            pointerOnHover
            highlightOnHover
            selectableRowsHighlight
          />

          {/* Pagination */}
          {pagination && (
            <div className="d-flex align-items-center justify-content-center mt-3">
              <Pagination
                rowsPerPage={pagination.perPage}
                rowCount={pagination.total}
                currentPage={pagination.currentPage}
                onChangePage={(newPage) => {
                  let iNewPage = parseInt(newPage);
                  iNewPage -= 1;
                  if (iNewPage < 0) {
                    iNewPage = 0;
                  }
                  needToRefreshData.current = true;
                  Global.gFiltersCollectionList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersCollectionList = {
                    ...filters,
                    size: iNewPerPage,
                  };
                  setFilters({
                    ...filters,
                    size: iNewPerPage,
                    page: 0,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>

      <ModalOrderDetails
        visible={modalOrderDetailsVisible}
        onClose={() => setModalOrderDetailsVisible(false)}
        orderDetails={selectedOrderDetails}
      />
      <ModalMultiOrder
        show={modalMultiOrder}
        onClose={() => {
          setModalMultiOrder(false)
        }}
        orderInfo={order}
      />
      <ModalCreateOrder
        show={modalOrderEditShowing}
        onClose={() => {
          setModalOrderEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedOrderItem(null);
        }}
        orderInfo={order}
        onRefreshCollectionList={() => {
          setSelectedOrderItem(null);
          getEmployeeList();
        }}
      />
    </div>
  );
}

export default OrderHomePage;
