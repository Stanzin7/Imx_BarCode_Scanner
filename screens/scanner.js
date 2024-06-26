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
  TouchableOpacity,
  Linking,
  Dimensions,
  ImageBackground,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import ScannedItemCard from "../components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, getCartProducts } from "../redux/reducers/cartReducer";
import { searchItemByBarcode } from "../redux/reducers/userReducer";
import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
import Colors from "../constants/Colors";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [androidPermission, setAndroidPermission] = useState(0);
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

  const askCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log("Camera permission status:", status);
    if (status !== "granted") {
      // alert('Permission to access camera was denied');
      setAndroidPermission(-1);
    } else {
      setAndroidPermission(1);
    }
  };

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

  if (Platform.OS == "ios") {
    if (permission && !permission?.granted) {
      if (permission.status === "undetermined") {
        // The user has not been asked for this permission
        return (
          <View style={styles.container}>
            <Text>We need access to your camera for scanning</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.btn}
              onPress={requestPermission}
            >
              <Text style={{ color: "white" }}>Allow Camera</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (permission.status === "denied") {
        return (
          <View style={styles.container}>
            <Text>
              No access to camera. Please enable camera permission in settings
              to use this feature.
            </Text>
            {/* openSettings is a function you need to implement */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.btn}
              onPress={() => {
                Linking.openSettings();
              }}
            >
              <Text style={{ color: "white" }}>Open Settings</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }

  if (Platform.OS == "android" && androidPermission != 1) {
    return (
      <View style={styles.container}>
        <Text>We need access to your camera for scanning</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.btn}
          onPress={() => {
            askCameraPermission();
          }}
        >
          <Text style={{ color: "white" }}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
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
          {Platform.OS === "ios" ? (
            <CameraView
              key={cameraKey}
              style={StyleSheet.absoluteFill}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            >
              <View style={styles.overlay}>
                <View style={styles.frame} />
              </View>
            </CameraView>
          ) : (
            <Camera
              style={StyleSheet.absoluteFill}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
            >
              <View style={styles.overlay}>
                <View style={styles.frame} />
              </View>
            </Camera>
          )}
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
  },
  container: {
    alignItems: "center",
    marginTop: 15,
    width: "95%",
    textAlign: "center",
    alignSelf: "center",
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
  btn: {
    backgroundColor: Colors.main,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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

export default Scanner;
