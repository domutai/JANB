import React from 'react';
import ReactDOM from 'react-dom/client'; //in method 1, it's just 'react-dom'
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import store from './store';

import { restoreCSRF, csrfFetch } from './store/csrf';

import * as sessionActions from './store/session'; //Phase 1
import { Modal, ModalProvider } from './context/Modal';


if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions; //Phase 1
}

//Method 1 way of doing it:
// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
    <Provider store={store}>
      <App />
      <Modal />
    </Provider>
    </ModalProvider>
  </React.StrictMode>
);
