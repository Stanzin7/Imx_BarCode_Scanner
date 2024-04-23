import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getCart,
  getCartProducts,
  gettotalPriceOfProduct,
} from "../redux/reducers/cartReducer";
import ScannedItemCard from "../components/ProductCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getRoundedTotalEstimatedWeight } from "../redux/reducers/cartReducer";
import { submitOrder } from "../redux/reducers/userReducer";
import Colors from "../constants/Colors";
import { useIsFocused } from "@react-navigation/native";

const Cart = () => {
  const cartProducts = useSelector((state) => getCartProducts(state));
  const totalprice = useSelector((state) => gettotalPriceOfProduct(state));
  const totalWeight = useSelector(getRoundedTotalEstimatedWeight);
  const [shippingOption, setShippingOption] = useState("Delivery");
  const loading = useSelector((state) => state.entities.cart.isLoading);
  const [poNumber, setPoNumber] = useState("");
  const [message, setMessage] = useState("");
  const messageInputRef = useRef(null);
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.entities.cart);
  const user = useSelector((state) => state.user.user);
  const company = user?.customers[0]?.company;
  const accNo = user?.acctNo;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch(getCart({ acctNo: accNo, token: user.token }));
    }
  }, [isFocused]);

  const handleCheckout = () => {
    if (products.length === 0) {
      Alert.alert(
        "Empty Cart",
        "You cannot submit an order with an empty cart.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    }
    const orderDetails = {
      company: company,
      notes: message,
      orderDetails: products.map((product, index) => ({
        item: { documentCount: 0 },
        dupNo: index + 1,
        goScan: "N",
        itemNo: product.itemNo,
        memo: "",
        price: product.item.sellPriceCase1,
        qty: product.qty,
        qtyType: "CASE",
      })),
      orderTotal: products.reduce(
        (total, product) => total + product.item.sellPriceCase1 * product.qty,
        0
      ),
      paymentAccountType: null,
      paymentLogId: null,
      ponumber: poNumber,
      salesMan: "WEBORDER",
      shipToDupNo: 1,
      shipVia: shippingOption,
      sldAcctNo: accNo,
      storeNo: "",
      totalLines: products.length,
      whoOrdered: "WEBORDER",
    };
    console.log("Submitting order with details:", orderDetails);
    dispatch(submitOrder(orderDetails))
      .then(() => {
        dispatch(
          clearCart({
            acctNo: accNo,
            token: user.token,
          })
        );
        setPoNumber("");
        setMessage("");
        Alert.alert(
          "Order Submitted",
          "Your order has been successfully placed!",
          [{ text: "OK", onPress: () => console.log("Order submitted") }],
          { cancelable: false }
        );
      })
      .catch((error) => {
        console.error("Order submission failed:", error);
        // Optionally, show an error message
        Alert.alert(
          "Order Submission Failed",
          "There was an issue submitting your order. Please try again.",
          [
            {
              text: "OK",
              onPress: () => console.log("Order submission failed"),
            },
          ],
          { cancelable: false }
        );
      })
      .finally(() => {
        console.log("Order submission process completed");
      });
  };

  const toggleShippingOption = () => {
    setShippingOption((prevOption) =>
      prevOption === "Pickup" ? "Delivery" : "Pickup"
    );
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.container}>
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color={Colors.main} />
            </View>
          )}
          <FlatList
            ListHeaderComponent={<Header />}
            data={cartProducts?.products}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.itemNo}
            renderItem={({ item }) => {
              const itemDetails = item.item;
              return (
                <ScannedItemCard
                  key={itemDetails.itemNo}
                  imageUrl={itemDetails.imageUrl}
                  itemNo={itemDetails.itemNo}
                  description={itemDetails.description}
                  sellPriceCase1={itemDetails.sellPriceCase1}
                  unitsPerCase={itemDetails.unitsPerCase}
                  sellPriceUnit={itemDetails.sellPriceUnit}
                  currentCount={item.qty}
                  size={itemDetails.size}
                  pack={itemDetails.pack}
                />
              );
            }}
            ListFooterComponent={
              <Footer
                toggleShippingOption={toggleShippingOption}
                shippingOption={shippingOption}
                setPoNumber={setPoNumber}
                poNumber={poNumber}
                messageInputRef={messageInputRef}
                totalprice={totalprice}
                message={message}
                setMessage={setMessage}
                handleCheckout={handleCheckout}
                totalWeight={totalWeight}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles for the Cart component
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContentContainer: {
    marginTop: 10,
    paddingBottom: 100,
  },
  emptyCartText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "grey",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default Cart;
