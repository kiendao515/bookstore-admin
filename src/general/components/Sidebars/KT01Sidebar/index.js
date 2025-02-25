import 'assets/styles/keen/theme01/layout/aside/dark.css';
import AppConfigs from 'general/constants/AppConfigs';
import AppResource from 'general/constants/AppResource';
import UserHelper from 'general/helpers/UserHelper';
import Utils from 'general/utils/Utils';
import useRouter from 'hooks/useRouter';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.scss';

function KT01Sidebar(props) {
  // MARK: --- Params ---
  const router = useRouter();
  const pathName = router.pathname;
  const { t } = useTranslation();
  const currentAccount = useSelector((state) => state.auth.user);
  console.log(currentAccount);

  const menuItems = useMemo(() => {
    return currentAccount?.role === "ADMIN" ? [
      { type: 'section', text: t("Thống kê") },
      {
        type: 'item',
        text: t("Thống kê"),
        icon: 'fa-solid fa-chart-simple',
        path: "/"
      },
      {
        type: 'item',
        text: t("Báo cáo"),
        icon: 'fas fa-qrcode',
        path: "/report"
      },

      { type: 'section', text: t("Quản lý sách") },
      {
        type: 'item',
        text: t("Category"),
        icon: 'fa-solid fa-list',
        path: '/category',
      },
      {
        type: 'item',
        text: t("Collection"),
        icon: 'fas fa-qrcode',
        path: "/collection"
      },
      {
        type: 'item',
        text: t("BookInfo"),
        icon: "fa-solid fa-book",
        path: '/book',
      },
      { type: 'section', text: t("AccountManagement") },
      {
        type: 'item',
        text: t("UserAccount"),
        icon: "fa-regular fa-user",
        path: '/account/customer'
      },
      {
        type: 'item',
        text: t("BookStoreAccount"),
        icon: "fa-solid fa-store",
        path: '/account/partner'
      },
      {
        type: 'section',
        text: t("OrderManagement"),
      },
      {
        type: 'item',
        text: t("GeneralReport"),
        icon: "fa-solid fa-box",
        path: '/order',
      },
      {
        type: 'item',
        text: t("Bán hàng offline"),
        icon: 'fa-solid fa-cart-shopping',
        path: '/offline-order',
      },
      {
        type: 'section',
        text: t("Quản lí cấu hình"),
      },
      {
        type: 'item',
        text: t("Cấu hình"),
        icon: "fa-solid fa-gear",
        path: '/config',
      },
    ] : [
      { type: 'section', text: t("Thống kê") },
      {
        type: 'item',
        text: t("Báo cáo tồn kho"),
        icon: 'fas fa-qrcode',
        path: "/report"
      },

    ];
  }, [currentAccount]);

  // MARK: --- Hooks ---
  useEffect(() => {
    // Init Aside
    if (KTLayoutAside !== undefined) {
      KTLayoutAside.init('kt_aside');
    }

    // Init Aside Toggle
    if (KTLayoutAsideToggle !== undefined) {
      KTLayoutAsideToggle.init('kt_aside_toggle');
    }

    // Init Aside Menu
    if (KTLayoutAsideMenu !== undefined) {
      KTLayoutAsideMenu.init('kt_aside_menu');
    }
  }, []);

  useEffect(() => { }, [currentAccount]);

  return (
    <div className="aside aside-left aside-fixed d-flex flex-column flex-row-auto" id="kt_aside">
      {/* Aside Header */}
      <div className="brand flex-column-auto">
        {/* logo */}
        <a href="#" className="brand-logo">
          <img
            className="h-25px"
            src={AppResource.icons.icLogoICorpLight}
            alt="logo"
          // style={{
          //     filter: 'invert(96%) sepia(38%) saturate(59%) hue-rotate(118deg) brightness(109%) contrast(100%)',
          // }}
          />
        </a>
        <span className="">Hiệu sách Hộp</span>
        {/* button toggle */}
        <button className="brand-toggle btn btn-sm px-0 border-0" id="kt_aside_toggle">
          <span className="svg-icon svg-icon svg-icon-xl">
            <img src={AppResource.icons.keens.toggleRight} alt="toggle" />
          </span>
        </button>
      </div>

      {/* Aside Menu */}
      <div
        id="kt_aside_menu"
        className="aside-menu my-0"
        data-menu-scroll="1" // enable scroll
        data-menu-vertical="1"
      // data-menu-dropdown-timeout='500'
      >
        {/* Nav menu */}
        <ul className="menu-nav pt-0">
          {menuItems.map((item, index) => {
            // Item
            if (item?.type === 'item') {
              const hasSubMenuLV1Items = item?.subMenuItems !== undefined;

              return (
                <li
                  key={index}
                  className={`menu-item ${hasSubMenuLV1Items && 'menu-item-submenu'} ${hasSubMenuLV1Items &&
                    item?.path?.length > 0 &&
                    pathName.includes(item.path) &&
                    'menu-item-open'
                    } ${!hasSubMenuLV1Items &&
                    item?.path?.length > 0 &&
                    pathName === item.path &&
                    'menu-item-active'
                    }`}
                >
                  <Link
                    to={item?.path}
                    onClick={(e) => {
                      if (Utils.checkFullUrl(item?.path)) {
                        e.preventDefault();
                        Utils.openInNewTab(item?.path);
                      }
                    }}
                    className={`menu-link ${hasSubMenuLV1Items && 'menu-toggle'}`}
                  >
                    <span className="sgv-icon menu-icon">
                      <i className={`${item?.icon} text-white`} />
                    </span>
                    <span className="menu-text">{t(item?.text)}</span>
                    {item?.label && (
                      <span className="menu-label">
                        <span className="label label-rounded label-danger label-inline">
                          {item?.label}
                        </span>
                      </span>
                    )}
                    {hasSubMenuLV1Items && <i className="menu-arrow" />}
                  </Link>
                  {/* Sub menu items level 1 */}
                  {hasSubMenuLV1Items && (
                    <div className="menu-submenu">
                      <ul className="menu-subnav">
                        {item?.subMenuItems?.map((subItemLV1, subIndexLV1) => {
                          const hasSubMenuLV2Items = subItemLV1?.subMenuItems !== undefined;

                          return (
                            <li
                              key={subIndexLV1}
                              className={`menu-item ${hasSubMenuLV2Items && 'menu-item-submenu'} ${hasSubMenuLV2Items &&
                                subItemLV1.path.length > 0 &&
                                pathName.includes(subItemLV1.path) &&
                                'menu-item-open'
                                } ${!hasSubMenuLV2Items &&
                                subItemLV1.path.length > 0 &&
                                pathName.includes(subItemLV1.path) &&
                                'menu-item-active'
                                }`}
                            >
                              <Link
                                className={`menu-link rounded-0 ${hasSubMenuLV2Items && 'menu-toggle'
                                  }`}
                                to={subItemLV1?.path}
                              >
                                <i className="menu-bullet menu-bullet-dot">
                                  <span></span>
                                </i>
                                <span className="menu-text">{t(subItemLV1?.text)}</span>
                                {subItemLV1?.label && (
                                  <span className="menu-label">
                                    <span className="label label-rounded label-danger label-inline">
                                      {subItemLV1?.label}
                                    </span>
                                  </span>
                                )}
                                {hasSubMenuLV2Items && <i className="menu-arrow" />}
                              </Link>
                              {/* Sub menu items level 2 */}
                              {hasSubMenuLV2Items && (
                                <div className="menu-submenu">
                                  <ul className="menu-subnav">
                                    {subItemLV1?.subMenuItems?.map((subItemLV2, subIndexLV2) => {
                                      const hasSubMenuLV3Items =
                                        subItemLV2?.subMenuItems !== undefined;

                                      return (
                                        <li
                                          key={subIndexLV2}
                                          className={`menu-item ${hasSubMenuLV3Items && 'menu-item-submenu'
                                            } ${hasSubMenuLV3Items &&
                                            subItemLV2.path.length > 0 &&
                                            pathName.includes(subItemLV2.path) &&
                                            'menu-item-open'
                                            } ${!hasSubMenuLV3Items &&
                                            subItemLV2.path.length > 0 &&
                                            pathName.includes(subItemLV2.path) &&
                                            'menu-item-active'
                                            }`}
                                        >
                                          <Link
                                            className={`menu-link rounded-0 ${hasSubMenuLV3Items && 'menu-toggle'
                                              }`}
                                            to={subItemLV2?.path}
                                          >
                                            <i className="menu-bullet menu-bullet-dot">
                                              <span></span>
                                            </i>
                                            <span className="menu-text">{t(subItemLV2?.text)}</span>
                                            {subItemLV2?.label && (
                                              <span className="menu-label">
                                                <span className="label label-rounded label-danger label-inline">
                                                  {subItemLV2?.label}
                                                </span>
                                              </span>
                                            )}
                                            {hasSubMenuLV3Items && <i className="menu-arrow" />}
                                          </Link>
                                          {/* Sub menu items level 3 */}
                                          {hasSubMenuLV3Items && (
                                            <div className="menu-submenu">
                                              <ul className="menu-subnav">
                                                {subItemLV2?.subMenuItems?.map(
                                                  (subItemLV3, subIndexLV3) => {
                                                    const hasSubMenuLV4Items =
                                                      subItemLV3?.subMenuItems !== undefined;

                                                    return (
                                                      <li
                                                        key={subIndexLV3}
                                                        className={`menu-item ${hasSubMenuLV4Items && 'menu-item-submenu'
                                                          } ${hasSubMenuLV4Items &&
                                                          subItemLV3.path.length > 0 &&
                                                          pathName.includes(subItemLV3.path) &&
                                                          'menu-item-open'
                                                          } ${!hasSubMenuLV4Items &&
                                                          subItemLV3.path.length > 0 &&
                                                          pathName.includes(subItemLV3.path) &&
                                                          'menu-item-active'
                                                          }`}
                                                      >
                                                        <Link
                                                          className={`menu-link rounded-0 ${hasSubMenuLV4Items && 'menu-toggle'
                                                            }`}
                                                          to={subItemLV3?.path}
                                                        >
                                                          <i className="menu-bullet menu-bullet-dot">
                                                            <span></span>
                                                          </i>
                                                          <span className="menu-text">
                                                            {t(subItemLV3?.text)}
                                                          </span>
                                                          {subItemLV3?.label && (
                                                            <span className="menu-label">
                                                              <span className="label label-rounded label-danger label-inline">
                                                                {subItemLV3?.label}
                                                              </span>
                                                            </span>
                                                          )}
                                                          {hasSubMenuLV4Items && (
                                                            <i className="menu-arrow" />
                                                          )}
                                                        </Link>
                                                        {/* Sub menu items level 4 */}
                                                      </li>
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            }

            // Section
            if (item?.type === 'section') {
              return (
                <li key={index} className="menu-section mt-0">
                  <h4 className="menu-text">{t(item?.text)}</h4>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
}

export default KT01Sidebar;
