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
import { thunkGetListAccount } from '../../accountSlice';
import AppResource from 'general/constants/AppResource';
import accountApi from 'api/accountApi';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';

ModalAccountEdit.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshAccountList: PropTypes.func,
  accountItem: PropTypes.object,
  onExistDone: PropTypes.func,
  role: PropTypes.any
};

ModalAccountEdit.defaultProps = {
  show: false,
  onClose: null,
  onRefreshAccountList: null,
  accountItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshAccountList: function,
 * accountItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalAccountEdit(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, role, onRefreshAccountList, accountItem, onExistDone } = props;
  const isEditMode = !_.isNull(accountItem);

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
        res = await accountApi.createAccountInfo(params);
      }else {
        res = await accountApi.createStoreInfo(params)
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
        const res = await accountApi.updateAccountInfo(params);
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
        const res = await accountApi.updateStoreInfo(params);
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
          id: accountItem ? accountItem.id : '',
          name: accountItem ? accountItem.name : '',
          enabled: accountItem ? accountItem.enabled : '',
          phone: accountItem ? accountItem.phone : '',
          address: accountItem ? accountItem.address : '',
          password: accountItem ? accountItem.password : '',
          avatar: accountItem ? accountItem.avatar : '',
          avatarLink: accountItem
            ? Utils.getFullUrl(accountItem.avatar)
            : AppResource.images.imgDefaultAvatar,
          email: accountItem ? accountItem.email : '',
          description: accountItem ? accountItem.description : ''
        }}
        // validationSchema={Yup.object({
        //   name: Yup.string().required(t('Required')),
        //   fullname: Yup.string().required(t('Required')),
        //   password: isEditMode
        //     ? null
        //     : Yup.string()
        //         .required(t('Required'))
        //         .min(6, t('ThePasswordMustContainAtLeast6Characters'))
        //         .matches(/^\S*$/, t('ThePasswordMustNotContainWhitespace')),
        //   phone: Yup.string().required(t('Required')),
        // })}
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
                <Modal.Title>{accountItem ? t('EditAccount') : t('Newaccount')}</Modal.Title>
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
                            {t('Email')} <span className="text-danger">(*)</span>
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
                                placeholder={`${_.capitalize(t('Email'))}...`}
                                type={KTFormInputType.text}
                              // disabled={!canEdit}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>
                    {/* username */}
                    {isEditMode ? (<div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('IsEnabled')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="enabled"
                        inputElement={
                          <FastField name="enabled">
                            {({ field, form, meta }) => (
                              <KTFormSelect
                                options={[
                                  {
                                    name: "Chưa kích hoạt",
                                    value: 0
                                  },
                                  {
                                    name: "Đã kích hoạt",
                                    value: 1
                                  }
                                ]}
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
                                type={KTFormInputType.text}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>) : null}

                    {/* password */}
                    {!isEditMode ? (
                      <div className="col-12">
                        <KTFormGroup
                          label={
                            <>
                              {t('Password')} <span className="text-danger">(*)</span>
                            </>
                          }
                          inputName="password"
                          inputElement={
                            <FastField name="password">
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
                                  placeholder={`${_.capitalize(t('Password'))}...`}
                                  type={KTFormInputType.password}
                                />
                              )}
                            </FastField>
                          }
                        />
                      </div>
                    ) : null}

                    {/* avatar */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Avatar')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="avatar"
                        inputElement={
                          <FastField name="avatar">
                            {({ field, form, meta }) => (
                              <KTImageInput
                                name={field.name}
                                value={field.value}
                                onChange={(value) => {
                                  form.setFieldValue(field.name, value);
                                }}
                                onFocus={() => {
                                  form.setFieldTouched(field.name, true);
                                }}
                                enableCheckValid
                                isValid={_.isEmpty(meta.error)}
                                isTouched={meta.touched}
                                feedbackText={meta.error}
                                // defaultImage={AppResource.images.imgDefaultAvatar}
                                acceptImageTypes={AppConfigs.acceptImages}
                                onSelectedFile={(file) => {
                                  form.setFieldValue('avatar', file);
                                }}
                                onRemovedFile={() => {
                                  form.setFieldValue('avatar', null);
                                }}
                                additionalClassName=""
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
                            {t('name')} <span className="text-danger">(*)</span>
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
                                placeholder={`${_.capitalize(t('Fullname'))}...`}
                                type={KTFormInputType.text}
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
                            {t('Phone')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="phone"
                        inputElement={
                          <FastField name="phone">
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
                                placeholder={`${_.capitalize(t('Phone'))}...`}
                                type={KTFormInputType.telephone}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* address */}
                    <div className="col-12">
                      <KTFormGroup
                        label={<>{t('Address')}</>}
                        inputName="address"
                        inputElement={
                          <FastField name="address">
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
                                placeholder={`${_.capitalize(t('Address'))}...`}
                                type={KTFormInputType.text}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* description for bookstore */}
                    {
                      role == "USER" ? null : (
                        <div className="col-12">
                          <KTFormGroup
                            label={<>{t('Description')}</>}
                            inputName="desription"
                            inputElement={
                              <FastField name="description">
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
                                    placeholder={`${_.capitalize(t('Description'))}...`}
                                    type={KTFormInputType.text}
                                  />
                                )}
                              </FastField>
                            }
                          />
                        </div>
                      )
                    }
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

export default ModalAccountEdit;
