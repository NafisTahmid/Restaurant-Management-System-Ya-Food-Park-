import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import {
  productListReducer,
  productDetailsReducer,
} from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  getUserReducer,
  loginReducer,
  registerReducer,
  updateProfileReducer,
  updateUserReducer,
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
} from "./reducers/userReducers";
import {
  createOrderReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderPayReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
  listProducts: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: loginReducer,
  userRegister: registerReducer,
  userDetails: userDetailsReducer,
  updateProfile: updateProfileReducer,
  userList: userListReducer,
  getUser: getUserReducer,
  updateUser: updateUserReducer,
  deleteUser: userDeleteReducer,
  createOrder: createOrderReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
});

const cartItemsFromStorage = (() => {
  try {
    const items = localStorage.getItem("cartItems");
    if (!items || items === "undefined" || items === "null") {
      return [];
    }
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return [];
  }
})();
const userInfoFromStorage = (() => {
  try {
    const info = localStorage.getItem("userLogin");
    if (!info || info === "undefined" || info === "null") {
      return null;
    }
    const parsed = JSON.parse(info);
    return parsed ? parsed : {};
  } catch (error) {
    console.warn("Error loading user info from storage", error);
    return {};
  }
})();
const shippingAddressFromStorage = (() => {
  try {
    const data = localStorage.getItem("shippingAddress");
    if (!data || data === "undefined" || data === "null") {
      return {};
    }
    const parsed = JSON.parse(data);
    return parsed ? parsed : {};
  } catch (error) {
    console.warn("Error loading shipping address from storage", error);
    return {};
  }
})();
const paymentInfoFromStorage = (() => {
  try {
    const data = localStorage.getItem("paymentMethod");
    if (!data || data === "undefined" || data === "null") {
      return {};
    }
    const parsed = JSON.parse(data);
    return parsed ? parsed : {};
  } catch (error) {
    console.warn("Error loading data from storage", error);
    return {};
  }
})();
const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentInfoFromStorage,
  },
  userLogin: {
    userInfo: userInfoFromStorage,
  },
};
const middleware = [thunk];

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware)),
);

export default store;
