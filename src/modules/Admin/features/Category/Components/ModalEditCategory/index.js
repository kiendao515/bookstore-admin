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
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { thunkGetListCategory } from '../../categorySlice';
import AppResource from 'general/constants/AppResource';
import { useState } from 'react';

ModalEditCategory.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshCategoryList: PropTypes.func,
  categoryItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalEditCategory.defaultProps = {
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
function ModalEditCategory(props) {
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
        dispatch(thunkGetListCategory(Global.gFiltersCategoryList));
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
      const res = await categoryApi.updateCategory(params);
      const { result } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListCategory(Global.gFiltersCategoryList));
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
          name: categoryItem ? categoryItem.name : '',
          description: categoryItem ? categoryItem.description : '',
          num_of_books: categoryItem ? categoryItem.num_of_books : ''
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
                            {t('Danh mục')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="Danh mục"
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
                                placeholder={`${_.capitalize(t('Danh mục'))}...`}
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
                            {t('Mô tả')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="Mô tả"
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
                                placeholder={`${_.capitalize(t('Username'))}...`}
                                type={KTFormInputType.text}
                              />
                            )}
                          </FastField>
                        }
                      />
                    </div>

                    {/* fullname */}
                    {
                      isEditMode ? <div className="col-12">
                        <KTFormGroup
                          label={
                            <>
                              {t('Số lượng sách')} <span className="text-danger">(*)</span>
                            </>
                          }
                          inputName="Số lượng sách"
                          inputElement={
                            <FastField name="num_of_books">
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
                                  disabled={true}
                                />
                              )}
                            </FastField>
                          }
                        />
                      </div> : null
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

export default ModalEditCategory;
