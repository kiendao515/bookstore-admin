
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
  const postOffice = useSelector((state) => state?.postOffice?.postOffices);
  const employees = useSelector((state) => state?.employee?.employees);

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

  return (
    <div>
      <Formik
        initialValues={{
          orderId: orderItem ? orderItem.orderId : '',
          orderCode: orderItem ? orderItem.orderCode : '',
          eCommercePlatform: orderItem ? orderItem.eCommercePlatform : '',
          scanTime: orderItem ? orderItem.scanTime : '',
          postOfficeId: orderItem ? orderItem.postOfficeId : '',
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
                <Modal.Title>{orderItem ? t('EditOrder') : t('NewOrder')}</Modal.Title>
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
                  {/* orderCode */}
                  <div className="col-12">
                    <KTFormGroup
                      label={
                        <>
                          {t('OrderCode')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="orderCode"
                      inputElement={
                        <FastField name="orderCode">
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
                              placeholder={`${_.capitalize(t('OrderCode'))}...`}
                              type={KTFormInputType.text}
                              // disabled={!canEdit}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>
                  {/* eCommercePlatform */}
                  <div className="col-12">
                    <KTFormGroup
                      label={
                        <>
                          {t('ECommercePlatform')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="eCommercePlatform"
                      inputElement={
                        <FastField name="eCommercePlatform">
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
                              placeholder={`${_.capitalize(t('ECommercePlatform'))}...`}
                              type={KTFormInputType.text}
                            />
                          )}
                        </FastField>
                      }
                    />
                  </div>

                  {/* postOfficeId */}
                  <div className="col-12">
                    <KTFormGroup
                      label={
                        <>
                          {t('PostOffice')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="postOfficeId"
                      inputElement={
                        <FastField name="postOfficeId">
                          {({ field, form, meta }) => (
                            <KTFormSelect
                              name={field.name}
                              isCustom
                              options={[{ name: '', value: '' }].concat(
                                postOffice?.map((item) => {
                                  return {
                                    name: item.postOfficeName,
                                    value: item.postOfficeId.toString(),
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
                  <div className="col-12">
                    <KTFormGroup
                      label={
                        <>
                          {t('PackingEmployee')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="scanAccountId"
                      inputElement={
                        <FastField name="scanAccountId">
                          {({ field, form, meta }) => (
                            <KTFormSelect
                              name={field.name}
                              isCustom
                              options={[{ name: '', value: '' }].concat(
                                employees?.map((item) => {
                                  return {
                                    name: item.fullname,
                                    value: item.accountId.toString(),
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
                    <label className="mb-2" htmlFor="status">
                      {_.capitalize(t('Status'))}
                    </label>
                    <KTFormSelect
                      name="status"
                      isCustom
                      options={AppData.orderStatus}
                      value={formikProps.getFieldProps('status').value?.toString()}
                      onChange={(newValue) => {
                        formikProps.getFieldHelpers('status').setValue(newValue);
                      }}
                    />
                  </div>

                  {/* image */}
                  <div className="col-12">
                    <KTFormGroup
                      label={
                        <>
                          {t('Image')} <span className="text-danger">(*)</span>
                        </>
                      }
                      inputName="imageLink"
                      inputElement={
                        <FastField name="imageLink">
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
    </div>
  );
}

export default ModalOrderEdit;
