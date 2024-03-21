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
  getCartProducts,
  gettotalPriceOfProduct,
} from "../redux/reducers/cartReducer";
import ScannedItemCard from "../components/ProductCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getRoundedTotalEstimatedWeight } from "../redux/reducers/cartReducer";
import { submitOrder } from "../redux/reducers/userReducer";

const Cart = () => {
  const cartProducts = useSelector((state) => getCartProducts(state));
  const totalprice = useSelector((state) => gettotalPriceOfProduct(state));
  const totalWeight = useSelector(getRoundedTotalEstimatedWeight);
  const [shippingOption, setShippingOption] = useState("Delivery");
  const [poNumber, setPoNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageInputRef = useRef(null);
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.entities.cart);
  const user = useSelector((state) => state.user.user);
  const company = user?.company;
  const accNo = user?.acctNo;

  console.log(cartProducts);
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
    setIsLoading(true);
    console.log("Checkout button pressed");
    const orderDetails = {
      company: company,
      notes: message,
      orderDetails: products.map((product, index) => ({
        item: { documentCount: 0 },
        dupNo: index + 1,
        goScan: "N",
        itemNo: product.itemNo,
        memo: "",
        price: product.sellPriceCase1,
        qty: product.quantity,
        qtyType: "CASE",
      })),
      orderTotal: products.reduce(
        (total, product) => total + product.sellPriceCase1 * product.quantity,
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
        dispatch(clearCart());
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
      .finally(() => setIsLoading(false));
  };

  const toggleShippingOption = () => {
    setShippingOption((prevOption) =>
      prevOption === "Pickup" ? "Delivery" : "Pickup"
    );
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {isLoading ? ( // Check if loading
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <View style={styles.container}>
            <FlatList
              ListHeaderComponent={<Header />}
              data={cartProducts?.products}
              contentContainerStyle={styles.listContentContainer}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.itemNo}
              renderItem={({ item }) => (
                <ScannedItemCard
                  key={item.itemNo}
                  imageUrl={item.imageUrl}
                  itemNo={item.itemNo}
                  description={item.description}
                  sellPriceCase1={item.sellPriceCase1}
                  unitsPerCase={item.unitsPerCase}
                  sellPriceUnit={item.sellPriceUnit}
                  currentCount={item.quantity}
                  size={item.size}
                  pack={item.pack}
                />
              )}
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
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cart;
