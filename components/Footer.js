import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MessageInput from "./MessageInput"; // Ensure the path is correct
import PONumberInput from "./PONumberInput"; // Ensure the path is correct
import { useSelector } from "react-redux";

const Footer = ({
  toggleShippingOption,
  shippingOption,
  setPoNumber,
  poNumber,
  messageInputRef,
  totalprice,
  message, // Received message
  setMessage, // Received setMessage
  handleCheckout, // Assuming this function is passed down as a prop
  totalWeight,
}) => {
  const isLoading = useSelector((state) => state.user.isLoading);

  return (
    <View style={styles.footerContainer}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>SubTotal:</Text>
        <Text style={styles.priceText}>
          ${parseFloat(totalprice).toFixed(2)}
        </Text>
      </View>

      <View style={styles.totalWeightContainer}>
        <Text style={styles.totalText}>Total Estimated Weight:</Text>
        <Text style={styles.priceText}>{totalWeight} lbs.</Text>
      </View>

      <View style={styles.shippingTotalContainer}>
        <View style={styles.shippingContainer}>
          <Text style={styles.shippingText}>Shipping Method:</Text>
          <Text style={styles.optionText} onPress={toggleShippingOption}>
            {shippingOption}
          </Text>
        </View>

        {/* Use PONumberInput component */}
        <PONumberInput setPoNumber={setPoNumber} poNumber={poNumber} />

        {/* Use MessageInput component */}
        <MessageInput
          messageInputRef={messageInputRef}
          message={message}
          setMessage={setMessage}
        />
      </View>

      <Pressable style={styles.orderButton} onPress={handleCheckout}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.orderButtonText}>Check Out</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#e2e2e2",
  },
  shippingTotalContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  shippingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  shippingText: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff", // Example blue color for the clickable text
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  orderButton: {
    backgroundColor: "orange",
    padding: 16,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  orderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyCartText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "grey",
  },
  totalWeightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 13,
  },
});

export default Footer;
