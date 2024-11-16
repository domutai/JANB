// import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import thunk from 'redux-thunk';
// import sessionReducer from './session'; //Phase 1


// // Check the current mode (development or production) and log it
// if (import.meta.env.MODE === 'development') {
//   console.log('You are in development mode');
// } else if (import.meta.env.MODE === 'production') {
//   console.log('You are in production mode');
// }

// const rootReducer = combineReducers({
//   // ADD REDUCERS HERE
//   session: sessionReducer, //Phase 1
// });

// let enhancer;
// if (import.meta.env.MODE === "production") {
//   enhancer = applyMiddleware(thunk);
// } else {
//   //const logger = (await import("redux-logger")).default;
//   // Dynamically import redux-logger only in development mode
//   import("redux-logger").then((module) => {
//     const logger = module.default;
//     const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   enhancer = composeEnhancers(applyMiddleware(thunk, logger));

//   const store = createStore(rootReducer, enhancer);
//   });
// }

// const configureStore = (preloadedState) => {
//   if (enhancer) {
//   return createStore(rootReducer, preloadedState, enhancer);
//   }
// };

// export default configureStore;


//USING NEW REDUX
// Importing Redux Toolkit's configureStore instead of createStore
import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session';  // Import your session reducer

// Check the current mode (development or production) and log it (optional)
if (import.meta.env.MODE === 'development') {
  console.log('You are in development mode');
} else if (import.meta.env.MODE === 'production') {
  console.log('You are in production mode');
}

// Create the Redux store with session reducer and the default middleware
const store = configureStore({
  reducer: {
    session: sessionReducer,  // Add session reducer here
  },
  // Redux Toolkit includes redux-thunk and redux-logger by default (in development mode)
  // You can add additional middleware if needed here
});

export default store;  // Export the store
