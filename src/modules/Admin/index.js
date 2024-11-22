import KT01BaseLayout from 'general/components/BaseLayout/KT01BaseLayout';
import Empty from 'general/components/Empty';
import AppResource from 'general/constants/AppResource';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';
import CategoryHomePage from './features/Category/screens/CategoryHomePage';
import AccountHomePage from './features/Account/screens/AccountHomePage';
import PartnerHomePage from './features/Account/screens/PartnerHomePage';
import BookHomeScreen from './features/Book/screens/BookHomeScreen';
import CollectionHomePage from './features/Collection/screens/CollectionHomePage';
import OrderHomePage from './features/Order/screens/OrderHomePage';

function Admin(props) {
  // MARK: --- Props ---
  const { t } = useTranslation();

  return (
    <KT01BaseLayout>
      <div id="admin-container" className="container min-h-100">
        <Routes>
          {/* <Route path="/" element={<Navigate to="account" />} /> */}
          <Route path="category/*" element={<CategoryHomePage/>} />
          <Route path="book/*" element={<BookHomeScreen/>} />
          <Route path = "order/*" element = {<OrderHomePage/>}/>
          <Route path ="collection/*" element = {<CollectionHomePage/>} />
          <Route path="account/customer/*" element={<AccountHomePage/>} />
          <Route path="account/partner/*" element={<PartnerHomePage/>} />
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
