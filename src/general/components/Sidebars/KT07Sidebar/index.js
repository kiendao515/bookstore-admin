import KTLayoutAsideMenu from 'assets/plugins/aside/aside-menu';
import AppResource from 'general/constants/AppResource';
import useRouter from 'hooks/useRouter';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const menuItems = [
    { type: 'section', text: 'Service' },
    { type: 'item', text: 'DigitalSignature', icon: 'fad fa-signature', path: '/digital-signature' },
    {
        type: 'item', text: 'eContract', icon: 'fad fa-file-signature', path: '/e-contract', subMenuItems: [
            { type: 'item', text: 'Statistic', icon: 'fad fa-analytics', path: '/e-contract/dashboard' },
            { type: 'item', text: 'Dealers', icon: 'fad fa-building', path: '/e-contract/dealers' },
            { type: 'item', text: 'Customers', icon: 'fad fa-user-alt', path: '/e-contract/customers' },
            { type: 'item', text: 'Contracts', icon: 'fad fa-file-contract', path: '/e-contract/contracts' },
            { type: 'item', text: 'Transactions', icon: 'fad fa-coin', path: '/e-contract/transactions' },
            { type: 'item', text: 'Mail Sending Histories', icon: 'fad fa-mail-bulk', path: '/e-contract/mail-sending-histories' },
            { type: 'item', text: 'Consulting Information', icon: 'fad fa-info-circle', path: '/e-contract/consulting-information' },
            { type: 'item', text: 'Reports', icon: 'fad fa-browser', path: '/e-contract/reports' },
            { type: 'item', text: 'Service Packs', icon: 'fad fa-box-alt', path: '/e-contract/service-packs' },
            { type: 'item', text: 'Payment Accounts', icon: 'fad fa-credit-card', path: '/e-contract/payment-accounts' },
            { type: 'item', text: 'FAQs', icon: 'fad fa-question', path: '/e-contract/faqs' },
        ]
    },
    { type: 'item', text: 'eInvoice', icon: 'fad fa-file-invoice', path: '/e-invoice' },
    { type: 'item', text: 'SocialInsurance', icon: 'fad fa-hospitals', path: '/social-insurance' },
    { type: 'section', text: 'Other' },
    { type: 'item', text: 'Notifications', icon: 'fad fa-bell', path: '/notifications' },
    { type: 'item', text: 'Promotions', icon: 'fad fa-ad', path: '/promotions' },
];

