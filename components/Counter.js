import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { TextInput } from "react-native-gesture-handler";

const CounterNew = ({
  currentCount,
  itemNo,
  decrementCounter,
  incrementCounter,
  updateCart,
}) => {
  // const [counter, setCounter] = useState(currentCount); // Initialize counter with 0
  // const dispatch = useDispatch();
  const [textValue, setTextValue] = useState(currentCount);

  const handleTextChange = (text) => {
    setTextValue(text);
  };

  const handleBlur = () => {
    const newValue = parseInt(textValue);
    if (!isNaN(newValue)) {
      updateCart(newValue); // Update the cart with the new value
    } else {
      // Handle invalid input, maybe show an error message
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.counterStyle} onPress={decrementCounter}>
        <Text> - </Text>
      </Pressable>
      <TextInput
        style={styles.counterText}
        defaultValue={currentCount.toString()}
        onChangeText={handleTextChange}
        onBlur={handleBlur} // Call handleBlur when the input loses focus
        keyboardType="numeric"
      />
      <Pressable style={styles.counterStyle} onPress={incrementCounter}>
        <Text>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterText: {
    marginHorizontal: 20,
    fontSize: 18,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "orange",
    backgroundColor: "white",
  },
  counterStyle: {
    height: 25,
    width: 25,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "orange",
    backgroundColor: "white",
  },
});

export default CounterNew;
