import KTBSDropdown, {
  KTBSDropdownAlignments,
} from 'general/components/OtherKeenComponents/KTBSDropdown';
import UserHelper from 'general/helpers/UserHelper';
import useRouter from 'hooks/useRouter';
import _ from 'lodash';
import DropdownAccountMenu from 'modules/Saymee/features/Auth/components/DropdownAccountMenu';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.scss';

function KT07Header(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const router = useRouter();
  const pathName = router.pathname;
  const arrPathNameItems = _.chain(pathName).split('/').compact().value();
  const headerTitle = _.chain(arrPathNameItems).last().capitalize().value();
  const currentLoggedInUser = useSelector((state) => state.auth?.current);

  return (
    <div className="header">
      <div className="container">
        <div className="d-flex align-items-center flex-wrap mr-1 mt-5 mt-lg-0">
          {/* Heading */}
          <div className="d-flex align-items-baseline flex-wrap mr-5">
            {/* Title */}
            <h4 className="text-dark font-weight-bold my-1 mr-5">{t(headerTitle)}</h4>
            {/* Breadcrumb */}
            {arrPathNameItems && arrPathNameItems.length > 0 && (
              <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                {arrPathNameItems.map((item, index) => {
                  const itemPath = _.chain([...arrPathNameItems])
                    .splice(0, index + 1)
                    .join('/')
                    .value();
                  return (
                    <li key={index} className="breadcrumb-item">
                      <Link to={`/${itemPath}`} className="text-muted">
                        {t(_.capitalize(item))}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Top bar */}
        <KTBSDropdown
          toggleElement={
            <div className="topbar">
              <div className="topbar-item">
                <div>
                  <span className="text-muted font-weight-bold mr-1">{`${t('Hello')}, `}</span>
                  <span className="text-dark-75 font-weight-bold mr-3">
                    {UserHelper.getDisplayName(currentLoggedInUser)}
                  </span>
                  <div className="btn btn-icon btn-bg-white btn-hover-primary btn-icon-primary btn-circle overflow-hidden">
                    <img
                      alt="avatar"
                      className="h-100 w-100 align-self-end"
                      style={{
                        objectFit: 'cover',
                      }}
                      src={UserHelper.getAccountAvatar(currentLoggedInUser)}
                    />
                  </div>
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
  );
}

export default KT07Header;
