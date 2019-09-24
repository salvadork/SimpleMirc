import {
  createStore
} from "redux";
let reducer = (state, action) => {
  if (action.type === "login-success") {
    return {
      ...state,
      loggedIn: true
    };
  }
  if (action.type === "set-messages") {
    return {
      ...state,
      msgs: action.messages
    };
  }
  if (action.type === "delete") {
    return {
      ...state,
      deleteUser: action.username
    };
  }
  if (action.type === "log-out") {
    return {
      ...state,
      loggedIn: false
    };
  }
  if (action.type === "active-users") {
    return {
      ...state,
      activeUsers: action.messages
    };
  }
  if (action.type === "query") {
    return {
      ...state,
      searchQuery: action.q
    };
  }
  return state;
};
const store = createStore(
  reducer, {
    msgs: [],
    loggedIn: false,
    deleteUser: "",
    activeUsers: [],
    searchQuery: ""
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;