import 'assets/styles/keen/theme01/layout/header/base/light.css';
import 'assets/styles/keen/theme01/layout/header/menu/dark.css';
import KTBSDropdown, {
  KTBSDropdownAlignments,
} from 'general/components/OtherKeenComponents/KTBSDropdown';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import LanguageHelper from 'general/helpers/LanguageHelper';
import UserHelper from 'general/helpers/UserHelper';
import useRouter from 'hooks/useRouter';
import _ from 'lodash';
import DropdownAccountMenu from 'modules/Admin/features/Auth/components/DropdownAccountMenu';
// import OffcanvasSearch from 'modules/Admin/features/Dashboard/components/OffcanvasSearch';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import './style.scss';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';


//     {
//         text: 'Pages', path: '', subMenuItems: [
//             { text: 'My Account', icon: AppResource.icons.keens.briefcase, path: '' },
//             { text: 'Task Manager', icon: AppResource.icons.keens.briefcase, path: '', label: '2' },
//             {
//                 text: 'Team Manager', icon: AppResource.icons.keens.cmd, path: '', subMenuItems: [
//                     { text: 'Add Team Member', path: '' },
//                     { text: 'Edit Team Member', path: '' },
//                     { text: 'Delete Team Member', path: '' },
//                     { text: 'Team Member Reports', path: '' },
//                     { text: 'Assign Tasks', path: '' },
//                     { text: 'Promote Team Member', path: '' },
//                 ]
//             },
//             {
//                 text: 'Projects Manager', icon: AppResource.icons.keens.mailbox, path: '', subMenuItems: [
//                     { text: 'Latest Projects', path: '' },
//                     { text: 'Ongoing Projects', path: '' },
//                     { text: 'Urgent Projects', path: '' },
//                     { text: 'Completed Projects', path: '' },
//                     { text: 'Dropped Projects', path: '' },
//                 ]
//             },
//             { text: 'Create New Project', icon: AppResource.icons.keens.spam, path: '' },
//         ]
//     },
//     {
//         text: 'Features', path: '', subMenuItems: [
//             {
//                 text: 'Task Reports', path: '', subMenuItems: [
//                     { text: 'Latest Tasks', path: '', icon: AppResource.icons.keens.briefcase },
//                     { text: 'Pending Tasks', path: '', icon: AppResource.icons.keens.crown },
//                     { text: 'Urgent Tasks', path: '', icon: AppResource.icons.keens.lockOverTurning },
//                     { text: 'Completed Tasks', path: '', icon: AppResource.icons.keens.thumbtack },
//                     { text: 'Failed Tasks', path: '', icon: AppResource.icons.keens.outgoingTask },
//                 ]
//             },
//             {
//                 text: 'Profit Margins', path: '', subMenuItems: [
//                     { text: 'Overall Profits', path: '' },
//                     { text: 'Gross Profits', path: '' },
//                     { text: 'Net Profits', path: '' },
//                     { text: 'Year to Date Reports', path: '' },
//                     { text: 'Quarterly Profits', path: '' },
//                     { text: 'Monthly Profits', path: '' },
//                 ]
//             },
//             {
//                 text: 'Staff Management', path: '', subMenuItems: [
//                     { text: 'Top Management', path: '' },
//                     { text: 'Project Managers', path: '' },
//                     { text: 'Development Staff', path: '' },
//                     { text: 'Customer Service', path: '' },
//                     { text: 'Sales and Marketing', path: '' },
//                     { text: 'Executives', path: '' },
//                 ]
//             },
//             {
//                 text: 'Tools', path: '', subMenuItems: [
//                     { text: 'Analytical Reports', path: '' },
//                     { text: 'Customer CRM', path: '' },
//                     { text: 'Operational Growth', path: '' },
//                     { text: 'Social Media Presence', path: '' },
//                     { text: 'Files and Directories', path: '' },
//                     { text: 'Audit & Logs', path: '' },
//                 ]
//             }
//         ]
//     },
//     {
//         text: 'Apps', path: '', subMenuItems: [
//             { text: 'Reporting', icon: AppResource.icons.keens.safeChat, path: '' },
//             {
//                 text: 'Social Presence', icon: AppResource.icons.keens.send, path: '', subMenuItems: [
//                     { text: 'Reached Users', path: '' },
//                     { text: 'SEO Ranking', path: '' },
//                     { text: 'User Dropout Points', path: '' },
//                     { text: 'Market Segments', path: '' },
//                     { text: 'Opportunity Growth', path: '' },
//                 ]
//             },
//             { text: 'Sales & Marketing', icon: AppResource.icons.keens.mailAt, path: '' },
//             { text: 'Campaigns', icon: AppResource.icons.keens.chatLocked, path: '', label: '3' },
//             {
//                 text: 'Development Center', icon: AppResource.icons.keens.groupChat, path: '', subMenuItems: [
//                     { text: 'Merge Branch', path: '', label: '3' },
//                     { text: 'Version Controls', path: '' },
//                     { text: 'Database Manager', path: '' },
//                     { text: 'System Settings', path: '' },
//                 ]
//             }
//         ]
//     }
// ];
const menuItems = [];

