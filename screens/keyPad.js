import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  ImageBackground,
  Dimensions,
} from "react-native";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

import ScannedItemCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getCartProducts } from "../redux/reducers/cartReducer";
import { searchItemByBarcode } from "../redux/reducers/userReducer";

import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";

const KeyPad = () => {
  const cartProducts = useSelector(getCartProducts);
  const token = useSelector((state) => state.user.accessToken); // Ensure you have this selector
  const dispatch = useDispatch();
  const [upc, setUPC] = useState("");
  // const soundEnabled = useSelector((state) => state.user.soundEnabled);
  const [itemDetails, setItemDetails] = useState([]);
  const soundEnabled = useSelector((state) => state.entities.cart.soundEnabled);
  console.log("cartProducts", cartProducts);

  const playSound = async (soundPath) => {
    if (soundEnabled) {
      try {
        const { sound } = await Audio.Sound.createAsync(soundPath);
        await sound.playAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  const handleManualItemSubmit = async () => {
    if (upc) {
      console.log(upc);
      dispatch(searchItemByBarcode({ barcodeId: upc, token }))
        .unwrap()
        .then((response) => {
          if (
            response &&
            (response.itemNo === upc ||
              response.upc === upc ||
              response.upc2 === upc ||
              response.upc3 === upc ||
              response.upc4 === upc)
          ) {
            console.log(response);
            playSound(require("../assets/sounds/Found.wav"));
            setItemDetails((currentItems) => [response, ...currentItems]);
            dispatch(
              addProduct({
                item: response,
                itemNo: response.itemNo,
              })
            );
          } else {
            playSound(require("../assets/sounds/NotFound.wav"));
          }
        })
        .catch((error) => {
          console.error("Error fetching item details:", error);
          Alert.alert("Error", "Failed to fetch item details.");
        });
    }
    setUPC(""); // Reset UPC field
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter Upc or Item No..."
          placeholderTextColor={Colors.dark}
          keyboardType="name-phone-pad"
          returnKeyType="done"
          onChangeText={setUPC}
          value={upc}
          autoFocus={true}
          onSubmitEditing={handleManualItemSubmit}
        />
      </View>
      <FlatList
        data={cartProducts.products}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 100,
        }}
        style={styles.flatList}
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
      <ImageBackground
        source={require("../assets/images/logo1.png")}
        resizeMode="center"
        style={[styles.fixed, styles.containter, { zIndex: -1 }]}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "transparent",
    // marginBottom: 0,
  },
  container: {
    position: "absolute", // Position the keypad container absolutely
    top: 0, // At the top of the safe area
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    // backgroundColor: "white", // Changed from transparent to white for visibility
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
    // marginBottom: 0,
  },
  flatList: {
    marginTop: 20,
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containter: {
    width: Dimensions.get("window").width, //for full screen
    height: Dimensions.get("window").height - 50, //for full screen
  },
});

export default KeyPad;
