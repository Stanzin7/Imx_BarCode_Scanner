import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyInfo, setLogout } from "../redux/reducers/userReducer";
import { toggleSound } from "../redux/reducers/cartReducer";

const Menu = () => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state) => state.user.companyInfo);
  const soundEnabled = useSelector((state) => state.entities.cart.soundEnabled);

  const handleLogout = () => {
    dispatch(setLogout());
    console.log("User logged out");
  };
  const handleMenuOption = (option) => {
    console.log(`${option} was selected`);
    if (option === "Play Sound") {
      dispatch(toggleSound()); // Toggle sound option
    }
  };

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Profile")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>Profile</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}></Text>
        </View>
        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Location")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>PreviousOrder</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}></Text>
        </View>
        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Location")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>Location</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}>
            {companyInfo?.addressLine1} {companyInfo?.addressLine2}
          </Text>
        </View>

        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Call Us")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>Call Us</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}> {companyInfo?.phone}</Text>
        </View>

        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Email")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>Email</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}> {companyInfo?.newOrderEmail}</Text>
        </View>

        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Fax")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>Fax</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}>
            {companyInfo?.fax1}, {companyInfo?.fax2}
          </Text>
        </View>

        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Terms & Conditions")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}></Text>
        </View>

        <View style={styles.menuItemRow}>
          <TouchableOpacity
            onPress={() => handleMenuOption("Privacy Policy")}
            activeOpacity={0.1}
          >
            <Text style={styles.menuItem}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}></Text>
        </View>

        <View style={styles.menuItemRow}>
          <Text style={styles.menuItem}>Play Sound</Text>
          <TouchableOpacity
            onPress={() => dispatch(toggleSound())}
            activeOpacity={0.6}
            style={styles.toggleButton}
          >
            <Text style={styles.menuInfo}>{soundEnabled ? "On" : "Off"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuItemRow}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuItem}>Log Out</Text>
          </TouchableOpacity>
          <Text style={styles.menuInfo}></Text>
        </View>
      </View>
      <View style={styles.menuItemRow}>
        <TouchableOpacity onPress={() => handleMenuOption("Version Number")}>
          <Text style={styles.menuItem}>Version Number</Text>
        </TouchableOpacity>
        <Text style={styles.menuInfo}>1. 1. 0</Text>
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
    marginTop: 14,
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  menuItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#cccccc",
  },
  menuInfo: {
    padding: 20,
    color: "blue",
  },
});

export default Menu;
