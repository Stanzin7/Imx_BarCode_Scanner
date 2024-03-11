import { combineReducers } from "redux";
import enititiesReducer from "./enitites";
import userReducer from "./userReducer";

export default combineReducers({
  entities: enititiesReducer,
  user: userReducer,
});
