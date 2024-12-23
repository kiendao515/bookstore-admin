import { unwrapResult } from '@reduxjs/toolkit';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import Pagination from 'general/components/Pagination';
import AppResource from 'general/constants/AppResource';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import collectionApi from 'api/collectionApi';
import { Button } from 'antd';
import { thunkGetListConfig } from '../../configSlice';
import ModalEditConfig from '../../Components/ModalEditCategory';
ConfigHomePage.propTypes = {};

const sTag = '[ConfigHomePage]';

function ConfigHomePage(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(Global.gFilterConfigList);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [toggledClearEmployees, setToggledClearEmployees] = useState(true);
  const { config, isGettingConfig, pagination } = useSelector((state) => state.config);
  const needToRefreshData = useRef(config?.length === 0);
  const refLoading = useRef(false);
  const columns = useMemo(() => {
    return [
      {
        name: t('Tiêu đề'),
        sortable: false,
        // minWidth: '100px',
        center: 'true',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.title}
            </div>
          )
        },
      },
      {
        name: t('Thuộc tính'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.property}
            </div>
          );
        },
      },
      {
        name: t('Key'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.key}
            </div>
          );
        },
      },
      {
        name: t('Value'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.value}
            </div>
          );
        },
      }
    ];
  }, []);
  const [selectedCollectionItem, setSelectedCollectionItem] = useState(null);
  const [modalEmployeeEditShowing, setModalEmployeeEditShowing] = useState(false);

  // MARK: --- Functions ---
  // Get employee list
  async function getEmployeeList() {
    refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListConfig(filters)));
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

  function handleSelectedEmployeesChanged(state) {
    const selectedEmployees = state.selectedRows;
    setSelectedEmployees(selectedEmployees);
  }

  useEffect(() => {
    if (!refLoading.current && (needToRefreshData.current || Global.gNeedToRefreshConfigList)) {
      console.log("okeoke");
      Global.gNeedToRefreshConfigList = false;
      getEmployeeList()
    }
  }, [filters, Global.gNeedToRefreshConfigList]);
  return (
    <div>
      <div className="card card-custom">
        {/* card header */}
        <div className="card-header border-0 pt-6 pb-6">
          <div className="w-100 d-flex justify-content-between">
            <div className="card-title my-0">
              <h1 className="card-label">{t('Danh sách cấu hình')}</h1>
              {pagination?.total ? <span>{`(${pagination?.total})`}</span> : null}
            </div>
            <div className="card-toolbar">
              <a
                href="#"
                className={`${
                  selectedEmployees.length === 0 ? 'd-none' : 'd-flex'
                } btn btn-light-danger font-weight-bold align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMultiEmployees();
                }}
              >
                <i className="far fa-ban"></i>
                {`${t('Delete')} (${selectedEmployees.length})`}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalEmployeeEditShowing(true);
                }}
                className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              >
                <i className="fa-solid fa-plus"></i>
                {t('Thêm cấu hình')}
              </a>
            </div>
          </div>
        </div>

        {/* card body */}
        <div className="card-body pt-3">
          <DataTable
            // fixedHeader
            // fixedHeaderScrollHeight="60vh"
            columns={columns}
            data={config}
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
            progressPending={isGettingConfig}
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
                  Global.gFilterConfigList = { ...filters, page: iNewPage };
                  setFilters({
                    ...filters,
                    page: iNewPage,
                  });
                }}
                onChangeRowsPerPage={(newPerPage) => {
                  const iNewPerPage = parseInt(newPerPage);
                  dispatch(setPaginationPerPage(iNewPerPage));
                  needToRefreshData.current = true;
                  Global.gFilterConfigList = {
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

      <ModalEditConfig
        show={modalEmployeeEditShowing}
        onClose={() => {
          setModalEmployeeEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedCollectionItem(null);
        }}
        categoryItem={selectedCollectionItem}
        onRefreshCollectionList={() => {
          setSelectedCollectionItem(null);
          getEmployeeList();
        }}
      />
    </div>
  );
}

export default ConfigHomePage;
