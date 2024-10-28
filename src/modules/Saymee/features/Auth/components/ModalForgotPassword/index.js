import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { FastField, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal } from 'react-bootstrap';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, { KTFormInputType } from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import authApi from 'api/authApi';
import ToastHelper from 'general/helpers/ToastHelper';
import Utils from 'general/utils/Utils';

ModalForgotPassword.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
};

ModalForgotPassword.defaultProps = {
    show: false,
    onClose: null,
};

function ModalForgotPassword(props) {
    // MARK: --- Params ---
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {
        show,
        onClose,
    } = props;

    // MARK: --- Functions ---
    function handleClose() {
        if (onClose) {
            onClose();
        }
    }

    return (
        <div>
            <Formik
                initialValues={{
                    email: '',
                    hasCode: false,
                    code: '',
                    newPassword: '',
                    reNewPassword: '',
                }}
                validationSchema={
                    Yup.object({
                        email: Yup.string().required(t('EmailIsRequired')).email(t('EmailNotValid')),
                        code: Yup.string().when('hasCode', {
                            is: hasCode => hasCode === true,
                            then: Yup.string().required(t('CodeIsRequired'))
                        }),
                        newPassword: Yup.string().when('hasCode', {
                            is: hasCode => hasCode === true,
                            then: Yup.string().required(t('NewPasswordIsRequired')).min(6, t('Short_Password')),
                        }),
                        reNewPassword: Yup.string().when('hasCode', {
                            is: hasCode => hasCode === true,
                            then: Yup.string().required(t('ReNewPasswordIsRequired')).oneOf([Yup.ref('newPassword')], t('NewPasswordNotMatch')),
                        }),
                    })
                }
                enableReinitialize
                onSubmit={async (values, { setFieldValue, setFieldTouched }) => {
                    if (!values.hasCode) {
                        // gui yc lay code
                        const email = values.email;
                        try {
                            const res = await authApi.requestResetPassword(email);
                            const { result } = res;
                            if (result === 'success') {
                                ToastHelper.showSuccess(t('RequestResetPasswordSuccess'));
                                setFieldValue('hasCode', true);
                                setFieldTouched('code', false);
                                setFieldTouched('newPassword', false);
                                setFieldTouched('reNewPassword', false);
                            }
                        } catch (error) {
                            console.log(`Request reset password error: ${error?.message}`);
                        }
                    } else {
                        const email = values.email;
                        const code = values.code;
                        const newPassword = values.newPassword;

                        try {
                            const res = await authApi.resetPassword(email, Utils.sha256(code), Utils.sha256(newPassword));
                            const { result } = res;
                            if (result === 'success') {
                                ToastHelper.showSuccess(t('ResetPasswordSuccess'));
                                handleClose();
                            }
                        } catch (error) {
                            console.log(`Reset password error: ${error?.message}`);
                        }
                    }
                }}
            >
                {
                    formikProps => (
                        <Modal
                            className=''
                            show={show}
                            onHide={handleClose}
                            centered
                            onExit={() => {
                                formikProps.handleReset();
                            }}
                        >
                            <Modal.Header className='px-5 py-5'>
                                <Modal.Title>
                                    {t('ForgotPassword')}
                                </Modal.Title>
                                <div
                                    className="btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer"
                                    onClick={() => {
                                        handleClose();
                                    }}
                                >
                                    <i className="far fa-times"></i>
                                </div>
                            </Modal.Header>

                            <Modal.Body>
                                <div className='d-flex flex-column align-items-center justify-content-center'>
                                    <i className='fad fa-user text-primary fa-6x' />
                                    {
                                        !formikProps.values.hasCode ? (
                                            <p className='mt-2 text-center'>{t('ForgotPasswordStep1')}</p>
                                        ) : (
                                            <p className='mt-2 text-center'>{t('ForgotPasswordStep2')}</p>
                                        )
                                    }

                                </div>
                                <div className='row'>
                                    {
                                        !formikProps.values.hasCode ? (
                                            <div className='col-12'>
                                                {/* email */}
                                                <KTFormGroup
                                                    label={(<>{t('Email')} <span className='text-danger'>(*)</span></>)}
                                                    inputName='email'
                                                    additionalClassName='mb-0'
                                                    inputElement={(
                                                        <FastField name='email'>
                                                            {
                                                                ({ field, form, meta }) => (
                                                                    <KTFormInput
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

                                                                        type={KTFormInputType.text}
                                                                        placeholder={`${_.capitalize(t("Email"))}...`}
                                                                    />
                                                                )
                                                            }
                                                        </FastField>
                                                    )}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div className='col-12'>
                                                    <KTFormGroup
                                                        label={(<>{t('Code')} <span className='text-danger'>(*)</span></>)}
                                                        inputName='code'
                                                        inputElement={(
                                                            <FastField name='code'>
                                                                {
                                                                    ({ field, form, meta }) => (
                                                                        <KTFormInput
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

                                                                            type={KTFormInputType.text}
                                                                            placeholder={`${_.capitalize(t("Code"))}...`}
                                                                        />
                                                                    )
                                                                }
                                                            </FastField>
                                                        )}
                                                    />
                                                </div>
                                                {/* mat khau moi */}
                                                <div className='col-12'>
                                                    <KTFormGroup
                                                        label={(<>{t('NewPassword')} <span className='text-danger'>(*)</span></>)}
                                                        inputName='newPassword'
                                                        inputElement={(
                                                            <FastField name='newPassword'>
                                                                {
                                                                    ({ field, form, meta }) => (
                                                                        <KTFormInput
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

                                                                            type={KTFormInputType.password}
                                                                            placeholder={`${_.capitalize(t("NewPassword"))}...`}
                                                                        />
                                                                    )
                                                                }
                                                            </FastField>
                                                        )}
                                                    />
                                                </div>
                                                {/* nhap lai mat khau moi */}
                                                <div className='col-12'>
                                                    <KTFormGroup
                                                        label={(<>{t('ReNewPassword')} <span className='text-danger'>(*)</span></>)}
                                                        inputName='reNewPassword'
                                                        additionalClassName='mb-0'
                                                        inputElement={(
                                                            <FastField name='reNewPassword'>
                                                                {
                                                                    ({ field, form, meta }) => (
                                                                        <KTFormInput
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

                                                                            type={KTFormInputType.password}
                                                                            placeholder={`${_.capitalize(t("ReNewPassword"))}...`}
                                                                        />
                                                                    )
                                                                }
                                                            </FastField>
                                                        )}
                                                    />
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                            </Modal.Body>

                            <Modal.Footer>
                                <div className='w-100 d-flex row'>
                                    {
                                        <Button className='font-weight-bold flex-grow-1 col mr-3' variant="secondary" onClick={handleClose}>
                                            {t('Cancel')}
                                        </Button>
                                    }
                                    <Button className={`font-weight-bold flex-grow-1 col ml-3`} variant="primary" onClick={() => {
                                        formikProps.handleSubmit();
                                    }}>
                                        {!formikProps.values.hasCode ? t('GetCode') : t('ChangePassword')}
                                    </Button>
                                </div>
                            </Modal.Footer>
                        </Modal>
                    )
                }
            </Formik>
        </div >
    );
}

export default ModalForgotPassword;