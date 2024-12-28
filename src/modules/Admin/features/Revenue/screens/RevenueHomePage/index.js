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
import collectionApi from 'api/collectionApi';
import ModalEditRevenue from '../../Components/ModalEditRevenue';
import { thunkGetListRevenue } from '../../revenueSlice';
import DateRangePickerInput from 'general/components/Form/DateRangePicker';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import bookApi from 'api/bookApi';
import { Button } from 'antd';
import * as XLSX from 'xlsx';
import revenueApi from 'api/revenueApi';
RevenueHomePage.propTypes = {};

const sTag = '[RevenueHomePage]';

function RevenueHomePage(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Global.gFiltersRevenueList);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [toggledClearEmployees, setToggledClearEmployees] = useState(true);
  const { revenue, isGettingRevenue, pagination } = useSelector((state) => state.revenue);
  const [bookStores, setBookStores] = useState([]);
  const [storeId, setStoreId] = useState(null)
  const [storeName, setStoreName] = useState(null)
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const needToRefreshData = useRef(revenue?.length === 0);
  const refLoading = useRef(false);
  const currentAccount = useSelector((state) => state.auth.user);
  const columns = useMemo(() => {
    return [
      {
        name: t('Tên'),
        sortable: false,
        // minWidth: '100px',
        center: 'true',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.book.name}
            </div>
          )
        },
      },
      {
        name: t('Tồn kho'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.inventory}
            </div>
          );
        },
      },
      {
        name: t('Đã bán'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.sold}
            </div>
          );
        },
      },
      {
        name: t('Chưa chốt'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.not_settle}
            </div>
          );
        },
      },
      {
        name: t('Đã chốt'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.settle}
            </div>
          );
        },
      },
      {
        name: t('Tiền chưa chốt'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.not_settle_amount}
            </div>
          );
        },
      },
      {
        name: t('Tiền đã chốt'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.settle_amount}
            </div>
          );
        },
      },
    ];
  }, []);
  const [selectedCollectionItem, setSelectedCollectionItem] = useState(null);
  const [modalEmployeeEditShowing, setModalEmployeeEditShowing] = useState(false);
  const [modalEmployeeResetPasswordShowing, setModalEmployeeResetPasswordShowing] = useState(false);

  // MARK: --- Functions ---
  // Get employee list
  async function getEmployeeList() {
    refLoading.current = true;
    try {
      console.log(filters);

      const res = unwrapResult(await dispatch(thunkGetListRevenue(filters)));
    } catch (error) {
      console.log(`${sTag} get employee list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedEmployeesChanged(state) {
    const selectedEmployees = state.selectedRows;
    setSelectedEmployees(selectedEmployees);
  }

  function clearSelectedEmployees() {
    setSelectedEmployees([]);
    setToggledClearEmployees(!toggledClearEmployees);
  }

  function handleEditCollection(employee) {
    setSelectedCollectionItem(employee);
    setModalEmployeeEditShowing(true);
  }
  async function getListBookStores() {
    const res = await bookApi.getStores();
    const { success, data } = res;
    if (success === true) {
      setBookStores(currentAccount.role == "STORE" ? data.filter((d) => d.account_id === currentAccount.id) : data);
    }
  }

  function handleDeleteMultiEmployees() {
    const arrIdsToDelete = selectedEmployees.map((item) => item.accountId);
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
            Global.gNeedToRefreshEmployeeList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersCollectionList = { ...filters };
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
    setSelectedEmployees(selectedEmployees);
  }

  function handleResetPasswordEmployee(employee) {
    setSelectedCollectionItem(employee);
    setModalEmployeeResetPasswordShowing(true);
  }
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshRevenueList)) {
      console.log("okeoke");

      Global.gNeedToRefreshRevenueList = false;
      getEmployeeList()
    }
  }, [filters, Global.gNeedToRefreshRevenueList]);

  useEffect(() => {
    getListBookStores();
  }, []);

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
  const handleExportToExcel = (storeName, from, to) => {
    if (revenue.length === 0) {
      ToastHelper.showError(t('Không có dữ liệu để xuất.'));
      return;
    }

    // Format khoảng thời gian
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const formattedFrom = formatDate(from);
    const formattedTo = formatDate(to);


    const sanitizedStoreName = storeName?.replace(/[\\/:"*?<>|]/g, '_'); // Loại bỏ ký tự không hợp lệ
    const fileName = `${sanitizedStoreName}_${formattedFrom}_to_${formattedTo}.xlsx`;

    const formattedData = revenue.map((row) => ({
      Tên: row?.book?.name || '',
      Tồn_kho: row?.inventory || 0,
      Đã_bán: row?.sold || 0,
      Chưa_chốt: row?.not_settle || 0,
      Đã_chốt: row?.settle || 0,
      Tiền_chưa_chốt: row?.not_settle_amount || 0,
      Tiền_đã_chốt: row?.settle_amount || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Revenue Report');

    // Xuất file Excel với tên file đã format
    XLSX.writeFile(workbook, fileName);
  };

  const handleSettleRevenue = async () => {
    try {
      const totalRevenue = revenue.reduce((sum, row) => sum + row?.not_settle_amount || 0, 0); // Tổng doanh thu
      const commissionPercentage = revenue[0]?.commission_percentage || 0; // Phần trăm hoa hồng
      const commissionAmount = (totalRevenue * commissionPercentage) / 100; // Tiền hoa hồng
      const totalAmountForSeller = totalRevenue - commissionAmount; // Tổng tiền gửi nhà bán

      Swal.fire({
        title: t('Bạn có chắc muốn chốt doanh thu không?'),
        html: `
          <p>${t('Tổng doanh thu')}: <strong>${totalRevenue.toLocaleString()} VNĐ</strong></p>
          <p>${t('Hoa hồng')}: <strong>${commissionPercentage}%</strong></p>
          <p>${t('Tổng tiền gửi nhà bán')}: <strong>${totalAmountForSeller.toLocaleString()} VNĐ</strong></p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: t('Đồng ý'),
        cancelButtonText: t('Hủy'),
        customClass: {
          confirmButton: 'btn btn-primary font-weight-bolder',
          cancelButton: 'btn btn-light font-weight-bolder',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const booksToSettle = revenue.filter(item => item.not_settle !== 0);
          const bookIds = booksToSettle.map(item => item.book.id);
          const res = await revenueApi.confirmStoreRevenue(storeId, bookIds); // Thay bằng API thực tế
          if (res.result) {
            ToastHelper.showSuccess(t('Chốt doanh thu thành công.'));
            getEmployeeList(); // Tải lại dữ liệu
          } else {
            ToastHelper.showError(t('Chốt doanh thu thất bại.'));
          }
        }
      });
    } catch (error) {
      console.error('Settle revenue error:', error);
      ToastHelper.showError(t('Có lỗi xảy ra khi chốt doanh thu.'));
    }
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.sold > 0 && row.not_settle > 0,
      style: {
        backgroundColor: '#fff3cd', // Màu vàng cho sách đã bán nhưng chưa chốt
      },
    },
    {
      when: (row) => row.settle > 0,
      style: {
        backgroundColor: '#d4edda', // Màu xanh cho sách đã chốt
      },
    },
    {
      when: (row) => row.sold === 0 && row.not_settle === 0 && row.settle === 0,
      style: {
        backgroundColor: 'inherit', // Màu bình thường cho sách chưa bán, chưa chốt
      },
    },
  ];
  // MARK: --- Hooks ---
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshRevenueList)) {
      getEmployeeList();
      Global.gNeedToRefreshRevenueList = false;
    }
  }, [filters]);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('Báo cáo tồn kho nhà ký gửi')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${selectedEmployees.length === 0 ? 'd-none' : 'd-flex'
                  } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiEmployees();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedEmployees.length})`}
              </a>
              <Button
                className="btn btn-success font-weight-bold mr-2"
                onClick={() => handleExportToExcel(storeName, from, to)}
              >
                {t('Xuất file Excel')}
              </Button>
              <Button
                className="btn btn-primary font-weight-bold"
                onClick={handleSettleRevenue}
              >
                {t('Chốt doanh thu')}
              </Button>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <DateRangePickerInput
              initialLabel="7 ngày gần đây"
              initialEndDate={moment()}
              initialStartDate={moment().subtract(6, 'days')}
              getDateRange={(dateRange) => {
                console.log(dateRange);

                switch (dateRange.label) {
                  case 'Tất cả':
                    needToRefreshData.current = true;
                    Global.gFiltersRevenueList = {
                      ...filters
                    };
                    setFilters({
                      ...filters
                    });
                    break;
                  default:
                    console.log("run here");

                    needToRefreshData.current = true;
                    setFrom(dateRange.startDate.toISOString())
                    setTo(dateRange.endDate.toISOString())
                    Global.gFiltersRevenueList = {
                      ...filters,
                      from: dateRange.startDate.toISOString(),
                      to: dateRange.endDate.toISOString()
                    };
                    setFilters({
                      ...filters,
                      from: dateRange.startDate.toISOString(),
                      to: dateRange.endDate.toISOString()
                    });
                }
              }}
              customRange={{
                'Tuần này': [moment().startOf('week'), moment()],
                '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                'Tháng trước': [
                  moment().subtract(1, 'month').startOf('month'),
                  moment().subtract(1, 'month').endOf('month'),
                ],
                'Tháng này': [moment().startOf('month'), moment()],
              }}
            />
            <KTFormSelect
              name="store"
              isCustom
              options={[
                { name: 'All', value: '' },
                ...bookStores.map((item) => {
                  return { name: item.name, value: item.id.toString() };
                }),
              ]}
              value={Global.gFiltersRevenueList.store_id}
              onChange={(newValue) => {
                const selectedOption = [
                  { name: 'All', value: '' },
                  ...bookStores.map((item) => ({
                    name: item.name,
                    value: item.id.toString(),
                  })),
                ].find((option) => option.value === newValue);

                const selectedStoreName = selectedOption ? selectedOption.name : '';
                setStoreName(selectedStoreName); // Lưu storeName
                console.log(newValue);
                setStoreId(newValue)
                needToRefreshData.current = true;
                Global.gFiltersRevenueList = {
                  ...filters,
                  store_id: newValue,
                };
                setFilters({
                  ...Global.gFiltersRevenueList,
                });
              }}
            />
          </div>
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <DataTable
            // fixedHeader
            // fixedHeaderScrollHeight="60vh"
            columns={columns}
            data={revenue}
            customStyles={customDataTableStyle}
            conditionalRowStyles={conditionalRowStyles} // Áp dụng điều kiện tô màu
            responsive={true}
            noHeader
            selectableRows={true}
            striped
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
            progressPending={isGettingRevenue}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedEmployeesChanged}
            clearSelectedRows={toggledClearEmployees}
            onRowClicked={(row) => {
              handleEditCollection(row);
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
                  Global.gFiltersRevenueList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersRevenueList = {
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

      <ModalEditRevenue
        show={modalEmployeeEditShowing}
        onClose={() => {
          setModalEmployeeEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedCollectionItem(null);
        }}
        collectionItem={selectedCollectionItem}
        storeId={storeId}
        onRefreshCollectionList={() => {
          setSelectedCollectionItem(null);
          getEmployeeList();
        }}
      />
    </div>
  );
}

export default RevenueHomePage;
