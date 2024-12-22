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
import { Button, Modal, Tab, Row, Col, Nav, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { thunkGetListBook } from '../../bookSlice';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import moment from 'moment';
import AppData from 'general/constants/AppData';
import bookApi from 'api/bookApi';
import DataTable from 'react-data-table-component';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import customDataTableStyle from 'assets/styles/customDataTableStyle';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import Pagination from 'general/components/Pagination';
import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import ModalEditBookInventory from '../ModelEditBookInventory';
import KTFormTextArea from 'general/components/OtherKeenComponents/Forms/KTFormTextArea';
import { createWorker } from 'tesseract.js';
import KTUploadFiles from 'general/components/OtherKeenComponents/FileUpload/KTUploadFiles';
import ReactQuill from 'react-quill';


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
  const { show, onClose, onRefreshOrderList, orderItem, onExistDone, onSelectInventory, bookStores, categories, collection, isbn } = props;
  const isEditMode = !_.isNull(orderItem);
  const { book, isGettingBookList, pagination } = useSelector((state) => state.book);
  // const [categories, setCategories] = useState([])
  const [bookInventory, setBookInventory] = useState([]);
  const [storeId, setStoreId] = useState([])
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [toggledClearOrders, setToggledClearOrders] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("")
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [modalInventoryEditShowing, setModalInventoryEditShowing] = useState(false);

  const convertImageToText = async () => {
    const worker = await createWorker('eng');
    if (!selectedImage) return;
    const { data: { text } } = await worker.recognize(selectedImage);
    console.log(text);
    setTextResult(text);
  };


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

  // Request create new book
  async function requestCreateOrder(values) {
    try {
      let cover_image, content_image;
      if (!values?.cover_image || typeof values.cover_image !== "object") {
        console.error("Invalid cover_image format:", values.cover_image);
        cover_image = values.cover_image
      } else {
        console.log("Uploading cover image...");
        cover_image = await Utils.uploadFile(values?.cover_image);
      }

      if (!Array.isArray(values.content_image) || values.content_image.some((file) => typeof file !== 'object')) {
        console.error("Invalid content_image format:", values.content_image);
        content_image = values.content_image
      } else {
        console.log("Uploading content images...");
        content_image = await Promise.all(
          values?.content_image.map(async (image) => {
            return await Utils.uploadFile(image);
          })
        );

        console.log("Uploaded images:", content_image);
      }
      let params = {
        ...values,
        cover_image: cover_image,
        content_image: content_image,
        book_inventory: bookInventory
      };
      const res = await bookApi.addBookInfoAndInventory(params);
      console.log(res, bookInventory, storeId)
      const { result } = res?.data;
      if (result == true) {
        ToastHelper.showSuccess(t('Thêm mới thông tin sách thành công'));
        setLoading(false)
        dispatch(thunkGetListBook(Global.gFilterBookList));
        handleClose();
      }
    } catch (error) {
      ToastHelper.showError(error)
      console.log(error);
    }
  }

  // Request update new order
  async function requestUpdateBook(values) {
    try {
      let cover_image, content_image;
      if (!values?.cover_image || typeof values.cover_image !== "object") {
        console.error("Invalid cover_image format:", values.cover_image);
        cover_image = values.cover_image
      } else {
        console.log("Uploading cover image...");
        cover_image = await Utils.uploadFile(values?.cover_image);
      }

      if (!Array.isArray(values.content_image) || values.content_image.some((file) => typeof file !== 'object')) {
        console.error("Invalid content_image format:", values.content_image);
        content_image = values.content_image
      } else {
        console.log("Uploading content images...");
        content_image = await Promise.all(
          values?.content_image.map(async (image) => {
            return await Utils.uploadFile(image);
          })
        );

        console.log("Uploaded images:", content_image);
      }
      let params = {
        ...values,
        cover_image: cover_image,
        content_image: content_image,
      };

      const res = await bookApi.updateBookInfo(params);
      const { result, reason } = res;

      if (result === true) {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListBook(Global.gFilterBookList));
        setLoading(false)
        handleClose();
      } else {
        ToastHelper.showError(reason);
      }
    } catch (error) {
      console.error("Error updating book:", error);
      ToastHelper.showError(t("An error occurred while updating the book."));
    }
  }

  async function saveBookInventory(row) {
    console.log(row);
    try {
      let cover_image;
      if (!row?.cover_image || typeof row.cover_image !== "object") {
        cover_image = row.cover_image
      } else {
        console.log("Uploading cover image...");
        cover_image = await Utils.uploadFile(row?.cover_image);
      }
      // let cover_image = await Utils.uploadFile(values?.cover_image)
      let params = { ...row, book_id: row.bookId ?? row.book_id, store_id: row.storeId ?? row.store_id, cover_image: cover_image };
      const res = await bookApi.updateBookInventory(params);
      const { result, reason } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        setLoading(false)
        dispatch(thunkGetListBook(Global.gFilterBookList));
        // handleClose();
      } else {
        ToastHelper.showError(reason);
      }
    } catch (error) {
      ToastHelper.showError(error);
      console.log(error);
    }
  }
  async function fetchBookInfoByISBN(isbn, form) {
    try {
      const res = await bookApi.getBookInfoByISBN(isbn); // Giả sử API của bạn là `getBookInfoByISBN`
      if (res && res?.data) {
        form.setFieldValue('name', res?.data?.title || '');
        form.setFieldValue('author_name', res?.data?.author || '');
        form.setFieldValue('publisher', res?.data?.publisher || '');
        form.setFieldValue('publish_year', res?.data?.publish_year || '');
        form.setFieldValue('number_of_page', res?.data?.page || '');
        form.setFieldValue('tags', res?.data?.tags || '')
      } else {
        ToastHelper.showError(t('Không tìm thấy thông tin sách với ISBN này'));
      }
    } catch (error) {
      console.error(error);
      ToastHelper.showError(t('Lỗi khi lấy thông tin sách'));
    }
  }
  const columns = useMemo(() => {
    const baseColumns = [
      {
        name: "Barcode",
        sortable: false,
        cell: (row) => {
          return (
            <div
              data-tag="allowRowEvents"
              className="text-dark-75 font-weight-bold m-0 text-maxline-3 d-flex align-items-center"
            >
              {row?.barcode}
            </div>
          );
        },
      },
      {
        name: t('BookType'),
        sortable: false,
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
            />
          );
        },
      },
      {
        name: t('NumberOfBook'),
        sortable: true,
        cell: (row, index) => {
          return (
            <KTFormInput
              value={row?.quantity}
              onChange={(value) => {
                const updatedInventory = [...bookInventory];
                updatedInventory[index] = { ...row, quantity: value };
                setBookInventory(updatedInventory);
              }}
              rows={5}
              placeholder={`${_.capitalize(t(''))}...`}
              type={KTFormInputType.number}
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
            />
          );
        },
      },
      {
        name: t('Ảnh'),
        sortable: false,
        cell: (row, index) => {
          return (
            <KTImageInput
              isAvatar={false}
              name={row.image}
              onChange={async (file) => {
                const updatedInventory = [...bookInventory];
                updatedInventory[index] = { ...row, cover_image: file };
                setBookInventory(updatedInventory);
              }}
              value={row.coverImage}
              onSelectedFile={async (file) => {
                let file1 = await Utils.uploadFile(file)
                const updatedInventory = [...bookInventory];
                updatedInventory[index] = { ...row, cover_image: file1 };
                setBookInventory(updatedInventory);
              }}
              enableCheckValid
              acceptImageTypes={AppConfigs.acceptImages}
              additionalClassName=""
            />
          );
        },
      },
    ];

    if (isEditMode) {
      baseColumns.push({
        name: '',
        center: true,
        width: '100px',
        cell: (row) => (
          <div className="d-flex align-items-center">
            <a
              href="#"
              className="btn btn-primary font-weight-bold d-flex align-items-center ml-2"
              onClick={() => saveBookInventory(row)}
            >
              Lưu
            </a>
          </div>
        ),
      });
    }

    return baseColumns;
  }, [bookInventory, isEditMode, t]);


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
        const types = ["NEW", "GOOD", "OLD"];
        types.forEach((type) => {
          if (!updatedInventory.some((item) => item.type === type)) {
            updatedInventory.push({
              book_id: orderItem.id,
              cover_image: null,
              createdAt: null,
              deletedAt: null,
              id: null,
              location: null,
              price: 0,
              quantity: 0,
              relatedBookId: null,
              store_id: storeId,
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
        { type: "GOOD", price: 0, quantity: 0, location: null },
        { type: "OLD", price: 0, quantity: 0, location: null },
      ]);
      // setStoreId(null); 
    }
  }, [storeId, orderItem])

  const [value, setValue] = useState(Utils.markdownToHtml(props.value || ""));
  const reactQuillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const url = await Utils.uploadFile(file);
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);
  return (
    <div>
      <Formik
        initialValues={{
          id: orderItem ? orderItem.id : '',
          name: orderItem ? orderItem.name : '',
          author_name: orderItem ? orderItem.author_name : '',
          isbn: orderItem ? orderItem.isbn : isbn ? isbn : '',
          number_of_page: orderItem ? orderItem.number_of_page : '',
          publish_year: orderItem ? orderItem.publish_year : '',
          publisher: orderItem ? orderItem.publisher : '',
          tags: orderItem ? orderItem.tags : '',
          cover_image: orderItem ? orderItem.cover_image : '',
          imageLink: orderItem ? Utils.getFullUrl(orderItem.cover_image) : '',
          category_id: orderItem ? orderItem?.category?.id : '',
          store_id: orderItem ? orderItem?.store_id : '',
          description: orderItem ? orderItem?.description : '',
          content_image: orderItem ? orderItem?.content_image : []
        }}
        // validationSchema={Yup.object({
        //   orderCode: Yup.string().required(t('Required')),
        //   postOfficeId: Yup.string().required(t('Required')),
        //   scanAccountId: Yup.string().required(t('Required')),
        // })}
        enableReinitialize
        onSubmit={(values) => {
          setLoading(true);
          if (isEditMode) {
            requestUpdateBook(values);
          } else {
            requestCreateOrder(values);
          }
        }}
      >
        {(formikProps) => (
          <>
            <Modal show={show} backdrop="static" size='xl' onHide={handleClose} centered
              onExit={() => {
                formikProps.handleReset();
              }}
              onExited={() => {
                handleExistDone();
              }}
              enforceFocus={false}>
              <Modal.Header>
                <Modal.Title>{isEditMode ? t('Chỉnh sửa thông tin sách') : t('Thêm mới thông tin sách')}</Modal.Title>
                <Button variant="close" onClick={handleClose}></Button>
              </Modal.Header>

              <Modal.Body>
                <Tab.Container defaultActiveKey="generalInfo">
                  <Row>
                    <Col sm={3}>
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                          <Nav.Link eventKey="generalInfo">{t('Thông tin cơ bản')}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="inventoryInfo">{t('Tồn kho')}</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                    <Col sm={9}>
                      <Tab.Content>
                        <Tab.Pane eventKey="generalInfo">
                          <div className='row'>
                            {/* <div className="col-12">
                              <h2 style={{ fontWeight: 600 }}>1/ Thông tin chung</h2>
                            </div> */}
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
                            <div className="col-6">
                              <KTFormGroup
                                label={
                                  <>
                                    {t('ISBN')}
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
                                          fetchBookInfoByISBN(field.value, form)
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
                                    {t('PublishName')}
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
                                    {t('PublishYear')}
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

                            <div className="col-6">
                              <KTFormGroup
                                label={
                                  <>
                                    {t('Tag')}
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

                            <div className="col-6">
                              <KTFormGroup
                                label={
                                  <>
                                    {t('Bộ sưu tập')}
                                  </>
                                }
                                inputName="collection_id"
                                inputElement={
                                  <FastField name="collection_id">
                                    {({ field, form, meta }) => (
                                      <KTFormSelect
                                        name={field.name}
                                        isCustom
                                        options={[{ name: '', value: '' }].concat(
                                          collection?.map((item) => {
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
                                      <ReactQuill
                                        ref={reactQuillRef}
                                        theme="snow"
                                        placeholder="Start writing..."
                                        modules={{
                                          toolbar: {
                                            container: [
                                              [{ header: "1" }, { header: "2" }, { font: [] }],
                                              [{ size: [] }],
                                              ["bold", "italic", "underline", "strike", "blockquote"],
                                              [
                                                { list: "ordered" },
                                                { list: "bullet" },
                                                { indent: "-1" },
                                                { indent: "+1" },
                                              ],
                                              ["link", "image", "video"],
                                              ["code-block"],
                                              ["clean"],
                                            ],
                                            handlers: {
                                              image: imageHandler,
                                            },
                                          },
                                          clipboard: {
                                            matchVisual: false,
                                          },
                                        }}
                                        formats={[
                                          "header",
                                          "font",
                                          "size",
                                          "bold",
                                          "italic",
                                          "underline",
                                          "strike",
                                          "blockquote",
                                          "list",
                                          "bullet",
                                          "indent",
                                          "link",
                                          "image",
                                          "video",
                                          "code-block",
                                        ]}
                                        value={field.value}
                                        onChange={(value) => {
                                          form.setFieldValue(field.name, value);
                                        }}
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
                                inputName="cover_image"
                                inputElement={
                                  <FastField name="cover_image">
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
                                        defaultImage={field.value ?? AppResource.images.imgUpload}
                                        acceptImageTypes={AppConfigs.acceptImages}
                                        onSelectedFile={(file) => {
                                          console.log(file);
                                          //   Utils.validateImageFile(file);
                                          form.setFieldValue('cover_image', file);
                                        }}
                                        onRemovedFile={() => {
                                          form.setFieldValue('cover_image', null);
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
                                inputName="content_image"
                                inputElement={
                                  <FastField name="content_image">
                                    {({ field, form, meta }) => (
                                      <KTUploadFiles
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
                                        onSelectedFile={(file) => {
                                          console.log("content image", file);
                                          //   Utils.validateImageFile(file);
                                          form.setFieldValue('content_image', file);
                                        }}
                                        onRemovedFile={() => {
                                          form.setFieldValue('content_image', null);
                                        }}

                                        additionalClassName=""
                                      />
                                    )}
                                  </FastField>
                                }
                              />
                            </div>
                          </div>


                        </Tab.Pane>

                        {/* Tab: Inventory Info */}
                        <Tab.Pane eventKey="inventoryInfo">
                          <div className="col-12">
                            {/* <h2 style={{ fontWeight: 600 }}>2/ Tồn kho</h2> */}
                            <div className="col-6">
                              <KTFormGroup
                                label={
                                  <>
                                    {t('Nhà bán')} <span className="text-danger">(*)</span>
                                  </>
                                }
                                inputName="store_id"
                                inputElement={
                                  <FastField name="store_id">
                                    {({ field, form, meta }) => (
                                      <KTFormSelect
                                        name={field.name}
                                        isCustom
                                        options={[{ name: 'Chọn nhà bán', value: '' }].concat(
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
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={formikProps.handleSubmit}>
                  {loading ? (
                    <Spinner animation="border" size="sm" /> // Hiển thị loading spinner
                  ) : (
                    t('Save')
                  )}

                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  {t('Close')}
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Formik>
      <ModalEditBookInventory
        show={modalInventoryEditShowing}
        onClose={() => {
          setModalInventoryEditShowing(false);
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

export default ModalOrderEdit;
