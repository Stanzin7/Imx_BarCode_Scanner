import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const MessageInput = ({ messageInputRef, message, setMessage }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>Message (up to 100 chars):</Text>
    <TextInput
      ref={messageInputRef}
      style={styles.input}
      onChangeText={setMessage}
      value={message}
      placeholder="Enter a message"
      maxLength={100}
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

export default MessageInput;
