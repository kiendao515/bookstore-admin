import { FastField, Formik } from 'formik';
import KTImageInput from 'general/components/OtherKeenComponents/FileUpload/KTImageInput';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, {
  KTFormInputType,
} from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import AppConfigs from 'general/constants/AppConfigs';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import AppResource from 'general/constants/AppResource';
import bookApi from 'api/bookApi';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';

ModalEditBookInventory.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshBookInventoryList: PropTypes.func,
  bookInventoryItem: PropTypes.object,
  onExistDone: PropTypes.func,
  role: PropTypes.any
};

ModalEditBookInventory.defaultProps = {
  show: false,
  onClose: null,
  onRefreshBookInventoryList: null,
  bookInventoryItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshBookInventoryList: function,
 * bookInventoryItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalEditBookInventory(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, role, onRefreshBookInventoryList, bookInventoryItem, onExistDone } = props;
  const isEditMode = !_.isNull(bookInventoryItem);

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

  // Request create new Account
  async function requestCreateAccount(values) {
    try {
      let params = { ...values };
      // params.password = Utils.sha256(params.password);
      let res = null;
      if(role == "USER"){
        res = await bookApi.createAccountInfo(params);
      }else {
        res = await bookApi.createStoreInfo(params)
      }
      const { result, reason } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        let filter = {
          ...Global.gFiltersAccountList,
          role: role
        }
        dispatch(thunkGetListAccount(filter));
        handleClose();
      } else {
        ToastHelper.showError(reason);
      }
    } catch (error) {
      ToastHelper.showError(t('Error'));
      console.log(error);
    }
  }

  // Request update new Account
  async function requestUpdateAccount(values) {
    try {
      let params = { ...values };
      if (role == "USER") {
        const res = await bookApi.updateAccountInfo(params);
        const { result } = res;
        if (result == true) {
          ToastHelper.showSuccess(t('Success'));
          let filter = {
            ...Global.gFiltersAccountList,
            role: role
          }
          dispatch(thunkGetListAccount(filter));
          handleClose();
        }
      }
      if (role == "STORE") {
        const res = await bookApi.updateStoreInfo(params);
        const { result } = res;
        if (result == true) {
          ToastHelper.showSuccess(t('Success'));
          let filter = {
            ...Global.gFiltersAccountList,
            role: role
          }
          dispatch(thunkGetListAccount(filter));
          handleClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          id: bookInventoryItem ? bookInventoryItem.id : '',
          type: bookInventoryItem ? bookInventoryItem.type : '',
          price: bookInventoryItem ? bookInventoryItem.price : '',
          quantity: bookInventoryItem ? bookInventoryItem.phone : '',
          avatar: bookInventoryItem ? bookInventoryItem.avatar : '',
          cover_image: bookInventoryItem
            ? Utils.getFullUrl(bookInventoryItem.cover_image)
            : AppResource.images.imgDefaultAvatar
        }}
        validationSchema={Yup.object({
          price: Yup.number().required(t('Required')),
          quantity: Yup.number().required(t('Required')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          console.log(values);
          if (isEditMode) {
            requestUpdateAccount(values);
          } else {
            requestCreateAccount(values);
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
                <Modal.Title>{bookInventoryItem ? t('EditBookInventory') : t('Newaccount')}</Modal.Title>
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
                <div>
                  <div className="row">
                    {/* email */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('BookType')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="email"
                        inputElement={
                          <FastField name="email">
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
                                placeholder={`${_.capitalize(t('tình trạng sách'))}...`}
                                type={KTFormInputType.text}
                                disabled={true}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* fullname */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Price')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="price"
                        inputElement={
                          <FastField name="price">
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
                                placeholder={`${_.capitalize(t('price'))}...`}
                                type={KTFormInputType.number}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* phone */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Quantity')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="quantity"
                        inputElement={
                          <FastField name="quantity">
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
                                placeholder={`${_.capitalize(t('số lượng'))}...`}
                                type={KTFormInputType.number}
                              />
                            )}
                          </FastField>
                        }
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
                      console.log("submit");
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

export default ModalEditBookInventory;
