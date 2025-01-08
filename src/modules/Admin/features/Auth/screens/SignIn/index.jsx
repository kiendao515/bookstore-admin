import { unwrapResult } from '@reduxjs/toolkit';
import { thunkSignIn } from 'app/authSlice';
import 'assets/styles/login-3.css';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import ToastHelper from 'general/helpers/ToastHelper';
import UserHelper from 'general/helpers/UserHelper';
import useRouter from 'hooks/useRouter';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import SignInForm from '../../components/SignInForm';
import './style.scss';

const sTag = '[SignInScreen]';

function SignInScreen(props) {
    // MARK: --- Params ---
    const router = useRouter();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    let currentAppLanguage = i18n.language;
    if (!currentAppLanguage) {
        currentAppLanguage = 'vi';
    }
    let currentAppLanguageItem = AppData.languages.find(item => currentAppLanguage.indexOf(item.code) !== -1);
    if (!currentAppLanguageItem) {
        currentAppLanguageItem = AppData.languages[0];
    }
    const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
    const { isSigningIn } = useSelector(state => state.auth);

    // MARK: --- Functions ---
    async function handleSubmit(values) {
        if (isSigningIn || values === null || values === undefined) {
            return;
        }
        // const sha256Password = Utils.sha256(values.password);
        // const params = { ...values, password: sha256Password };
        const params = { ...values }
        try {
            const res = unwrapResult(await dispatch(thunkSignIn(params)));
            console.log("res", res)
            const { data, result, error_message} = res;
            console.log({ data, result });
            if (result) {
                console.log("hmm")
                ToastHelper.showSuccess(`${t('Hello')}, ${UserHelper.getDisplayName(data)}`);
                router.navigate('/');
            }else{
                ToastHelper.showError(error_message)
            }
        } catch (error) {
            console.log({ error });
        }
    }

    function handleSignInGoogle() {
        console.log(`${sTag} on sign in Google`);
    }

    function handleChangedLanguage(lang) {
        setLanguageMenuVisible(false);
        i18n.changeLanguage(lang);
    }

    function toggleLanguageMenu() {
        setLanguageMenuVisible(!languageMenuVisible);
    }

    // MARK: --- Hooks ---
    return (
        <div className="d-flex flex-column flex-root min-vh-100">
            {/* begin::Sign In */}
            <div className="login login-3 wizard d-flex flex-column flex-lg-row flex-column-fluid bg-transparent">
                {/* begin::Aside */}
                <div className="login-aside d-flex flex-column flex-row-auto SignIn_Aside position-relative bg-transparent" style={{
                    boxShadow: 'none'
                }}>
                    {/* bg-radial-gradient-dark */}
                    <div className='w-100 h-100 SignIn_AsideBG d-flex align-items-center justify-content-center justify-content-lg-end bg-transparent overflow-hidden'>
                        <div className='p-10 d-flex flex-column align-items-center' style={{
                            width: "80%"
                        }}>
                            <img
                                className='mb-6 px-10'
                                style={{
                                    width: '80%'
                                }}
                                alt='logo'
                                src={AppResource.icons.icLogoICorpLight}
                            // style={{
                            //     filter: 'invert(96%) sepia(38%) saturate(59%) hue-rotate(118deg) brightness(109%) contrast(100%)',
                            // }}
                            />
                        </div>
                    </div>
                </div>
                {/* end::Aside */}

                {/* begin::Content */}
                <div className="login-content flex-row-fluid d-flex flex-column p-10 bg-transparent">
                    <div className="d-flex flex-row-fluid flex-center justify-content-center justify-content-lg-start">
                        {/* begin::Sign In */}
                        <div className="login-form">
                            {/* begin: Form */}
                            <SignInForm
                                onSubmit={handleSubmit}
                                onSignInGoogle={handleSignInGoogle}
                            />
                            {/* end: Form */}
                        </div>
                        {/* end::Sign In */}
                    </div>
                    {/* end::Wrapper */}
                </div>
                {/* end::Content */}
            </div>
            {/* end::Sign In */}
        </div>
    );
}

export default SignInScreen;