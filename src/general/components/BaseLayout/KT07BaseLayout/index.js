import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import KT07Sidebar from 'general/components/Sidebars/KT07Sidebar';
import KT07HeaderMobile from 'general/components/Headers/KT07HeaderMobile';
import KT07Header from 'general/components/Headers/KT07Header';
import KT07Content from 'general/components/Contents/KT07Content';
import KT07Footer from 'general/components/Footers/KT07Footer';
import KTScrollTop from 'general/components/OtherKeenComponents/KTScrollTop';

KT07BaseLayout.propTypes = {

};

function KT07BaseLayout(props) {
    return (
        <div>
            {/* Header Mobile */}
            <KT07HeaderMobile />
            {/* Sidebar */}
            <KT07Sidebar />

            {/* Content */}
            <div className='d-flex flex-column flex-root'>
                <div className='d-flex flex-row flex-column-fluid page'>
                    <div id='kt_wrapper' className='d-flex flex-column flex-row-fluid wrapper'>
                        {/* Header */}
                        <KT07Header />

                        {/* Content */}
                        <KT07Content>
                            {props.children}
                        </KT07Content>

                        {/* Footer */}
                        <KT07Footer />
                    </div>
                </div>
            </div>

            {/* Scroll Top */}
            <KTScrollTop />
        </div>
    );
}

export default KT07BaseLayout;