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
        username: '',
        password: '',
    }
    const validationSchema = Yup.object().shape({
        // username: Yup.string().email(t('EmailNotValid')).required(t('EmailIsRequired')),
        password: Yup.string().trim().required(t('PasswordIsRequired')),//.min(6, t('PasswordLengthMin')),
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
                                <h3 className="font-weight-bolder text-white font-size-h2 font-size-h1-lg">{t('Saymee')}</h3>
                                <div className="text-white-50 font-weight-bold font-size-h5">{`${t('AdminPage')}`}
                                    {/* <a href="#" className="text-primary font-weight-bolder ml-2">{t('Register')}</a> */}
                                </div>
                            </div>
                            {/* end: Title */}

                            <Field
                                name="username"
                                component={BigInputField}
                                label={t('Username')}
                                placeholder={`${t('Username')}...`}
                            />

                            <Field
                                name="password"
                                component={BigInputField}
                                type="password"
                                label={t('Password')}
                                placeholder={`${t('Password')}...`}
                                appendLabelElement={(
                                    <a href='#' className='text-white font-size-lg font-weight-bolder mb-2' style={{
                                        textDecorationLine: 'underline'
                                    }} onClick={(e) => {
                                        e.preventDefault();
                                        setShowModalForgotPassword(true);
                                    }}>
                                        {`${t('ForgotPassword')}?`}
                                    </a>
                                )}
                            />

                            <div className="pb-lg-0 pb-5 hover">
                                <button
                                    type="submit"
                                    className={`btn btn-primary font-weight-bolder font-size-h6 py-4 my-3 px-10 hover-opacity-80 d-flex flex-row align-items-center`}
                                    style={{
                                        backgroundColor: AppResource.colors.feature,
                                        border: 0
                                    }}
                                >
                                    {isSigningIn && (<ClipLoader color='#fff' className='mr-3' size={20} />)} {t('SignIn')}
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