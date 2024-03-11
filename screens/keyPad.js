import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, FlatList } from "react-native";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

import ScannedItemCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getCartProducts } from "../redux/reducers/cartReducer";

const KeyPad = () => {
  const cartProducts = useSelector(getCartProducts);
  const dispatch = useDispatch();
  const [upc, setUPC] = useState("");
  // const [loading, setLoading] = useState(false);
  const [itemStatus, setItemStatus] = useState([]);

  useEffect(() => {
    console.log("Cart Products:", cartProducts);
  }, [cartProducts]);
  const checkItemInDatabase = async (upc) => {
    setUPC("");
    try {
      const response = await fetch("http://50.247.13.10:3307/check-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UPC: upc }),
      });
      const responseData = await response.json();

      const isItemInList = itemStatus.some(
        (item) => item.itemNo === responseData.itemNo
      );

      if (!isItemInList) {
        setItemStatus((currentItems) => [responseData, ...currentItems]);
        dispatch(
          addProduct({
            item: responseData,
            itemNo: responseData.itemNo,
          })
        );
      }
    } catch (error) {
      console.error("Error checking item:", error);
      Alert.alert("Error", "Failed to check the item in the database.");
    }
    console.log("Cart Products:", cartProducts);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter UPC"
          placeholderTextColor={Colors.dark}
          keyboardType="name-phone-pad"
          returnKeyType="done"
          onChangeText={setUPC}
          value={upc}
          autoFocus={true}
          onSubmitEditing={() => checkItemInDatabase(upc)}
        />
      </View>
      <FlatList
        data={cartProducts.products}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 100,
        }}
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    position: "absolute", // Position the keypad container absolutely
    top: 0, // At the top of the safe area
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white", // Changed from transparent to white for visibility
    zIndex: 10, // Ensure it stacks above the FlatList
  },
  input: {
    height: 50,
    width: "100%",
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    fontSize: 20,
    borderRadius: 5,
    color: Colors.dark,
  },
});

export default KeyPad;
