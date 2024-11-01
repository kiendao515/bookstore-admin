
import { FastField, Formik } from 'formik';
import KTImageInput from 'general/components/OtherKeenComponents/FileUpload/KTImageInput';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, {
  KTFormInputType,
} from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import AppConfigs from 'general/constants/AppConfigs';
import AppResource from 'general/constants/AppResource';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { thunkGetListBook } from '../../bookSlice';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import moment from 'moment';
import AppData from 'general/constants/AppData';
import bookApi from 'api/bookApi';
import DataTable from 'react-data-table-component';
import { useMemo, useState } from 'react';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import Pagination from 'general/components/Pagination';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import ModalEditBookInventory from '../ModelEditBookInventory';

ModalOrderEdit.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshOrderList: PropTypes.func,
  orderItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalOrderEdit.defaultProps = {
  show: false,
  onClose: null,
  onRefreshOrderList: null,
  orderItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshOrderList: function,
 * orderItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalOrderEdit(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, onRefreshOrderList, orderItem, onExistDone } = props;
  const isEditMode = !_.isNull(orderItem);
  const categories = useSelector((state) => state?.category?.categories);
  const bookstores = useSelector((state) => state?.bookstore?.bookstores);
  // thêm mơi
  const { book, isGettingBookList, pagination } = useSelector((state) => state.book);
  const [books, setBooks] = useState([
    {
      type : "Mới",
      price : 0,
      quantity :0,
      image : ""
    }
  ]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [toggledClearOrders, setToggledClearOrders] = useState(true);

  // MARK: --- Functions ---
  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleExistDone() {
    if (onExistDone) {
      onExistDone();
    }
  }

  // Request create new order
  async function requestCreateOrder(values) {
    try {
      let params = { ...values };
      params.scanTime = moment().toISOString();
      const res = await bookApi.createOrder(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListBook(Global.gFiltersOrderList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Request update new order
  async function requestUpdateOrder(values) {
    try {
      let params = { ...values };
      const res = await bookApi.updateOrder(params);
      const { result } = res;
      if (result == 'success') {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListBook(Global.gFiltersOrderList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const columns = useMemo(() => {
    return [
      {
        name: t('BookType'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.type}
            </div>
          );
        },
      },
      {
        name: t('Price'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.price}
            </div>
          );
        },
      },
      {
        name: t('NumberOfBook'),
        sortable: false,
        // minWidth: '220px',
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.quantity}
            </div>
          );
        },
      },
      {
        name: t('NumerOfBook'),
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
          </div>
        ),
      },
    ];
  }, [categories, books]);

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
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [modalOrderEditShowing, setModalOrderEditShowing] = useState(false);

  async function getListBookInventory() {
    // refLoading.current = true;
    try {
      const res = unwrapResult(await dispatch(thunkGetListBook(filters)));
      console.log(res);
      
    } catch (error) {
      console.log(`${sTag} get order list error: ${error.message}`);
    }
    // refLoading.current = false;
  }
  return (
    <div>
      <Formik
        initialValues={{
          orderId: orderItem ? orderItem.orderId : '',
          orderCode: orderItem ? orderItem.orderCode : '',
          eCommercePlatform: orderItem ? orderItem.eCommercePlatform : '',
          scanTime: orderItem ? orderItem.scanTime : '',
          categoryId: orderItem ? orderItem.categoryId : '',
          scanAccountId: orderItem ? orderItem.accountId : '',
          // status: orderItem ? orderItem.status : AppData.ORDER_STATUS.SCANNED,
          image: orderItem ? orderItem.image : '',
          imageLink: orderItem ? Utils.getFullUrl(orderItem.scannedImage) : '',
        }}
        validationSchema={Yup.object({
          orderCode: Yup.string().required(t('Required')),
          postOfficeId: Yup.string().required(t('Required')),
          scanAccountId: Yup.string().required(t('Required')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          if (isEditMode) {
            requestUpdateOrder(values);
          } else {
            requestCreateOrder(values);
          }
        }}
      >
        {(formikProps) => (
          <>
            <Modal
              className=""
              show={show}
              backdrop="static"
              size="lg"
              onHide={handleClose}
              centered
              onExit={() => {
                formikProps.handleReset();
              }}
              onExited={() => {
                handleExistDone();
              }}
              enforceFocus={false}
            >
              <Modal.Header className="px-5 py-5">
                <Modal.Title>{orderItem ? t('EditBook') : t('NewBook')}</Modal.Title>
                <div
                  className="btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  <i className="far fa-times"></i>
                </div>
              </Modal.Header>

              <Modal.Body
                className="overflow-auto"
                style={{
                  maxHeight: '70vh',
                }}
              >
                <div className="row">
                  <div className="col-12">
                    <h2 style={{ fontWeight: 600 }}>1/ Thông tin chung</h2>
                  </div>
                  {/* orderCode */}
                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('BookName')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="name"
                      inputElement={
                        <FastField name="name">
                          {({ field, form, meta }) => (
                            <KTFormInput
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              rows={5}
                              placeholder={`${_.capitalize(t('tên sách'))}...`}
                              type={KTFormInputType.text}
                            // disabled={!canEdit}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>

                  {/* danh muc */}
                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('Category')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="categoryId"
                      inputElement={
                        <FastField name="categoryId">
                          {({ field, form, meta }) => (
                            <KTFormSelect
                              name={field.name}
                              isCustom
                              options={[{ name: '', value: '' }].concat(
                                // categories?.map((item) => {
                                //   return { 
                                //     name: item.name,
                                //     value: item.id.toString(),
                                //   };
                                // })
                              )}
                              value={field.value?.toString()}
                              onChange={(newValue) => {
                                form.setFieldValue(field.name, newValue);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  {/* eCommercePlatform */}
                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('AuthorName')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="author"
                      inputElement={
                        <FastField name="author">
                          {({ field, form, meta }) => (
                            <KTFormInput
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              rows={5}
                              placeholder={`${_.capitalize(t('author'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>

                  {/* postOfficeId */}
                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('Store')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="storeId"
                      inputElement={
                        <FastField name="storeId">
                          {({ field, form, meta }) => (
                            <KTFormSelect
                              name={field.name}
                              isCustom
                              options={[{ name: '', value: '' }].concat(
                                // categories?.map((item) => {
                                //   return { 
                                //     name: item.name,
                                //     value: item.id.toString(),
                                //   };
                                // })
                              )}
                              value={field.value?.toString()}
                              onChange={(newValue) => {
                                form.setFieldValue(field.name, newValue);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  <div className="col-3">
                    <KTFormGroup
                      label={
                        <>
                          {t('ISBN')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="isbn"
                      inputElement={
                        <FastField name="isbn">
                          {({ field, form, meta }) => (
                            <KTFormInput
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              rows={5}
                              placeholder={`${_.capitalize(t('isbn'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  {/* scanAccountId */}
                  {/* <div className="mb-4 d-flex flex-column" style={{ marginTop: '-10px' }}>
                    <label className="mb-2" htmlFor="scanAccountId">
                      {_.capitalize(t('PackingEmployee'))}
                    </label>
                    <KTFormSelect
                      name="scanAccountId"
                      isCustom
                      options={[{ name: '', value: '' }].concat(
                        employees?.map((item) => {
                          return {
                            name: item.fullname,
                            value: item.accountId.toString(),
                          };
                        })
                      )}
                      value={formikProps.getFieldProps('scanAccountId').value?.toString()}
                      onChange={(newValue) => {
                        formikProps.getFieldHelpers('scanAccountId').setValue(newValue);
                      }}
                    />
                  </div> */}
                  {/* postOfficeId */}
                  <div className="col-2">
                    <KTFormGroup
                      label={
                        <>
                          {t('NumberOfPage')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="numberOfPage"
                      inputElement={
                        <FastField name="numberOfPage">
                          {({ field, form, meta }) => (
                            <KTFormInput
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              rows={5}
                              placeholder={`${_.capitalize(t('số trang'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  <div className="col-2">
                    <KTFormGroup
                      label={
                        <>
                          {t('PublishYear')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="publishYear"
                      inputElement={
                        <FastField name="publishYear">
                          {({ field, form, meta }) => (
                            <KTFormInput
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              rows={5}
                              placeholder={`${_.capitalize(t('Năm xuất bản'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  <div className="col-5">
                    <KTFormGroup
                      label={
                        <>
                          {t('PublishName')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="publish_name"
                      inputElement={
                        <FastField name="publish_name">
                          {({ field, form, meta }) => (
                            <KTFormInput
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              rows={5}
                              placeholder={`${_.capitalize(t('Nhà xuất bản'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  <div className="col-12">
                    <KTFormGroup
                      label={
                        <>
                          {t('Tag')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="tag"
                      inputElement={
                        <FastField name="tag">
                          {({ field, form, meta }) => (
                            <KTFormInput
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              rows={5}
                              placeholder={`${_.capitalize(t('tags'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  {/* status */}
                  <div className="mb-4 d-flex flex-column" style={{ marginTop: '-10px' }}>
                    <label className="mb-2" htmlFor="status">
                      {_.capitalize(t('Status'))}
                    </label>
                    <KTFormSelect
                      name="status"
                      isCustom
                      options={AppData.orderStatus}
                      // value={formikProps.getFieldProps('status').value?.toString()}
                      onChange={(newValue) => {
                        formikProps.getFieldHelpers('status').setValue(newValue);
                      }}
                    />
                  </div>

                  {/* image */}
                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('ThumbnailBook')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="thumbnail"
                      inputElement={
                        <FastField name="thumbnail w-100">
                          {({ field, form, meta }) => (
                            <KTImageInput

                              isAvatar={false}
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              defaultImage={AppResource.images.imgUpload}
                              acceptImageTypes={AppConfigs.acceptImages}
                              onSelectedFile={(file) => {
                                console.log(file);
                                //   Utils.validateImageFile(file);
                                form.setFieldValue('image', file);
                              }}
                              onRemovedFile={() => {
                                form.setFieldValue('image', null);
                              }}
                              additionalClassName=""
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>

                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('ContentBookImage')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="thumbnail"
                      inputElement={
                        <FastField name="thumbnail">
                          {({ field, form, meta }) => (
                            <KTImageInput
                              isAvatar={false}
                              name={field.name}
                              value={field.value}
                              onChange={(value) => {
                                form.setFieldValue(field.name, value);
                              }}
                              onBlur={() => {
                                form.setFieldTouched(field.name, true);
                              }}
                              enableCheckValid
                              isValid={_.isEmpty(meta.error)}
                              isTouched={meta.touched}
                              feedbackText={meta.error}
                              defaultImage={AppResource.images.imgUpload}
                              acceptImageTypes={AppConfigs.acceptImages}
                              onSelectedFile={(file) => {
                                console.log(file);
                                //   Utils.validateImageFile(file);
                                form.setFieldValue('image', file);
                              }}
                              onRemovedFile={() => {
                                form.setFieldValue('image', null);
                              }}
                              additionalClassName=""
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>

                  <div className="col-12">
                    <h2 style={{ fontWeight: 600 }}>2/ Tồn kho</h2>
                    <div className="card-body pt-3">
                      <DataTable
                        columns={columns}
                        data={books}
                        customStyles={customDataTableStyle}
                        responsive={true}
                        noHeader
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
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <div className="w-100 d-flex row">
                  <Button
                    className="font-weight-bold flex-grow-1 col mr-3"
                    variant="primary"
                    onClick={() => {
                      formikProps.handleSubmit();
                    }}
                  >
                    {t('Save')}
                  </Button>

                  <Button
                    className="font-weight-bold flex-grow-1 col"
                    variant="secondary"
                    onClick={handleClose}
                  >
                    {t('Close')}
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Formik>
      <ModalEditBookInventory
        show={modalOrderEditShowing}
        onClose={() => {
          setModalOrderEditShowing(false);
        }}
        onExistDone={() => {
          setSelectedOrderItem(null);
        }}
        bookInventoryItem={selectedOrderItem}
        onRefreshOrderList={() => {
          setSelectedOrderItem(null);
          // getListBookInventory();
        }}
      />
    </div>
  );
}

export default ModalOrderEdit;