function KT01Header(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const router = useRouter();
  const pathName = router.pathname;
  const arrPathNameItems = _.chain(pathName).split('/').compact().value();
  const headerTitle = _.chain(arrPathNameItems).last().capitalize().value();
  const currentLoggedInUser = useSelector((state) => state.auth?.current);
  const [newOrder, setNewOrder] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  useEffect(() => {
    const socket = new SockJS(process.env.REACT_APP_BASE_URL + '/socket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe(`/topic/order`, (message) => {
        const order = JSON.parse(message.body);
        console.log('New Order:', order);  // Log the order info
        setNewOrder(order);
        setUnreadNotifications((prevCount) => prevCount + 1);

        // Show notification
        notification.open({
          duration:10000,
          message: 'Đơn hàng mới',
          description: `Có một đơn hàng mới: ${order.order_code}`,
          icon: <BellOutlined style={{ color: '#108ee9' }} />,
        });
      });
    };

    // Activate the WebSocket connection
    stompClient.activate();

    // Cleanup on component unmount
    return () => {
      stompClient.deactivate();
    };
  }, []);
  // MARK: --- Hooks ---
  useEffect(() => {
    new KTOffcanvas('kt_header_menu_wrapper', {
      baseClass: 'header-menu-wrapper',
      overlay: true,
      // closeBy: '',
      toggleBy: {
        target: 'kt_header_mobile_toggle',
      },
    });

    if (KTMenu !== undefined) {
      new KTMenu('kt_header_menu', {
        submenu: {
          desktop: 'dropdown',
          tablet: 'accordion',
          mobile: 'accordion',
        },
      });
    }
  }, []);

  return (
    <div id="kt_header" className="header header-fixed">
      <div className="container-fluid d-flex align-items-stretch justify-content-between">
        {/* Header menu wrapper */}
        <div id="kt_header_menu_wrapper" className="header-menu-wrapper header-menu-wrapper-left">
          {/* header menu */}
          <div
            id="kt_header_menu"
            className="header-menu header-menu-mobile header-menu-layout-default"
          >
            {/* date & time */}
            <h4 className="d-flex flex-column align-items-start justify-content-center text-primary font-weight-bolder mb-0">
              {moment().format('DD/MM/YYYY')}{' '}
              <small className="text-dark mt-1">{_.capitalize(moment().format('dddd'))}</small>
            </h4>
            {/* menu nav */}
            <ul className="menu-nav">
              {menuItems.map((item, index) => {
                const hasSubMenuLV1Items = item?.subMenuItems !== undefined;

                return (
                  <li
                    key={index}
                    className="menu-item menu-item-submenu menu-item-rel menu-item-open-dropdown"
                    data-menu-toggle="click"
                  >
                    <a href="#" className="menu-link menu-toggle">
                      <span className="menu-text">{item.text}</span>
                      <i className="menu-arrow" />
                    </a>
                    {/* Sub menu items level 1 */}
                    {hasSubMenuLV1Items && (
                      <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                        <ul className="menu-subnav">
                          {item?.subMenuItems?.map((subItemLV1, subIndexLV1) => {
                            const hasSubMenuLV2Items = subItemLV1?.subMenuItems !== undefined;

                            return (
                              <li
                                key={subIndexLV1}
                                className={`menu-item ${hasSubMenuLV2Items && 'menu-item-submenu'}`}
                                data-menu-toggle="hover"
                              >
                                <a href="#" className="menu-link menu-toggle">
                                  {subItemLV1.icon ? (
                                    <span className="svg-icon menu-icon">
                                      <img alt="" src={subItemLV1.icon} className="w-20px h-20px" />
                                    </span>
                                  ) : (
                                    <i className="menu-bullet menu-bullet-dot">
                                      <span></span>
                                    </i>
                                  )}
                                  <span className="menu-text">{subItemLV1.text}</span>
                                  {subItemLV1?.label && (
                                    <span className="menu-label">
                                      <span className="label label-success label-rounded">
                                        {subItemLV1.label}
                                      </span>
                                    </span>
                                  )}
                                  {hasSubMenuLV2Items && <i className="menu-arrow" />}
                                </a>
                                {/* Sub menu items level 2 */}
                                {hasSubMenuLV2Items && (
                                  <div className="menu-submenu menu-submenu-classic menu-submenu-right">
                                    <ul className="menu-subnav">
                                      {subItemLV1?.subMenuItems?.map((subItemLV2, subIndexLV2) => {
                                        const hasSubMenuLV3Items =
                                          subItemLV2?.subMenuItems !== undefined;

                                        return (
                                          <li
                                            key={subIndexLV2}
                                            className={`menu-item ${hasSubMenuLV3Items && 'menu-item-submenu'
                                              }`}
                                            data-menu-toggle="hover"
                                          >
                                            <a href="#" className="menu-link menu-toggle">
                                              {subItemLV2.icon ? (
                                                <span className="svg-icon menu-icon">
                                                  <img
                                                    alt=""
                                                    src={subItemLV2.icon}
                                                    className="w-20px h-20px"
                                                  />
                                                </span>
                                              ) : (
                                                <i className="menu-bullet menu-bullet-line">
                                                  <span></span>
                                                </i>
                                              )}
                                              <span className="menu-text">{subItemLV2.text}</span>
                                              {subItemLV2?.label && (
                                                <span className="menu-label">
                                                  <span className="label label-success label-rounded">
                                                    {subItemLV2.label}
                                                  </span>
                                                </span>
                                              )}
                                              {hasSubMenuLV3Items && <i className="menu-arrow" />}
                                            </a>
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
              })}
            </ul>
          </div>
        </div>

        {/* Top bar */}
        <div className="topbar">
          {/* search */}
          {/* <KTBSDropdown
                        toggleElement={(
                            <div className='topbar-item'>
                                <div className='btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary enable-filter'>
                                    <img
                                        alt='search'
                                        src={AppResource.icons.keens.search}
                                    />
                                    <span className='pulse-ring'></span>
                                </div>
                            </div>
                        )}
                        alignment={KTBSDropdownAlignments.end}
                        autoCloseBehavior={KTBSDropdowAutoCloseBehavior.outside}
                        dropdownMenuClassName='dropdown-menu-lg py-0 mt-0'
                        contentEl={(
                            <AppSearch />
                        )}
                    /> */}
          <div className="topbar-item">
            <div
              className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary enable-filter"
              id="ButtonShowOffcanvasSearch"
            >
              <img alt="search" src={AppResource.icons.keens.search} />
              <span className="pulse-ring"></span>
            </div>
          </div>
          {/* language */}
          <KTBSDropdown
            toggleElement={
              <div className="topbar-item">
                <div className="btn btn-icon btn-clean btn-lg mr-1">
                  {/* <img
                                        alt='equalizer'
                                        src={AppResource.icons.keens.equalizer}
                                    /> */}
                  <img
                    alt="icon"
                    src={LanguageHelper.getCurrentLanguageIcon()}
                    className="w-25px h-25px rounded"
                  />
                </div>
              </div>
            }
            // alignment={KTBSDropdownAlignments.end}
            dropdownMenuClassName="dropdown-menu-sm"
            dropdownMenuItems={AppData.languageItems}
            selectedValue={LanguageHelper.getCurrentLanguage()}
            onChange={(newValue) => {
              LanguageHelper.changeLanguage(newValue);
            }}
          />
          {/* <div className='topbar-item'>
                        <div className='btn btn-icon btn-clean btn-lg pulse pulse-primary mr-1'>
                            <img
                                alt='compiling'
                                src={AppResource.icons.keens.compiling}
                            />
                            <span className='pulse-ring'></span>
                        </div>
                    </div>
                    <div className='topbar-item'>
                        <div className='btn btn-icon btn-clean btn-lg mr-1'>
                            <img
                                alt='equalizer'
                                src={AppResource.icons.keens.equalizer}
                            />
                        </div>
                    </div>
                    <div className='topbar-item'>
                        <div className='btn btn-icon btn-clean btn-lg mr-1'>
                            <img
                                alt='layout'
                                src={AppResource.icons.keens.layout4Blocks}
                            />
                        </div>
                    </div>
                    <div className='topbar-item'>
                        <div className='btn btn-icon btn-clean btn-lg mr-1'>
                            <img
                                alt='chat'
                                src={AppResource.icons.keens.chat}
                            />
                        </div>
                    </div> */}
          {/* account */}
          <KTBSDropdown
            toggleElement={
              <div className="topbar-item ml-4">
                <div className="d-flex align-items-center cursor-pointer">
                  <div>
                    <span className="text-dark font-weight-bold mr-1">{`${t('Hello')}, `}</span>
                    <span className="text-primary font-weight-bold mr-3">
                      {UserHelper.getDisplayName(currentLoggedInUser)}
                    </span>
                  </div>
                  <div className="btn btn-icon h-40px w-40px p-0 overflow-hidden hover-opacity-60 border-0">
                    <img
                      alt="avatar"
                      src={UserHelper.getAccountAvatar(currentLoggedInUser)}
                      className="h-100 w-100"
                      style={{
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = AppResource.icons.keens.userBlank;
                      }}
                    />
                  </div>
                  <div className="btn btn-icon h-40px w-40px p-0 overflow-hidden hover-opacity-60 border-0">
                    <BellOutlined
                      className="w-200 h-200"
                      style={{ color: unreadNotifications > 0 ? 'red' : 'black' }}
                    />
                    {unreadNotifications > 0 && (
                      <span className="badge badge-danger position-absolute top-0 right-0 badge-circle badge-pill">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            }
            alignment={KTBSDropdownAlignments.end}
            dropdownMenuClassName="py-0"
            contentEl={<DropdownAccountMenu />}
          />
        </div>
      </div>

      {/* Offcanvas search */}
      {/* <OffcanvasSearch
        id="OffcanvasSearch"
        toggleByElementId="ButtonShowOffcanvasSearch"
        position="right"
      /> */}
    </div>
  );
}

export default KT01Header;
