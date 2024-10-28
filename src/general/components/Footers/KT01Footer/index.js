import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppConfigs from 'general/constants/AppConfigs';

KT01Footer.propTypes = {

};

function KT01Footer(props) {
    // MARK: --- Params ---
    const { t } = useTranslation();

    return (
        <div
            id='kt_footer'
            className='footer bg-white py-4 d-flex flex-lg-column'
        >
            <div className='container d-flex flex-column flex-md-row align-items-center justify-content-between'>
                {/* copyright */}
                <div className='text-dark order-2 order-md-1'>
                    <span className='text-dark font-weight-bold mr-2'>2022©</span>
                    <a
                        className='text-dark-75 text-hover-primary'
                        target='_blank'
                        href={AppConfigs.homepage}
                    >Mobifone</a>
                </div>

                {/* nav */}
                <div className="nav nav-dark">
                    <a href={AppConfigs.aboutUrl} target="_blank" className="nav-link pl-0 pr-2 text-dark">{t('About')}</a>
                    <a href={AppConfigs.productUrl} target="_blank" className="nav-link pr-2 text-dark">{t('Products')}</a>
                    <a href={AppConfigs.contactUrl} target="_blank" className="nav-link pr-0 text-dark">{t('Contact')}</a>
                </div>
            </div>
        </div>
    );
}

export default KT01Footer;