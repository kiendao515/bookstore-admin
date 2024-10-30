import { unwrapResult } from '@reduxjs/toolkit';
import accountApi from 'api/accountApi';
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
import ModalAccountEdit from '../../Components/ModalEditAccount';
import { setPaginationPerPage, thunkGetListAccount } from '../../accountSlice';
import ModalResetPasswordAccount from '../../Components/ModelResetPasswordAccount';

AccountHomePage.propTypes = {};

const sTag = '[AccountHomePage]';

function AccountHomePage(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    ...Global.gFiltersAccountList,
    role: "USER"
  });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [toggledClearAccounts, setToggledClearAccounts] = useState(true);
  const { account, isGettingAccountList, pagination } = useSelector((state) => state.account);
  const needToRefreshData = useRef(account?.length === 0);
  console.log(account);
  
  const refLoading = useRef(false);
  const columns = useMemo(() => {
    return [
      {
        name: t('Avatar'),
        sortable: false,
        // minWidth: '100px',
        center: 'true',
        cell: (row) => {
          return (
            <img
              src={row?.avatar ? Utils.getFullUrl(row?.avatar) : AppResource.images.imgDefaultAvatar}
              style={{
                aspectRatio: '1/1',
                objectFit: 'cover',
                height: 50,
                borderRadius: 10,
              }}
            />
          );
        },
      },
      {
        name: t('Email'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.email}
            </div>
          );
        },
      },
      {
        name: t('IsEnabled'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.enabled}
            </div>
          );
        },
      },
      {
        name: t('Fullname'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <p
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-normal m-0 text-maxline-3 mr-4"
            >
              {row?.name}
            </p>
          );
        },
      },

      {
        name: t('Address'),
        sortable: false,
        // minWidth: '80px',
        cell: (row) => {
          return (
            <p
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-normal m-0 text-maxline-3 mr-4"
            >
              {row?.address}
            </p>
          );
        },
      },
      {
        name: t('Phone'),
        sortable: false,
        // minWidth: '80px',
        cell: (row) => {
          return (
            <p
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-normal m-0 text-maxline-3 mr-4"
            >
              {row?.phone}
            </p>
          );
        },
      },
      {
        name: '',
        center: 'true',
        width: '200px',
        cell: (row) => (
          <div className="d-flex align-items-center">
            <KTTooltip text={t('Edit')}>
              <a
                className="btn btn-icon btn-sm btn-primary btn-hover-primary mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleEditAccount(row);
                }}
              >
                <i className="fa-regular fa-user-pen p-0 icon-1x" />
              </a>
            </KTTooltip>

            <KTTooltip text={t('Delete')}>
              <a
                className="btn btn-icon btn-sm btn-danger btn-hover-danger mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteAccount(row);
                }}
              >
                <i className="far fa-trash p-0 icon-1x" />
              </a>
            </KTTooltip>
            <KTTooltip text={t('ResetPassword')}>
              <a
                className="btn btn-icon btn-sm btn-warning btn-hover-warning mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleResetPasswordAccount(row);
                }}
              >
                <i className="fa-regular fa-key p-0 icon-1x" />
              </a>
            </KTTooltip>
            <KTTooltip text={t('Call')}>
              <a
                className="btn btn-icon btn-sm btn-success btn-hover-success"
                href={`tel:${row.phone}`}
              >
                <i className="far fa-phone p-0 icon-1x" />
              </a>
            </KTTooltip>
          </div>
        ),
      },
    ];
  }, []);
  const [selectedAccountItem, setSelectedAccountItem] = useState(null);
  const [modalAccountEditShowing, setModalAccountEditShowing] = useState(false);
  const [modalAccountResetPasswordShowing, setModalAccountResetPasswordShowing] = useState(false);

  // MARK: --- Functions ---
  // Get employee list
  async function getCustomerAccountList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListAccount(filters)));
    } catch (error) {
      console.log(`${sTag} get employee list error: ${error.message}`);
    }
    refLoading.current = false;
  }

  function handleSelectedAccountsChanged(state) {
    const selectedAccounts = state.selectedRows;
    setSelectedAccounts(selectedAccounts);
  }

  function clearSelectedAccounts() {
    setSelectedAccounts([]);
    setToggledClearAccounts(!toggledClearAccounts);
  }

  function handleEditAccount(employee) {
    setSelectedAccountItem(employee);
    setModalAccountEditShowing(true);
  }

  function handleDeleteMultiAccounts() {
    const arrIdsToDelete = selectedAccounts.map((item) => item.accountId);
    console.log(`${sTag} handle delete multi employees: ${arrIdsToDelete}`);

    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteMultiAccount', {
        account: JSON.stringify(arrIdsToDelete.length),
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
        const accountIds = arrIdsToDelete;
        try {
          const res = await accountApi.deleteAccount(accountIds);
          const { result } = res;
          if (result === 'success') {
            clearSelectedAccounts();
            Global.gNeedToRefreshAccountList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersAccountList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`${sTag} delete faq error: ${error.message}`);
        }
      }
    });
  }

  function handleSelectedAccountsChanged(state) {
    const selectedAccounts = state.selectedRows;
    setSelectedAccounts(selectedAccounts);
  }

  function handleResetPasswordAccount(employee) {
    setSelectedAccountItem(employee);
    setModalAccountResetPasswordShowing(true);
  }

  function handleDeleteAccount(employee) {
    Swal.fire({
      title: t('Confirm'),
      text: t('MessageConfirmDeleteAccount', { name: account?.fullname }),
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
          const res = await accountApi.deleteAccount([employee.accountId]);
          const { result } = res;
          if (result == 'success') {
            Global.gNeedToRefreshAccountList = true;
            ToastHelper.showSuccess(t('Success'));
            Global.gFiltersAccountList = { ...filters };
            setFilters({ ...filters });
          }
        } catch (error) {
          console.log(`Delete Account error: ${error?.message}`);
        }
      }
    });
  }

  // MARK: --- Hooks ---
  useEffect(() => {
    console.log("lok"); 
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshAccountList)) {
      getCustomerAccountList();
      Global.gNeedToRefreshAccountList = false;
    }
  }, [filters]);

  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('ListAccount')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>

            {/* header toolbar */}
            <div className="card-toolbar">
              <a
                href="#"
                className={`${
                  selectedAccounts.length === 0 ? 'd-none' : 'd-flex'
                } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiAccounts();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedAccounts.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalAccountEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="far fa-plus"></i>
                {t('NewAccount')}
              </a>
            </div>
          </div>

          <div className="d-flex flex-wrap">
            <KeenSearchBarNoFormik
              name="searchQuery"
              className="mt-4 mr-4"
              placeholder={`${t('Search')}...`}
              value={Global.gFiltersAccountList.q}
              onSubmit={(text) => {
                needToRefreshData.current = true;
                Global.gFiltersAccountList = {
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
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <DataTable
            // fixedHeader
            // fixedHeaderScrollHeight="60vh"
            columns={columns}
            data={account}
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
                  imageEmpty={AppResource.icons.icEmptyBox}
                  imageEmptyPercentWidth={170}
                />
              </div>
            }
            progressPending={isGettingAccountList}
            progressComponent={<Loading showBackground={false} message={`${t('Loading')}...`} />}
            onSelectedRowsChange={handleSelectedAccountsChanged}
            clearSelectedRows={toggledClearAccounts}
            onRowClicked={(row) => {
              handleEditAccount(row);
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
                  Global.gFiltersAccountList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFiltersAccountList = {
                    ...filters,
                    limit: iNewPerPage,
                  };
                  setFilters({
                    ...filters,
                    limit: iNewPerPage,
                    page: 0,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>

      <ModalAccountEdit
        show={modalAccountEditShowing}
        onClose={() => {
          setModalAccountEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedAccountItem(null);
        }}
        accountItem={selectedAccountItem}
        onRefreshEmployeeList={() => {
          setSelectedAccountItem(null);
          getEmployeeList();
        }}
      />
      <ModalResetPasswordAccount
        show={modalAccountResetPasswordShowing}
        onClose={() => {
          setModalAccountResetPasswordShowing(false);
        }}
        onExistDone={() => {
          setSelectedAccountItem(null);
        }}
        accountItem={selectedAccountItem}
        onRefreshAccountList={() => {
          setSelectedAccountItem(null);
          getCustomerAccountList();
        }}
      />
    </div>
  );
}

export default AccountHomePage;
