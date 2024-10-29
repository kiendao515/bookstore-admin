import categoryApi from 'api/categoryApi';
import { FastField, Formik } from 'formik';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, {
  KTFormInputType,
} from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import ToastHelper from 'general/helpers/ToastHelper';
import Global from 'general/utils/Global';
import Utils from 'general/utils/Utils';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { thunkGetListCategory } from '../../categorySlice';

ModalResetPasswordEmployee.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  employeeItem: PropTypes.object,
  onExistDone: PropTypes.func,
};

ModalResetPasswordEmployee.defaultProps = {
  show: false,
  onClose: null,
  employeeItem: null,
  onExistDone: null,
};

/**
 *
 * @param {{
 * show: boolean,
 * onClose: function,
 * employeeItem: object,
 * onExistDone: function,
 * }} props
 * @returns
 */
function ModalResetPasswordEmployee(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose, employeeItem, onExistDone } = props;

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

  // MARK: ---- request reset password ----
  async function requestResetPassword(values) {
    try {
      let params = { ...values };
      params.password = Utils.sha256(params.password);
      const res = await categoryApi.updateEmployee(params);
      const { result } = res;
      if (result == 'success') {
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
          accountId: employeeItem ? employeeItem.accountId : '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={Yup.object({
          password: Yup.string()
            .required(t('Required'))
            .min(6, t('ThePasswordMustContainAtLeast6Characters'))
            .matches(/^\S*$/, t('ThePasswordMustNotContainWhitespace')),
          confirmPassword: Yup.string()
            .required(t('Required'))
            .oneOf([Yup.ref('password'), null], t('PasswordsDoNotMatch')),
        })}
        enableReinitialize
        onSubmit={(values) => {
          requestResetPassword(values);
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
                <Modal.Title>{employeeItem ? t('EditEmployee') : t('NewEmployee')}</Modal.Title>
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
                    {/* password */}
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

                    {/* confirm password */}
                    <div className="col-12">
                      <KTFormGroup
                        label={
                          <>
                            {t('ReNewPassword')} <span className="text-danger">(*)</span>
                          </>
                        }
                        inputName="confirmPassword"
                        inputElement={
                          <FastField name="confirmPassword">
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
                                placeholder={`${_.capitalize(t('ReNewPassword'))}...`}
                                type={KTFormInputType.password}
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

export default ModalResetPasswordEmployee;
