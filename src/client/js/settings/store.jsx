import { createStore, applyMiddleware } from "redux";
import { reducer3 } from "./reducers";
/**
 * Redux Thunk middleware allows you to write action creators that return a function
 * instead of an action. The thunk can be used to delay the dispatch of an action,
 * or to dispatch only if a certain condition is met. The inner function receives
 * the store methods `dispatch` and `getState` as parameters.
 */
import thunk from "redux-thunk";
import logger from "../middlewares/logger";
/**
 * the unique store accepts one reducer of above
 * */
const configureStore = initialState => {
  const store = createStore(reducer3, initialState, applyMiddleware(thunk, logger));
  if (module.hot) {
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers").default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
};
export default configureStore;
