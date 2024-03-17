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
import { searchItemByBarcode } from "../redux/reducers/userReducer";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const token = useSelector((state) => state.user.accessToken);
  const cartProducts = useSelector(getCartProducts);
  const dispatch = useDispatch();
  // console.log(cartProducts);
  const [scanned, setScanned] = useState(true);
  const [itemDetails, setItemDetails] = useState([]);

  // useEffect(() => {
  //   console.log(cartProducts);
  //   console.log(itemDetails);
  // }, [cartProducts]);

  const handleBarcodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true);

      const adjustedData = data.startsWith("0") ? data.substring(1) : data;
      console.log("Scanned data is here:", adjustedData);
      dispatch(searchItemByBarcode({ barcodeId: adjustedData, token }))
        .unwrap()
        .then((response) => {
          if (response) {
            setItemDetails((currentItems) => [response, ...currentItems]);
          } else {
            Alert.alert(
              "No item found",
              "The barcode did not match any items."
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching item details:", error);
          Alert.alert("Error", "Failed to fetch item details.");
        })
        .finally(() => {
          // Prevent further scans
          setScanned(true);
        });
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
