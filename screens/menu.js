import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import { setLogout } from "../redux/reducers/userReducer";

const Menu = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setLogout());
    console.log("User logged out");
  };

  const handleMenuOption = (option) => {
    console.log(`${option} was selected`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => handleMenuOption("Secure Inbox")}>
          <Text style={styles.menuItem}>Previous Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleMenuOption("Call Us")}>
          <Text style={styles.menuItem}>Call Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuOption("Locations")}>
          <Text style={styles.menuItem}>Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleMenuOption("Terms & Conditions")}
        >
          <Text style={styles.menuItem}>Terms & Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuOption("Privacy Policy")}>
          <Text style={styles.menuItem}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuOption("Acknowledgements")}>
          <Text style={styles.menuItem}>Acknowledgements</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuOption("Version Number")}>
          <Text style={styles.menuItem}>Version Number</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.menuItem}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: "grey",
  },
});

export default Menu;
