import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Authentication from "../authentication/Authentication";
import useAutoLogout from "../hooks/useAutoLogout";
import Tabs from "./Tabs";

const Routes = () => {
  const isLoggedIn = useSelector((state) => state.user.user !== null);
  useAutoLogout(isLoggedIn);
  console.log(isLoggedIn);

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? <Tabs /> : <Authentication />}
      {/* <Tabs /> */}
    </View>
  );
};

export default Routes;
