import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AppResource from 'general/constants/AppResource';
import KTLayoutHeaderTopbar from 'assets/plugins/header/ktheader-topbar';

KT07HeaderMobile.propTypes = {

};

function KT07HeaderMobile(props) {
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
        <div id='kt_header_mobile' className='header-mobile'>
            {/* logo */}
            <a href='#'>
                <img
                    className="max-h-30px"
                    src={AppResource.icons.keens.logo2}
                    alt="logo"
                />
            </a>

            {/* toolbar */}
            <div>
                <button
                    id='kt_aside_mobile_toggle'
                    className='btn btn-icon btn-icon-white btn-hover-icon-white'
                >
                    <span className='svg-icon svg-icon-xxl'>
                        <img
                            alt='toggle'
                            src={AppResource.icons.keens.toggleRight}
                        />
                    </span>
                </button>
                <button
                    id='kt_header_mobile_topbar_toggle'
                    className='btn btn-icon btn-icon-white btn-hover-icon-white ml-1'
                >
                    <span className='svg-icon svg-icon-xxl'>
                        <i className='fad fa-user' />
                    </span>
                </button>
            </div>
        </div>
    );
}

export default KT07HeaderMobile;