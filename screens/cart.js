import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  FlatList,
  Pressable,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import {
  getCartProducts,
  gettotalPriceOfProduct,
} from "../redux/reducers/cartReducer";
import { Picker } from "@react-native-picker/picker";
import ScannedItemCard from "../components/ProductCard";

function handleSendOrder() {
  // do something
}

const Cart = () => {
  const cartProducts = useSelector((state) => getCartProducts(state));
  const totalprice = useSelector((state) => gettotalPriceOfProduct(state));

  const [shippingOption, setShippingOption] = React.useState("Delivery");

  const toggleShippingOption = () => {
    setShippingOption((prevOption) =>
      prevOption === "Pickup" ? "Delivery" : "Pickup"
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Order Summary</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.shippingTotalContainer}>
        <View style={styles.shippingContainer}>
          <Text style={styles.shippingText}>Shipping Option:</Text>
          <Text style={styles.optionText} onPress={toggleShippingOption}>
            {shippingOption}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Price:</Text>
          <Text style={styles.priceText}>
            ${parseFloat(totalprice).toFixed(2)}
          </Text>
        </View>
      </View>
      <Pressable style={styles.orderButton} onPress={handleSendOrder}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={renderHeader}
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
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text style={styles.emptyCartText}>There is no item in cart</Text>
          }
        />
      </View>
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
  listContentContainer: {
    marginTop: 10,
    paddingBottom: 100,
  },
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
});

export default Cart;
