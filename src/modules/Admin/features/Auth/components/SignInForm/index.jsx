import { Field, Form, Formik } from 'formik';
import AppResource from 'general/constants/AppResource';
import BigInputField from 'general/custom-fields/BigInputField';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";
import * as Yup from 'yup';
import ModalForgotPassword from '../ModalForgotPassword';

SignInForm.propTypes = {
    onSubmit: PropTypes.func,
    onSignInGoogle: PropTypes.func,
};

SignInForm.defaultProps = {
    onSubmit: null,
    onSignInGoogle: null,
}

function SignInForm(props) {
    // MARK: --- Params ---
    const { t } = useTranslation();
    const initialValues = {
        email: '',
        password: '',
    }
    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t('Email không đúng định dạng')).required(t('Bạn chưa nhập email')),
        password: Yup.string().trim().required(t('Bạn chưa nhập mật khẩu')),//.min(6, t('PasswordLengthMin')),
    });
    const { onSubmit, onSignInGoogle } = props;
    const { isSigningIn } = useSelector(state => state.auth);
    const [showModalForgotPassword, setShowModalForgotPassword] = useState(false);

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {formikProps => {
                    const { values, errors, touched, isSubmitting } = formikProps;

                    return (
                        <Form>

                            {/* begin: Title */}
                            <div className="pb-5 pb-lg-15">
                                <h3 className="font-weight-bolder font-size-h2 font-size-h1-lg">{t('Chào mừng tới trang quản trị Hộp')}</h3>
                            </div>
                            {/* end: Title */}

                            <Field                              
                                name="email"
                                component={BigInputField}
                                type="email"
                                label={t('Email')}
                                placeholder={`${t('Email')}...`}
                            />

                            <Field
                                name="password"
                                component={BigInputField}
                                type="password"
                                label={t('Password')}
                                placeholder={`${t('Password')}...`}
                                appendLabelElement={(
                                    <a href='#' className='font-size-lg font-weight-bolder mb-2' style={{
                                        textDecorationLine: 'underline'
                                    }} onClick={(e) => {
                                        e.preventDefault();
                                        setShowModalForgotPassword(true);
                                    }}>
                                        {`${t('Quên mật khẩu')}?`}
                                    </a>
                                )}
                            />

                            <div className="pb-lg-0 pb-5 hover">
                                <button
                                    type="submit"
                                    className={`btn btn-primary font-weight-bolder font-size-h6 py-4 my-3 px-10 hover-opacity-80 d-flex flex-row align-items-center`}
                                >
                                    {isSigningIn && (<ClipLoader color='#fff' className='mr-3' size={20} />)} {t('Đăng nhập')}
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>

            {/* Modal forgot password */}
            <ModalForgotPassword
                show={showModalForgotPassword}
                onClose={() => {
                    setShowModalForgotPassword(false);
                }}
            />
        </div>
    );
}

export default SignInForm;