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
import { Audio } from "expo-av";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const token = useSelector((state) => state.user.accessToken);
  const cartProducts = useSelector(getCartProducts);
  const dispatch = useDispatch();
  const [scanned, setScanned] = useState(true);
  const [itemDetails, setItemDetails] = useState([]);
  const [cameraKey, setCameraKey] = useState(0);

  useEffect(() => {
    console.log("Initial scanned state:", scanned); // Log initial scanned state
  }, []);

  const playSound = async (soundPath) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundPath);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    console.log("handleBarcodeScanned called", { scanned, data }); // Check if function is called when it shouldn't be
    if (!scanned) {
      console.log("Processing new scan...");
      setScanned(true);

      const adjustedData = data.startsWith("0") ? data.substring(1) : data;
      console.log("Dispatching searchItemByBarcode with:", adjustedData);

      dispatch(searchItemByBarcode({ barcodeId: adjustedData, token }))
        .unwrap()
        .then((response) => {
          console.log("Search item response:", response); // Log the response from the search
          if (response) {
            playSound(require("../assets/sounds/Found.wav"));
            dispatch(addProduct({ item: response, itemNo: response.itemNo }));
            setItemDetails((currentItems) => [response, ...currentItems]);
          } else {
            playSound(require("../assets/sounds/NotFound.wav"));
          }
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to fetch item details.");
          console.error("Search item error:", error); // Log any errors
        })
        .finally(() => {
          console.log("Setting scanned to true in finally block");
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
    console.log("Scan Again button pressed");
    setScanned(false); // Allow scanning again
    setCameraKey((prevKey) => prevKey + 1);
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <CameraView
          key={cameraKey}
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
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 350,
    height: 50,
    borderWidth: 2,
    borderColor: "#FF0000",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    width: "90%",
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
