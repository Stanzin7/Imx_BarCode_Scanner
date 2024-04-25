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
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

import ScannedItemCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  addToCartFirst,
  getCart,
  getCartProducts,
  updateCart,
} from "../redux/reducers/cartReducer";
import { searchItemByBarcode } from "../redux/reducers/userReducer";

import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

const KeyPad = () => {
  const token = useSelector((state) => state.user.accessToken); // Ensure you have this selector
  const acctNo = useSelector((state) => state.user.user.acctNo);
  const email = useSelector((state) => state.user.user.emailAddress);
  const loading = useSelector((state) => state.entities.cart.isLoading);
  const products = useSelector((state) => state.entities.cart.products);

  const dispatch = useDispatch();
  const [upc, setUPC] = useState("");
  // const soundEnabled = useSelector((state) => state.user.soundEnabled);
  const [itemDetails, setItemDetails] = useState([]);
  const isFocused = useIsFocused();
  const soundEnabled = useSelector((state) => state.entities.cart.soundEnabled);

  useEffect(() => {
    if (isFocused) {
      dispatch(getCart({ acctNo, token }));
    }
  }, [isFocused]);

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

            const isExist = products.some(
              (item) => item.itemNo === response.itemNo
            );

            const existingItem = products.find(
              (item) => item.itemNo === response.itemNo
            );

            console.log("isExist", isExist);
            if (isExist) {
              const payload = {
                item: products?.item,
                acctNo: acctNo,
                itemNo: response.itemNo,
                price: response.sellPriceCase1,
                qty: existingItem?.qty + 1,
                emailAddress: email,
                qtyType: "CASE",
                cartType: "CART",
                cartTypeDesc: "",
                goScan: "Y",
                storeNo: "",
                dateAdded: new Date().toISOString(),
              };
              dispatch(updateCart({ acctNo, token, payload }));
            } else {
              const payload = {
                cartTypeDesc: "",
                item: { documentCount: 0 },
                itemNo: response.itemNo,
                storeNo: "",
                qty: 1,
                acctNo: acctNo,
                emailAddress: email,
                price: response.sellPriceCase1,
                goScan: "YES",
                qtyType: "CASE",
                cartType: "CART",
              };

              dispatch(
                addToCartFirst({
                  acctNo,
                  token,
                  payload,
                })
              );
            }
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
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.main} />
        </View>
      )}
      <FlatList
        data={products}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 100,
        }}
        style={styles.flatList}
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
      />
      <ImageBackground
        source={require("../assets/images/logo1.png")}
        resizeMode="center"
        style={[styles.fixed, styles.containter, { zIndex: -1 }]}
      />
    </SafeAreaView>
  );
};

const minusHeight = Platform.OS === "android" ? 50 : 150;
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
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
    height: Dimensions.get("window").height - minusHeight, //for full screen
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default KeyPad;
