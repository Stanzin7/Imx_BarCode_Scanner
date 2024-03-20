import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>Your Order</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "500",
    color: "black",
  },
});

export default Header;
