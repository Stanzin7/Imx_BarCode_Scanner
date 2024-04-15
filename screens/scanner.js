import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Alert,
  FlatList,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import ScannedItemCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getCartProducts } from "../redux/reducers/cartReducer";
import { searchItemByBarcode } from "../redux/reducers/userReducer";
import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const token = useSelector((state) => state.user.accessToken);
  const cartProducts = useSelector(getCartProducts);
  const dispatch = useDispatch();
  const [scanned, setScanned] = useState(true);
  const [itemDetails, setItemDetails] = useState([]);
  const [isCameraVisible, setIsCameraVisible] = useState(false); // For camera visibility
  const [cameraKey, setCameraKey] = useState(0);
  const soundEnabled = useSelector((state) => state.entities.cart.soundEnabled);

  // useEffect(() => {
  //   console.log("Initial scanned state:", scanned); // Log initial scanned state
  // }, []);

  const playSound = async (soundPath) => {
    if (soundEnabled) {
      // Check if sound is enabled
      try {
        const { sound } = await Audio.Sound.createAsync(soundPath);
        await sound.playAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    // console.log("handleBarcodeScanned called", { scanned, data }); // Check if function is called when it shouldn't be
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
            setIsCameraVisible(false);
            playSound(require("../assets/sounds/Found.wav"));
            dispatch(addProduct({ item: response, itemNo: response.itemNo }));
            setItemDetails((currentItems) => [response, ...currentItems]);
          } else {
            playSound(require("../assets/sounds/NotFound.wav"));
            setIsCameraVisible(false);
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

  if (!permission) {
    // Permission status is still loading
    return (
      <View style={styles.container}>
        <Text>Checking camera permissions...</Text>
      </View>
    );
  } else if (!permission.granted) {
    if (permission.status === "undetermined") {
      // The user has not been asked for this permission
      return (
        <View style={styles.container}>
          <Text>We need access to your camera for scanning</Text>
          <Button title="Allow Camera" onPress={requestPermission} />
        </View>
      );
    } else if (permission.status === "denied") {
      // The user has denied the permission
      return (
        <View style={styles.container}>
          <Text>
            No access to camera. Please enable camera permission in settings to
            use this feature.
          </Text>
          <Button title="Open Settings" onPress={openSettings} />{" "}
          {/* openSettings is a function you need to implement */}
        </View>
      );
    }
  }

  const handleScanAgainPress = () => {
    // shutit off!
    console.log("Scan Again button pressed");
    setIsCameraVisible(true);
    setScanned(false); // Allow scanning again
    setCameraKey((prevKey) => prevKey + 1);
  };

  const cameraStyle = isCameraVisible ? styles.camera : styles.cameraHidden;
  const flatListStyle = isCameraVisible
    ? styles.flatList
    : styles.flatListExpanded;

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {isCameraVisible && (
        <View style={cameraStyle}>
          <CameraView
            key={cameraKey}
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          >
            <View style={styles.overlay}>
              <View style={styles.frame} />
            </View>
          </CameraView>
        </View>
      )}
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
        <Button color={"black"} title="Scan" onPress={handleScanAgainPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
