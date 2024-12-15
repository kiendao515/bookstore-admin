import { unwrapResult } from '@reduxjs/toolkit';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import KeenSearchBarNoFormik from 'general/components/OtherKeenComponents/KeenSearchBarNoFormik';
import Pagination from 'general/components/Pagination';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import OrderHelper from 'general/helpers/OrderHelper';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ModalOrderEdit from '../../components/ModalEditOrder';
import { setPaginationPerPage, thunkGetListBook } from '../../bookSlice';
import categoryApi from 'api/categoryApi';
import bookApi from 'api/bookApi';
import ModalEditBookInventory from '../../components/ModelEditBookInventory';
import WebcamComponent from '../../components/WebcamComponent';
import collectionApi from 'api/collectionApi';
import DateRangePickerInput from 'general/components/Form/DateRangePicker';

BookHomeScreen.propTypes = {};

const sTag = '[BookHomeScreen]';

function BookHomeScreen(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookStores, setBookStores] = useState([]);
  const [collection, setCollection] = useState([]);
  const [filters, setFilters] = useState(Global.gFilterBookList);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [toggledClearOrders, setToggledClearOrders] = useState(true);
  const { book, isGettingBookList, pagination } = useSelector((state) => state.book);
  const [showCamera, setShowCamera] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const needToRefreshData = useRef(book?.length === 0);
  const refLoading = useRef(false);
  const columns = useMemo(() => {
    return [
      {
        name: t('BookName'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.name}
            </div>
          );
        },
      },
      {
        name: t('AuthorName'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.author_name}
            </div>
          );
        },
      },
      {
        name: t('Category'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.category?.name}
            </div>
          );
        },
      },
      // {
      //   name: t('Store'),
      //   sortable: false,
      //   cell: (row) => {
      //     return (
      //       <div
      //         data-tag="allowRowEvents"
      //         className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
      //       >
      //         {
      //           categories?.find((item) => item?.postOfficeId === row?.postOfficeId)
      //             ?.postOfficeName
      //         }
      //       </div>
      //     );
      //   },
      // },
      {
        name: t('NumberOfBook'),
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.number_of_books}
            </div>
          );
        },
      },
      // {
      //   name: t('Status'),
      //   sortable: false,
      //   cell: (row) => {
      //     return (
      //       <span className={`badge bg-${OrderHelper.getOrderStatusColor(row?.status)}`}>
      //         {OrderHelper.getOrderStatusText(row?.status)}
      //       </span>
      //     );
      //   },
      // },
      {
        name: t('Thời gian tạo'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
            {Utils.formatDateTime(row?.created_at,'DD/MM/YYYY HH:mm',false)}
            </div>
          );
        },
      },
      {
        name: '',
        center: 'true',
        width: '100px',
        cell: (row) => (
          <div className="d-flex align-items-center">
            <KTTooltip text={t('Edit')}>
              <a
                className="btn btn-icon btn-sm btn-primary btn-hover-primary mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditOrder(row);
                }}
              >
                <i className="far fa-pen p-0 icon-1x" />
              </a>
            </KTTooltip>
            {/* )} */}
            <KTTooltip text={t('Delete')}>
              <a
                className="btn btn-icon btn-sm btn-danger btn-hover-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteOrder(row);
                }}
              >
                <i className="far fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>
          </div>
        ),
      },
    ];
  }, [categories, books,filters]);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [modalOrderEditShowing, setModalOrderEditShowing] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [modalInventoryEditShowing, setModalInventoryEditShowing] = useState(false);

  // MARK: --- Functions ---
  // Get order list
  async function getOrderList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListBook(filters)));
      console.log(res);
    } catch (error) {
      console.log(`${sTag} get order list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedOrdersChanged(state) {
    const selectedOrders = state.selectedRows;
    setSelectedOrders(selectedOrders);
  }

  function clearSelectedOrders() {
    setSelectedOrders([]);
    setToggledClearOrders(!toggledClearOrders);
  }

  function handleEditOrder(order) {
    setSelectedOrderItem(order);
    setModalOrderEditShowing(true);
  }

  function handleDeleteMultiOrders() {
    const arrIdsToDelete = selectedOrders.map((item) => item.orderId);
    console.log(`${sTag} handle delete multi orders: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiOrder', {
        orders: JSON.stringify(arrIdsToDelete.length),
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
        const orderIds = arrIdsToDelete;
        try {
          const res = await bookApi.deleteOrder(orderIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedOrders();
            Global.gNeedToRefreshBookList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersOrderList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedOrdersChanged(state) {
    const selectedOrders = state.selectedRows;
    setSelectedOrders(selectedOrders);
  }

  function handleDeleteOrder(order) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteOrder', { orderCode: order?.orderCode }),
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
          const res = await bookApi.deleteOrder([order.orderId]);
          const { result } = res;
          if (result == 'success') {
            Global.gNeedToRefreshOrderList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersOrderList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`Delete order error: ${error?.message}`);
        }
      }
    });
  }

  async function getListCategories() {
    const res = await categoryApi.getListCategory();
    const { success, data } = res;
    if (success === true) {
      setCategories(data);
    }
  }

  async function getListBookStores() {
    const res = await bookApi.getStores();
    const { success, data } = res;
    if (success === true) {
      setBookStores(data);
    }
  }

  async function getListCollection() {
    const res = await collectionApi.getListCollection();
    const { success, data } = res;
    if (success === true) {
      setCollection(data);
    }
  }

  // MARK: ---- Hooks ----
  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshBookList)) {
      getOrderList();
      Global.gNeedToRefreshBookList = false;
    }
  }, [filters, Global.gNeedToRefreshBookList]);

  useEffect(() => {
    getListCategories();
    getListBookStores();
    getListCollection();
  }, []);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('ListBook')}</h1>
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${selectedOrders.length === 0 ? 'd-none' : 'd-flex'
                  } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiOrders();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedOrders.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalOrderEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('NewBook')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFilterBookList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFilterBookList = {
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
            <div className="mt-4 mr-4 d-flex flex-wrap align-items-center">
                <DateRangePickerInput
                  className=""
                  initialLabel="7 ngày gần đây"
                  initialEndDate={moment()}
                  initialStartDate={moment().subtract(6, 'days')}
                  getDateRange={(dateRange) => {
                    console.log(dateRange);
                    
                    switch (dateRange.label) {
                      case 'Tất cả':
                        needToRefreshData.current = true;
                        Global.gFilterBookList = {
                          ...filters
                        };
                        setFilters({
                          ...filters
                        });
                        break;
                      default:
                        console.log("run here");
                        
                        needToRefreshData.current = true;
                        Global.gFilterBookList = {
                          ...filters,
                          start_at :dateRange.startDate.toISOString(),
                          end_at : dateRange.endDate.toISOString()
                        };
                        setFilters({
                          ...filters,
                          start_at: dateRange.startDate.toISOString(),
                          end_at: dateRange.endDate.toISOString()
                        });
                    }
                  }}
                  customRange={{
                    // 'Hôm qua': [
                    //   moment().subtract(1, 'day').startOf('day'),
                    //   moment().subtract(1, 'day').endOf('day'),
                    // ],
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
              {/* <label className="mr-2 mb-0" htmlFor="store">
                {_.capitalize(t('Store'))}
              </label>
              <KTFormSelect
                name="store"
                isCustom
                options={[
                  { name: 'All', value: '' },
                  ...bookStores.map((item) => {
                    console.log(item);

                    return { name: item?.name, value: item?.id.toString() };
                  }),
                ]}
                // value={Global.gFiltersOrderList.postOfficeId}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFiltersOrderList = {
                    ...filters,
                    page: 0,
                    postOfficeId: newValue,
                  };
                  setFilters({
                    ...Global.gFiltersOrderList,
                  });
                }}
              /> */}
            </div>
            <div className="mt-4 mr-4 d-flex flex-wrap align-items-center">
              <label className="mr-2 mb-0" htmlFor="category">
                {_.capitalize(t('Category'))}
              </label>
              <KTFormSelect
                name="category"
                isCustom
                options={[
                  { name: 'All', value: '' },
                  ...categories.map((item) => {
                    return { name: item.name, value: item.id.toString() };
                  }),
                ]}
                value={Global.gFilterBookList.category_id}
                onChange={(newValue) => {
                  needToRefreshData.current = true;
                  Global.gFilterBookList = {
                    ...filters,
                    page: 0,
                    category_id: newValue,
                  };
                  setFilters({
                    ...Global.gFilterBookList,
                  });
                }}
              />
            </div>
            <div className="mt-4 mr-4 d-flex flex-wrap align-items-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCamera(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('Chụp ảnh sách')}
              </a>
            </div>
            <div className="col-12">
              {showCamera &&
                <WebcamComponent
                  setShowCamera={setShowCamera}
                  setImageUrl={setImageUrl} />
              }
            </div>
          </div>
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <DataTable
            columns={columns}
            data={book}
            customStyles={customDataTableStyle}
            responsive={true}
            noHeader
            selectableRows={true}
            striped
            noDataComponent={
              <div className="pt-12">
                <Empty
                  text={t('NoData')}
                  visible={false}
                  imageEmpty={AppResource.images.imgEmpty}
                  imageEmptyPercentWidth={80}
                />
              </div>
            }
            progressPending={isGettingBookList}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedOrdersChanged}
            clearSelectedRows={toggledClearOrders}
            onRowClicked={(row) => {
              handleEditOrder(row);
            }}
            pointerOnHover
            highlightOnHover
            selectableRowsHighlight
          />

          {/* Pagination */}
          {pagination && book?.length > 0 && (
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
                  Global.gFiltersOrderList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersOrderList = {
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

      <ModalOrderEdit
        show={modalOrderEditShowing}
        onClose={() => {
          setModalOrderEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedOrderItem(null);
        }}
        orderItem={selectedOrderItem}
        onRefreshOrderList={() => {
          setSelectedOrderItem(null);
          getOrderList();
        }}
        onSelectInventory={(inventory) => {
          setSelectedInventoryItem(inventory);
          setModalInventoryEditShowing(true);
          setModalOrderEditShowing(false);
        }}
        bookStores={bookStores}
        categories={categories}
        collection = {collection}
      />
      <ModalEditBookInventory
        show={modalInventoryEditShowing}
        onClose={() => {
          setModalInventoryEditShowing(false);
          setModalOrderEditShowing(true);
        }}
        onExistDone={() => {
          setSelectedInventoryItem(null);
        }}
        bookInventoryItem={selectedInventoryItem}
        onRefreshOrderList={() => {
          setSelectedInventoryItem(null);
          // getListBookInventory();
        }}
      />
    </div>
  );
}

export default BookHomeScreen;
