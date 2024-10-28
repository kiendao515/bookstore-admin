import 'assets/styles/keen/theme01/layout/brand/dark.css';
import AppResource from 'general/constants/AppResource';
import { useEffect } from 'react';
import './style.scss';

function KT01HeaderMobile(props) {
    // MARK: --- Hooks ---
    useEffect(() => {
        // Init header mobile
        if (typeof KTLayoutHeaderMobile !== undefined) {
            KTLayoutHeaderMobile.init('kt_header_mobile');
        }

        // Init header mobile top bar
        if (typeof KTLayoutHeaderTopbar !== undefined) {
            KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
        }
    }, []);

    return (
        <div id='kt_header_mobile' className='header-mobile align-items-center header-mobile-fixed'>
            {/* logo */}
            <a href='#'>
                <img
                    className="h-25px"
                    src={AppResource.icons.icLogoICorpLight}
                    alt="logo"
                // style={{
                //     filter: 'invert(96%) sepia(38%) saturate(59%) hue-rotate(118deg) brightness(109%) contrast(100%)',
                // }}
                />
            </a>

            {/* toolbar */}
            <div className='d-flex align-items-center'>
                {/* button sidebar toggle */}
                <button
                    id='kt_aside_mobile_toggle'
                    className='btn p-0 burger-icon burger-icon-left'
                >
                    <span className='svg-icon svg-icon-xxl'></span>
                </button>

                {/* button header menu mobile */}
                {/* <button
                    id='kt_header_mobile_toggle'
                    className='btn p-0 burger-icon ml-5'
                >
                    <span className='svg-icon svg-icon-xxl'></span>
                </button> */}

                {/* button top bar menu toggle */}
                <button
                    id='kt_header_mobile_topbar_toggle'
                    className='btn btn-hover-text-primary p-0 ml-3 border-0 ml-5'
                >
                    <span className='svg-icon svg-icon-xl'>
                        <img
                            alt='avatar'
                            src={AppResource.icons.keens.user}
                        />
                    </span>
                </button>
            </div>
        </div>
    );
}

export default KT01HeaderMobile;