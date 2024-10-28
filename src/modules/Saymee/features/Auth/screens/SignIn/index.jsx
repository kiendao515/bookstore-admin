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
            const { data, errors } = res;
            if (errors === null) {
                ToastHelper.showSuccess(`${t('Hello')}, ${UserHelper.getDisplayName(data)}`);
                router.navigate('/');
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
        <div className="d-flex flex-column flex-root min-vh-100" style={{
            backgroundImage: `url(${AppResource.images.imgBgAuth})`,
            backgroundSize: 'cover'
        }}>
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
                                src={AppResource.icons.keens.logo2}
                            // style={{
                            //     filter: 'invert(96%) sepia(38%) saturate(59%) hue-rotate(118deg) brightness(109%) contrast(100%)',
                            // }}
                            />
                            <div className='font-size-h2 font-weight-boldest text-center text-white' style={{
                                width: '80%'
                            }}>{t('SaymeeText')}</div>
                        </div>
                    </div>
                </div>
                {/* end::Aside */}

                {/* begin::Content */}
                <div className="login-content flex-row-fluid d-flex flex-column p-10 bg-transparent">
                    {/* begin::Top */}
                    <div className="text-right d-flex justify-content-center align-items-center">
                        <div className="top-signin text-right d-flex justify-content-end pb-lg-0">
                            <span className="font-weight-bold text-white font-size-h5">{`${t('ChangeLanguage')}`}</span>
                            {/* <a href="#" className="font-weight-bold text-primary font-size-h5 ml-2" id="kt_login_signup">{t('Help')}</a> */}
                        </div>
                        {/* Language */}
                        <div className="">
                            {/* Languages */}
                            <Dropdown
                                isOpen={languageMenuVisible}
                                toggle={toggleLanguageMenu}
                                className="ml-2"
                            >
                                <DropdownToggle caret={false} className="border-0 p-0 bg-transparent">
                                    <div className="topbar-item" data-toggle="dropdown" data-offset="10px,0px" aria-expanded={`${languageMenuVisible ? 'true' : 'false'}`}>
                                        <a href='#' className="btn btn-icon btn-bg-white btn-hover-primary btn-icon-primary btn-circle btn-dropdown" onClick={toggleLanguageMenu}>
                                            <img className="h-20px w-20px rounded-circle" src={currentAppLanguageItem.icon} alt="" />
                                        </a>
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu className='py-4'>
                                    {
                                        AppData.languages.map((item, index) => {
                                            return (
                                                <DropdownItem
                                                    key={index}
                                                    active={item.code === currentAppLanguageItem.code}
                                                    onClick={() => {
                                                        handleChangedLanguage(item.code);
                                                    }}
                                                >
                                                    <span className="symbol symbol-20 mr-3">
                                                        <img src={item.icon} alt="" />
                                                    </span>
                                                    <span className="navi-text">{t(item.title)}</span>
                                                </DropdownItem>
                                            );
                                        })
                                    }
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    {/* end::Top */}

                    {/* begin::Wrapper */}
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