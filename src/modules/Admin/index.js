import KT01BaseLayout from 'general/components/BaseLayout/KT01BaseLayout';
import Empty from 'general/components/Empty';
import AppResource from 'general/constants/AppResource';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';
import CategoryHomePage from './features/Category/screens/CategoryHomePage';
import AccountHomePage from './features/Account/screens/AccountHomePage';

function Admin(props) {
  // MARK: --- Props ---
  const { t } = useTranslation();

  return (
    <KT01BaseLayout>
      <div id="admin-container" className="container min-h-100">
        <Routes>
          <Route path="/" element={<Navigate to="account" />} />
          <Route path="category/*" element={<CategoryHomePage/>} />
          <Route path="account/*" element={<AccountHomePage/>} />

          <Route
            path="*"
            element={
              <Empty
                text={t('PageUnderConstruction')}
                buttonText={t('Refresh')}
                visible={false}
                imageEmpty={AppResource.images.errorStates.error404}
              />
            }
          />
        </Routes>
      </div>
    </KT01BaseLayout>
  );
}

export default Admin;
