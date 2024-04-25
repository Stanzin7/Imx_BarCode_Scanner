// hooks/useAutoLogout.js
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setLogout } from "../redux/reducers/userReducer"; // Make sure this path is correct

// const useAutoLogout = (isLoggedIn) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (isLoggedIn) {
//       const timer = setTimeout(() => {
//         dispatch(setLogout());
//       }, 120 * 60 * 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [isLoggedIn, dispatch]);
// };

// export default useAutoLogout;

// hooks/useAutoLogout.js
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setLogout } from "../redux/reducers/userReducer";
import { AppState, AppStateStatus } from "react-native";

const useAutoLogout = (isLoggedIn) => {
  const dispatch = useDispatch();
  const logoutTimerRef = useRef(null);
  const lastActiveTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        const currentTime = Date.now();
        const inactiveTime = currentTime - lastActiveTimeRef.current;
        if (inactiveTime >= 120 * 60 * 1000) {
          // 120 minutes in milliseconds
          dispatch(setLogout());
        } else {
          resetTimer();
        }
        lastActiveTimeRef.current = currentTime;
      }
    };

    const resetTimer = () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      logoutTimerRef.current = setTimeout(() => {
        dispatch(setLogout());
      }, 120 * 60 * 1000); // 120 minutes in milliseconds
    };

    if (isLoggedIn) {
      resetTimer();
      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
      return () => {
        subscription.remove();
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }
      };
    }
  }, [isLoggedIn, dispatch]);
};

export default useAutoLogout;
