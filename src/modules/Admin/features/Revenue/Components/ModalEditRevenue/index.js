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
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import AppResource from 'general/constants/AppResource';

import collectionApi from 'api/collectionApi';
import { thunkGetListRevenue } from '../../revenueSlice';

ModalEditRevenue.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onRefreshRevenueList: PropTypes.func,
  revenueItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalEditRevenue.defaultProps = {
  show: false,
  onClose: null,
  onRefreshRevenueList: null,
  revenueItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * onRefreshRevenueList: function,
 * revenueItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalEditRevenue(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, onRefreshRevenueList, revenueItem, onExistDone } = props;
  const isEditMode = !_.isNull(revenueItem);
  console.log(revenueItem);


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
  async function requestCreateCollection(values) {
    try {
      let params = { ...values };
      let cover_image = await Utils.uploadFile(values?.image)
      params.image = cover_image;
      // params.password = Utils.sha256(params.password);
      const res = await collectionApi.createCollection(params);
      const { result } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListRevenue(Global.gFiltersRevenueList));
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
      let cover_image = await Utils.uploadFile(values?.image)
      params.image = cover_image;
      const res = await collectionApi.updateCollection(params);
      const { result } = res;
      if (result == true) {
        ToastHelper.showSuccess(t('Success'));
        dispatch(thunkGetListRevenue(Global.gFiltersRevenueList));
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
          id: revenueItem ? revenueItem.id : '',
          book_name: revenueItem ? revenueItem.book?.name : '',
          inventory: revenueItem ? revenueItem.inventory : '',
          sold: revenueItem ? revenueItem.sold : '',
          settle: revenueItem ? revenueItem.settle : '',
          notSettle: revenueItem ? revenueItem.notSettle : '',
          commission_percentage: revenueItem ? revenueItem.commission_percentage: ''
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

          if (isEditMode) {
            requestUpdateCategory(values);
          } else {
            requestCreateCollection(values);
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
                <Modal.Title>{revenueItem ? t('Sửa bộ sưu tập') : t('Thêm mới bộ sưu tập')}</Modal.Title>
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
                            {t('Tên sách')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="tên"
                        inputElement={
                          <FastField name="book_name">
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
                                placeholder={`${_.capitalize(t('Tên sách'))}...`}
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
                                placeholder={`${_.capitalize(t('mô tả'))}...`}
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
                            {t('Bìa collection')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="image"
                        inputElement={
                          <FastField name="image">
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

export default ModalEditRevenue;
