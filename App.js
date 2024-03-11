import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
// Image icons above
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Cart from "./screens/cart";
import Menu from "./screens/menu";
import Scanner from "./screens/scanner";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import KeyPad from "./screens/keyPad";
import { Provider } from "react-redux";
import Store, { perssistedStore } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Image } from "expo-image";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <PersistGate persistor={perssistedStore}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="scanner"
              options={{
                tabBarLabel: "Scan",
                headerTitle: "",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="barcode-scan"
                    size={size}
                    color={color}
                  />
                ),
              }}
              component={Scanner}
            />
            <Tab.Screen
              name="keyPad"
              options={{
                tabBarLabel: "KeyPad",
                headerTitle: "",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="keypad" color={color} size={size} />
                ),
              }}
              component={KeyPad}
            />
            <Tab.Screen
              name="cart"
              options={{
                tabBarLabel: "Cart",
                headerTitle: "",
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5
                    name="shopping-cart"
                    size={size}
                    color={color}
                  />
                ),
              }}
              component={Cart}
            />
            <Tab.Screen
              name="Menu"
              options={{
                tabBarLabel: "Menu",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="reorder-three-outline"
                    size={30}
                    color="black"
                  />
                ),
              }}
              component={Menu}
            />
          </Tab.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
});
