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
import { useEffect, useMemo, useState } from 'react';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import Pagination from 'general/components/Pagination';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import ModalEditBookInventory from '../ModelEditBookInventory';
import KTFormTextArea from 'general/components/OtherKeenComponents/Forms/KTFormTextArea';
import { createWorker } from 'tesseract.js';

ModalOrderEdit.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshOrderList: PropTypes.func,
  orderItem: PropTypes.object,
  onExistDone: PropTypes.func,
  bookStores: PropTypes.object,
  categories: PropTypes.object
};

ModalOrderEdit.defaultProps = {
  show: false,
  onClose: null,
  onRefreshOrderList: null,
  orderItem: null,
  onExistDone: null,
  bookStores: PropTypes.object,
  categories: PropTypes.object
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
  const { show, onClose, onRefreshOrderList, orderItem, onExistDone, onSelectInventory, bookStores, categories } = props;
  const isEditMode = !_.isNull(orderItem);
  const { book, isGettingBookList, pagination } = useSelector((state) => state.book);
  // const [categories, setCategories] = useState([])
  const [bookInventory, setBookInventory] = useState([]);
  const [storeId, setStoreId] = useState([])
  // const handleInputChange = (e, row, field) => {
  //   const newData = books.map((item) => {
  //     if (item.id === row.id) {
  //       return { ...item, [field]: e.target.value };
  //     }
  //     return item;
  //   });
  //   setBooks(newData);
  // };
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [toggledClearOrders, setToggledClearOrders] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("")

  const convertImageToText = async () => {
    const worker = await createWorker('eng');
    if (!selectedImage) return;
    const { data: { text } } = await worker.recognize(selectedImage);
    console.log(text);
    setTextResult(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [selectedImage])

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

  function handleSelectInventory(inventory) {
    if (onSelectInventory) {
      onSelectInventory(inventory);
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
  async function requestUpdateBook(values) {
    try {
      let params = { ...values };
      const res = await bookApi.updateBookInfo(params);
      console.log(res);

      const { result, reason } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListBook(Global.gFilterBookList));
        handleClose();
      } else {
        ToastHelper.showError(reason);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function saveBookInventory(row) {
    console.log(row);

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
              {Utils.getBookQuality(row?.type)}
            </div>
          );
        },
      },
      {
        name: t('Price'),
        sortable: false,
        // minWidth: '220px',
        cell: (row, index) => {
          return (
            <KTFormInput
              value={row.price}
              onChange={(value) => {
                console.log(value);
                const updatedInventory = [...bookInventory];
                updatedInventory[index] = { ...row, price: value };
                setBookInventory(updatedInventory);
              }}
              enableCheckValid
              rows={5}
              placeholder={`${_.capitalize(t(''))}...`}
              type={KTFormInputType.number}
            // disabled={!canEdit}
            />
          );
        },
      },
      {
        name: t('NumberOfBook'),
        sortable: false,
        // minWidth: '220px',
        cell: (row, index) => {
          return (
            <KTFormInput
              value={row.quantity}
              onChange={(value) => {
                const updatedInventory = [...bookInventory];
                updatedInventory[index] = { ...row, quantity: value };
                setBookInventory(updatedInventory);
              }}
              rows={5}
              placeholder={`${_.capitalize(t(''))}...`}
              type={KTFormInputType.number}
            // disabled={!canEdit}
            />
          );
        },
      },
      {
        name: t('Location'),
        sortable: false,
        cell: (row, index) => {
          return (
            <KTFormInput
              value={row.location}
              onChange={(value) => {
                const updatedInventory = [...bookInventory];
                updatedInventory[index] = { ...row, location: value };
                setBookInventory(updatedInventory);
              }}
              enableCheckValid
              rows={5}
              placeholder={`${_.capitalize(t(''))}...`}
              type={KTFormInputType.text}
            // disabled={!canEdit}
            />
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
            <a href="#" class="btn btn-primary font-weight-bold d-flex align-items-center ml-2" onClick={() => saveBookInventory(row)}>
              Lưu
            </a>
          </div>
        ),
      },
    ];
  }, [bookInventory]);

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
      const res = await bookApi.getListBookInventoryInfo(storeId, orderItem.id)
      console.log(res);
      const { result, data } = res;
      if (result === true) {
        const updatedInventory = [...data];
        const types = ["NEW", "MEDIUM", "OLD"];
        types.forEach((type) => {
          if (!updatedInventory.some((item) => item.type === type)) {
            updatedInventory.push({
              bookId: orderItem.id,
              coverImage: null,
              createdAt: null,
              deletedAt: null,
              id: null,
              location: null,
              price: 0,
              quantity: 0,
              relatedBookId: null,
              storeId: storeId,
              type: type,
              updatedAt: null,
            });
          }
        });

        setBookInventory(updatedInventory);
      }
    } catch (error) {
      // console.log(`${sTag} get order list error: ${error.message}`);
    }
    // refLoading.current = false;
  }
  async function updateBookInventory() {

  }
  useEffect(() => {
    if (orderItem) {
      getListBookInventory();
    } else {
      setBookInventory([
        { type: "NEW", price: 0, quantity: 0, location: null },
        { type: "MEDIUM", price: 0, quantity: 0, location: null },
        { type: "OLD", price: 0, quantity: 0, location: null },
      ]);
      setStoreId(null); 
    }
  }, [storeId,orderItem])
  return (
    <div>
      <Formik
        initialValues={{
          id: orderItem ? orderItem.id : '',
          name: orderItem ? orderItem.name : '',
          author_name: orderItem ? orderItem.author_name : '',
          isbn: orderItem ? orderItem.isbn : '',
          number_of_page: orderItem ? orderItem.number_of_page : '',
          publish_year: orderItem ? orderItem.publish_year : '',
          publisher: orderItem ? orderItem.publisher : '',
          tags: orderItem ? orderItem.tags : '',
          image: orderItem ? orderItem.cover_image : '',
          imageLink: orderItem ? Utils.getFullUrl(orderItem.cover_image) : '',
          category_id: orderItem ? orderItem?.category?.id : '',
          store_id: orderItem ? orderItem?.store_id : '',
          description: orderItem ? orderItem?.description : ''
        }}
        // validationSchema={Yup.object({
        //   orderCode: Yup.string().required(t('Required')),
        //   postOfficeId: Yup.string().required(t('Required')),
        //   scanAccountId: Yup.string().required(t('Required')),
        // })}
        enableReinitialize
        onSubmit={(values) => {
          if (isEditMode) {
            requestUpdateBook(values);
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
                      inputName="category_id"
                      inputElement={
                        <FastField name="category_id">
                          {({ field, form, meta }) => (
                            <KTFormSelect
                              name={field.name}
                              isCustom
                              options={[{ name: '', value: '' }].concat(
                                categories?.map((item) => {
                                  return {
                                    name: item.name,
                                    value: item.id.toString(),
                                  };
                                })
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

                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('AuthorName')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="author_name"
                      inputElement={
                        <FastField name="author_name">
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

                  <div className="col-6">
                    <KTFormGroup
                      label={
                        <>
                          {t('PublishName')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="publisher"
                      inputElement={
                        <FastField name="publisher">
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
                  <div className="col-4">
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
                  <div className="col-4">
                    <KTFormGroup
                      label={
                        <>
                          {t('NumberOfPage')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="number_of_page"
                      inputElement={
                        <FastField name="number_of_page">
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
                  <div className="col-4">
                    <KTFormGroup
                      label={
                        <>
                          {t('PublishYear')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="pubish_year"
                      inputElement={
                        <FastField name="publish_year">
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

                  <div className="col-12">
                    <KTFormGroup
                      label={
                        <>
                          {t('Tag')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="tags"
                      inputElement={
                        <FastField name="tags">
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
                    <KTFormGroup
                      label={
                        <>
                          {t('Description')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="description"
                      inputElement={
                        <FastField name="description">
                          {({ field, form, meta }) => (
                            <KTFormTextArea
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
                              rows={10}
                              placeholder={`${_.capitalize(t('Mô tả'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
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
                                setSelectedImage(value)
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
                    <div className="col-6">
                      <KTFormGroup
                        label={
                          <>
                            {t('Store')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="store_id"
                        inputElement={
                          <FastField name="store_id">
                            {({ field, form, meta }) => (
                              <KTFormSelect
                                name={field.name}
                                isCustom
                                options={[{ name: 'Chọn hiệu sách', value: '' }].concat(
                                  bookStores?.map((item) => {
                                    return {
                                      name: item?.name,
                                      value: item?.id.toString(),
                                    };
                                  })
                                )}
                                value={field.value?.toString()}
                                onChange={(newValue) => {
                                  form.setFieldValue(field.name, newValue);
                                  setStoreId(newValue)
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
                    <div className="card-body pt-3">
                      <DataTable
                        columns={columns}
                        data={bookInventory}
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
                        progressComponent={
                          <Loading showBackground={false} message={`${t('Loading')}...`} />
                        }
                        onSelectedRowsChange={handleSelectedOrdersChanged}
                        // onRowClicked={(row) => {
                        //   // handleEditOrder(row);
                        //   handleSelectInventory(row);
                        // }}
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
      {/* <ModalEditBookInventory
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
      /> */}
    </div>
  );
}

export default ModalOrderEdit;
