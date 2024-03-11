import { combineReducers } from "redux";
import enititiesReducer from "./enitites";

export default combineReducers({
  entities: enititiesReducer,
});
