// PONumberInput.js
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const PONumberInput = ({ setPoNumber, poNumber }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>PO Number:</Text>
    <TextInput
      style={styles.input}
      onChangeText={setPoNumber}
      value={poNumber}
      placeholder="Enter PO Number"
      keyboardType="name-phone-pad"
      returnKeyType="done"
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
  input: {
    // Your styles here
  },
});

export default PONumberInput;
