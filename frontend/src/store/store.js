import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';


// Check the current mode (development or production) and log it
if (import.meta.env.MODE === 'development') {
  console.log('You are in development mode');
} else if (import.meta.env.MODE === 'production') {
  console.log('You are in production mode');
}

const rootReducer = combineReducers({
  // ADD REDUCERS HERE
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
