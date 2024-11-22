// Toast
import store from 'app/store';
import AppToast from 'general/components/AppToast';
import { Suspense, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
// router
import GuestRoute from 'general/components/AppRoutes/GuestRoute';
import PrivateRoute from 'general/components/AppRoutes/PrivateRoute';
import KTPageError01 from 'general/components/OtherKeenComponents/KTPageError01';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Admin from 'modules/Admin';
import SignInScreen from 'modules/Admin/features/Auth/screens/SignIn';

// Load BS
require('bootstrap/dist/js/bootstrap.min');
// Load KT plugins
require('assets/plugins/ktutil');
require('assets/plugins/ktmenu');
require('assets/plugins/ktoffcanvas');
require('assets/plugins/ktcookie');
require('assets/plugins/kttoggle');
// aside
require('assets/plugins/aside/aside');
require('assets/plugins/aside/aside-menu');
require('assets/plugins/aside/aside-toggle');
// header
require('assets/plugins/header/ktheader-mobile');
require('assets/plugins/header/ktheader-topbar');

window.$ = window.jQuery = require('jquery');
window.moment = require('moment');

const sTag = '[App]';

function App() {
  // MARK: --- Hooks ---
  useEffect(() => {
    console.log(`${sTag} did load`);

    return () => {
      console.log(`${sTag} will dismiss`);
    };
  }, []);

  return (
    <>
      {/* Router */}
      <BrowserRouter>
        {/* Suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* <Route path="/*" element={<Navigate to="/admin" />} /> */}

            {/* hop dong dien tu */}
            <Route
              path="/*"
              element={
                <PrivateRoute roles={['STORE']}>
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route path='/login' element={<SignInScreen />} />


            <Route path="*" element={<KTPageError01 />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* Toast */}
      <AppToast />
    </>
  );
}

export default App;
