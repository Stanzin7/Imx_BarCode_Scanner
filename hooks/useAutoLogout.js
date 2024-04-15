// hooks/useAutoLogout.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogout } from "../redux/reducers/userReducer"; // Make sure this path is correct

const useAutoLogout = (isLoggedIn) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        dispatch(setLogout());
      }, 120 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, dispatch]);
};

export default useAutoLogout;
