import categoryApi from 'api/categoryApi';
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
import _, { property } from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import AppResource from 'general/constants/AppResource';
import { useState } from 'react';
import { thunkGetListConfig } from '../../configSlice';
import KTFormSelect from 'general/components/OtherKeenComponents/Forms/KTFormSelect';
import configApi from 'api/configApi';

ModalEditConfig.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshCategoryList: PropTypes.func,
  categoryItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalEditConfig.defaultProps = {
  show: false,
  onClose: null,
  onRefreshCategoryList: null,
  categoryItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshCategoryList: function,
 * categoryItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalEditConfig(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, onRefreshCategoryList, categoryItem, onExistDone } = props;
  const isEditMode = !_.isNull(categoryItem);
  const [loading, setLoading] = useState(false);
  console.log(categoryItem);


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

  // Request create new employee
  async function requestCreateCategory(values) {
    try {
      let params = { ...values };
      // params.password = Utils.sha256(params.password);
      const res = await categoryApi.createCategory(params);
      const { result } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListConfig(Global.gFilterConfigList));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Request update new employee
  async function requestUpdateCategory(values) {
    try {
      let params = { ...values };
      const res = await configApi.updateConfig(params);
      const { result } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListConfig(Global.gFilterConfigList));
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
          id: categoryItem ? categoryItem.id : '',
          title: categoryItem ? categoryItem.title : '',
          property: categoryItem ? categoryItem.property : '',
          key: categoryItem ? categoryItem.key : '',
          value: categoryItem ? categoryItem.value : '',
        }}
        // validationSchema={Yup.object({
        //   name: Yup.string().required(t('Required')),
        //   description: Yup.string().required(t('Required')),
        //   num_of_books: isEditMode
        //     ? null
        //     : Yup.string()
        //       .required(t('Required'))
        //       .min(6, t('ThePasswordMustContainAtLeast6Characters'))
        //       .matches(/^\S*$/, t('ThePasswordMustNotContainWhitespace'))
        // })}
        enableReinitialize
        onSubmit={(values) => {
          console.log("thêm mới", values);
          setLoading(true);
          if (isEditMode) {
            requestUpdateCategory(values);
          } else {
            requestCreateCategory(values);
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
                <Modal.Title>{categoryItem ? t('EditCategory') : t('NewCategory')}</Modal.Title>
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
                            {t('Cấu hình')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="Cấu hình"
                        inputElement={
                          <FastField name="title">
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
                                placeholder={`${_.capitalize(t('Cấu hình'))}...`}
                                type={KTFormInputType.text}
                              // disabled={true}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>
                    {/* username */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Thuộc tính')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="property"
                        inputElement={
                          <FastField name="property">
                            {({ field, form, meta }) => (
                              <KTFormSelect
                                name={field.name}
                                isCustom
                                options={[{ name: "TEXT", value: 'TEXT' }, { name: "IMAGE", value: "IMAGE" }]}
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

                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('Key')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="Key"
                        inputElement={
                          <FastField name="key">
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
                                placeholder={`${_.capitalize(t('Key'))}...`}
                                type={KTFormInputType.text}
                                disabled={true}
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
                              {t('Value')} <span className="text-danger">(*)</span>
                            </>
                          }
                          inputName="Value"
                          inputElement={
                            <FastField name="value">
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
                                  placeholder={`${_.capitalize(t('Value'))}...`}
                                  type={KTFormInputType.text}
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
                    {loading ? (
                      <Spinner animation="border" size="sm" /> // Hiển thị loading spinner
                    ) : (
                      t('Save')
                    )}
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

export default ModalEditConfig;
