import React from 'react';
import ReactDOM from 'react-dom/client'; //in method 1, it's just 'react-dom'
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';

const store = configureStore();

// Expose the store to the global window object only in development mode
// if (import.meta.env.MODE !== 'production') {
//   window.store = store;
// }

//Method 1 way of doing it:
if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