function KT07Sidebar(props) {
    // MARK: --- Params ---
    const router = useRouter();
    const pathName = router.pathname;
    const { t } = useTranslation();

    // MARK: --- Hooks ---
    useEffect(() => {
        // Init Aside
        if (KTLayoutAside !== undefined) {
            KTLayoutAside.init('kt_aside');
        }

        // Init Aside Toggle
        if (KTLayoutAsideToggle !== undefined) {
            KTLayoutAsideToggle.init("kt_aside_toggle");
        }

        // Init Aside Menu
        if (KTLayoutAsideMenu !== undefined) {
            KTLayoutAsideMenu.init('kt_aside_menu');
        }
    }, []);

    return (
        <div className='aside aside-left aside-fixed' id='kt_aside'>
            {/* Aside Header */}
            <div className="aside-brand h-80px px-7 flex-shrink-0">
                {/* logo */}
                <a href='#' className='aside-logo'>
                    <img className="max-h-40px" src={AppResource.icons.keens.logo2} alt="logo" />
                </a>
                {/* button toggle */}
                <button className="aside-toggle btn btn-sm btn-icon-white px-0 border-0" id="kt_aside_toggle">
                    <span className="svg-icon svg-icon svg-icon-xl">
                        <img src={AppResource.icons.keens.toggleRight} alt="toggle" />
                    </span>
                </button>
            </div>

            {/* Aside Menu */}
            <div
                id='kt_aside_menu'
                className='aside-menu my-5'
                data-menu-scroll='1' // enable scroll
                data-menu-vertical='1'
            // data-menu-dropdown-timeout='500'
            >
                {/* Nav menu */}
                <ul className='menu-nav'>
                    {
                        menuItems.map((item, index) => {
                            // Item
                            if (item?.type === 'item') {
                                const hasSubMenuLV1Items = item?.subMenuItems !== undefined;

                                return (
                                    <li
                                        key={index}
                                        className={`menu-item ${hasSubMenuLV1Items && 'menu-item-submenu'} ${hasSubMenuLV1Items && item.path.length > 0 && pathName.includes(item.path) && 'menu-item-open'} ${!hasSubMenuLV1Items && item.path.length > 0 && pathName.includes(item.path) && 'menu-item-active'}`}
                                    >
                                        <Link
                                            to={item?.path}
                                            className={`menu-link ${hasSubMenuLV1Items && 'menu-toggle'}`}
                                        >
                                            <span className='sgv-icon menu-icon'><i className={`${item?.icon} text-white`} /></span>
                                            <span className='menu-text'>{t(item?.text)}</span>
                                            {
                                                item?.label && (
                                                    <span className='menu-label'>
                                                        <span className='label label-rounded label-danger label-inline'>{item?.label}</span>
                                                    </span>
                                                )
                                            }
                                            {
                                                hasSubMenuLV1Items && (
                                                    <i className='menu-arrow' />
                                                )
                                            }
                                        </Link>
                                        {/* Sub menu items level 1 */}
                                        {
                                            hasSubMenuLV1Items && (
                                                <div className="menu-submenu">
                                                    <ul className="menu-subnav">
                                                        {
                                                            item?.subMenuItems?.map((subItemLV1, subIndexLV1) => {
                                                                const hasSubMenuLV2Items = subItemLV1?.subMenuItems !== undefined;

                                                                return (
                                                                    <li
                                                                        key={subIndexLV1}
                                                                        className={`menu-item ${hasSubMenuLV2Items && 'menu-item-submenu'} ${hasSubMenuLV2Items && subItemLV1.path.length > 0 && pathName.includes(subItemLV1.path) && 'menu-item-open'} ${!hasSubMenuLV2Items && subItemLV1.path.length > 0 && pathName.includes(subItemLV1.path) && 'menu-item-active'}`}
                                                                    >
                                                                        <Link
                                                                            className={`menu-link rounded-0 ${hasSubMenuLV2Items && 'menu-toggle'}`}
                                                                            to={subItemLV1?.path}
                                                                        >
                                                                            {
                                                                                subItemLV1?.icon ? (
                                                                                    <span className='sgv-icon menu-icon'><i className={`${subItemLV1?.icon} text-white`} /></span>
                                                                                ) : (
                                                                                    <i className="menu-bullet menu-bullet-dot"><span></span></i>
                                                                                )
                                                                            }
                                                                            <span className="menu-text">{t(subItemLV1?.text)}</span>
                                                                            {
                                                                                subItemLV1?.label && (
                                                                                    <span className='menu-label'>
                                                                                        <span className='label label-rounded label-danger label-inline'>{subItemLV1?.label}</span>
                                                                                    </span>
                                                                                )
                                                                            }
                                                                            {
                                                                                hasSubMenuLV2Items && (
                                                                                    <i className='menu-arrow' />
                                                                                )
                                                                            }
                                                                        </Link>
                                                                        {/* Sub menu items level 2 */}
                                                                        {
                                                                            hasSubMenuLV2Items && (
                                                                                <div className="menu-submenu">
                                                                                    <ul className="menu-subnav">
                                                                                        {
                                                                                            subItemLV1?.subMenuItems?.map((subItemLV2, subIndexLV2) => {
                                                                                                const hasSubMenuLV3Items = subItemLV2?.subMenuItems !== undefined;

                                                                                                return (
                                                                                                    <li
                                                                                                        key={subIndexLV2}
                                                                                                        className={`menu-item ${hasSubMenuLV3Items && 'menu-item-submenu'} ${hasSubMenuLV3Items && subItemLV2.path.length > 0 && pathName.includes(subItemLV2.path) && 'menu-item-open'} ${!hasSubMenuLV3Items && subItemLV2.path.length > 0 && pathName.includes(subItemLV2.path) && 'menu-item-active'}`}
                                                                                                    >
                                                                                                        <Link
                                                                                                            className={`menu-link rounded-0 ${hasSubMenuLV3Items && 'menu-toggle'}`}
                                                                                                            to={subItemLV2?.path}
                                                                                                        >
                                                                                                            <i className="menu-bullet menu-bullet-dot"><span></span></i>
                                                                                                            <span className="menu-text">{t(subItemLV2?.text)}</span>
                                                                                                            {
                                                                                                                subItemLV2?.label && (
                                                                                                                    <span className='menu-label'>
                                                                                                                        <span className='label label-rounded label-danger label-inline'>{subItemLV2?.label}</span>
                                                                                                                    </span>
                                                                                                                )
                                                                                                            }
                                                                                                            {
                                                                                                                hasSubMenuLV3Items && (
                                                                                                                    <i className='menu-arrow' />
                                                                                                                )
                                                                                                            }
                                                                                                        </Link>
                                                                                                        {/* Sub menu items level 3 */}
                                                                                                        {
                                                                                                            hasSubMenuLV3Items && (
                                                                                                                <div className="menu-submenu">
                                                                                                                    <ul className="menu-subnav">
                                                                                                                        {
                                                                                                                            subItemLV2?.subMenuItems?.map((subItemLV3, subIndexLV3) => {
                                                                                                                                const hasSubMenuLV4Items = subItemLV3?.subMenuItems !== undefined;

                                                                                                                                return (
                                                                                                                                    <li
                                                                                                                                        key={subIndexLV3}
                                                                                                                                        className={`menu-item ${hasSubMenuLV4Items && 'menu-item-submenu'} ${hasSubMenuLV4Items && subItemLV3.path.length > 0 && pathName.includes(subItemLV3.path) && 'menu-item-open'} ${!hasSubMenuLV4Items && subItemLV3.path.length > 0 && pathName.includes(subItemLV3.path) && 'menu-item-active'}`}
                                                                                                                                    >
                                                                                                                                        <Link
                                                                                                                                            className={`menu-link rounded-0 ${hasSubMenuLV4Items && 'menu-toggle'}`}
                                                                                                                                            to={subItemLV3?.path}
                                                                                                                                        >
                                                                                                                                            <i className="menu-bullet menu-bullet-dot"><span></span></i>
                                                                                                                                            <span className="menu-text">{t(subItemLV3?.text)}</span>
                                                                                                                                            {
                                                                                                                                                subItemLV3?.label && (
                                                                                                                                                    <span className='menu-label'>
                                                                                                                                                        <span className='label label-rounded label-danger label-inline'>{subItemLV3?.label}</span>
                                                                                                                                                    </span>
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                            {
                                                                                                                                                hasSubMenuLV4Items && (
                                                                                                                                                    <i className='menu-arrow' />
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                        </Link>
                                                                                                                                        {/* Sub menu items level 4 */}
                                                                                                                                    </li>
                                                                                                                                )
                                                                                                                            })
                                                                                                                        }
                                                                                                                    </ul>
                                                                                                                </div>
                                                                                                            )
                                                                                                        }
                                                                                                    </li>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </li>
                                )
                            }

                            // Section
                            if (item?.type === 'section') {
                                return (
                                    <li
                                        key={index}
                                        className='menu-section'
                                    >
                                        <h4 className="menu-text">{t(item?.text)}</h4>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
            </div>
        </div>
    );
}

export default KT07Sidebar;