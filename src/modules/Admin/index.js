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
import Dashboard from './features/Report';
<<<<<<< HEAD
import RevenueReport from './features/Revenue';
import OfflineOrderPage from './features/OfflineOrder/screens/OfflineOrderPage';
=======
import RevenueHomePage from './features/Revenue/screens/RevenueHomePage';
>>>>>>> a48239a5ec41771828d7f96dd4224b8b82db78e6

function Admin(props) {
  // MARK: --- Props ---
  const { t } = useTranslation();

  return (
    <KT01BaseLayout>
      <div id="admin-container" className="container min-h-100">
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<Dashboard />} />
          <Route path="category/*" element={<CategoryHomePage />} />
          <Route path="book/*" element={<BookHomeScreen />} />
          <Route path="order/*" element={<OrderHomePage />} />
          <Route path="collection/*" element={<CollectionHomePage />} />
          <Route path="account/customer/*" element={<AccountHomePage />} />
          <Route path="account/partner/*" element={<PartnerHomePage />} />
          <Route path="report/*" element={<RevenueReport />} />
          <Route path="offline-order/*" element={<OfflineOrderPage />} />
=======
          <Route path="/" element={<Dashboard/>}/>
          <Route path="category/*" element={<CategoryHomePage/>} />
          <Route path="book/*" element={<BookHomeScreen/>} />
          <Route path = "order/*" element = {<OrderHomePage/>}/>
          <Route path ="collection/*" element = {<CollectionHomePage/>} />
          <Route path="account/customer/*" element={<AccountHomePage/>} />
          <Route path="account/partner/*" element={<PartnerHomePage/>} />
          <Route path= "report/*" element ={<RevenueHomePage/>}/>
>>>>>>> a48239a5ec41771828d7f96dd4224b8b82db78e6
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
