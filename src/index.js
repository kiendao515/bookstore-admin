import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './app/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/styles/keen/theme01/style.bundle.css';
import 'assets/styles/keen/theme01/plugins.bundle.css';
import 'assets/styles/app.style.scss';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <I18nextProvider>
      <App />
    </I18nextProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
