import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Alert,
  FlatList,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import ScannedItemCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getCartProducts } from "../redux/reducers/cartReducer";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cartProducts = useSelector(getCartProducts);
  const dispatch = useDispatch();
  // console.log(cartProducts);
  const [scanned, setScanned] = useState(true);
  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    console.log(cartProducts);
  }, [cartProducts]);

  const handleBarcodeScanned = async ({ type, data }) => {
    if (!scanned) {
      console.log("Scanned data is here:", data);
      setScanned(true);
      const adjustedData =
        data.length === 13 && data.startsWith("0") ? data.substring(1) : data;

      if (adjustedData.length < 12) {
        Alert.alert("Please enter the Item No in KeyPad");
        return;
      }

      try {
        const response = await fetch("http://50.247.13.10:3307/check-item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UPC: adjustedData }),
        });
        const responseData = await response.json();
        const isItemInList = itemDetails.some(
          (item) => item.itemNo === responseData.itemNo
        );

        // Add item to the list only if it's not already present
        if (!isItemInList) {
          setItemDetails((currentItems) => [responseData, ...currentItems]);
        }
      } catch (error) {
        console.error("Error checking item:", error);
        Alert.alert("Error", "Failed to check the item in the database.");
      }
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  const handleScanAgainPress = () => {
    setScanned(false);
    console.log(itemDetails);
    if (itemDetails.length > 0) {
      const scannedItem = itemDetails[0];
      console.log(scannedItem);
      dispatch(
        addProduct({
          item: scannedItem,
          itemNo: scannedItem.itemNo,
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.frame} />
          </View>
        </CameraView>
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
      <View style={styles.buttonContainer}>
        <Button
          color={"black"}
          title="Scan Again"
          onPress={handleScanAgainPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    // flex: 1,
    // justifyContent: "flex-start",
    // backgroundColor: "red",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: 100, // Adjusted for better view
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 350,
    height: 50, // Adjusted for a square frame
    borderWidth: 2,
    borderColor: "#FF0000",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    width: "90%",
    // padding: 20,
    position: "absolute",
    backgroundColor: "orange",
    color: "green",
    bottom: 10,
    alignSelf: "center",
    borderRadius: 5,
    fontWeight: "bold",
  },
});

export default Scanner;
