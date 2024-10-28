import AppConfigs from 'general/constants/AppConfigs';
import { useTranslation } from 'react-i18next';

function KT07Footer(props) {
    // MARK: --- Params ---
    const { t } = useTranslation();

    return (
        <div id='kt_footer' className='footer py-4 d-flex flex-lg-column'>
            <div className='container d-flex flex-column flex-md-row align-items-center justify-content-between'>
                {/* copyright */}
                <div className='text-dark order-2 order-md-1'>
                    <span className='text-muted font-weight-bold mr-2'>2022©</span>
                    <a href={AppConfigs.homepage} target='_blank' className='text-dark-75 text-hover-primary'>iCorp</a>
                </div>

                {/* nav */}
                <div className="nav nav-dark order-1 order-md-2 font-weight-bold">
                    <a href={AppConfigs.aboutUrl} target="_blank" className="nav-link pr-3 pl-0">{t('About')}</a>
                    <a href={AppConfigs.productUrl} target="_blank" className="nav-link px-3">{t('Products')}</a>
                    <a href={AppConfigs.contactUrl} target="_blank" className="nav-link pl-3 pr-0">{t('Contact')}</a>
                </div>
            </div>
        </div>
    );
}

export default KT07Footer;