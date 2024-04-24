import { StyleSheet, Text, View, Pressable } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import React, { useEffect } from "react";
import CounterNew from "./Counter";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuanity,
  deleteCart,
  deleteProduct,
  increaseQuanity,
  updateCart,
} from "../redux/reducers/cartReducer";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal } from "react-native";

const ScannedItemCard = ({
  imageUrl,
  itemNo,
  description,
  sellPriceCase1,
  unitsPerCase,
  sellPriceUnit,
  currentCount,
  size,
  pack,
}) => {
  const [isOpen, setisOpen] = useState(true);
  const token = useSelector((state) => state.user.accessToken); // Ensure you have this selector
  const acctNo = useSelector((state) => state.user.user.acctNo);
  const products = useSelector(
    (state) => state.entities.cart.products[0]?.item
  );
  const company = useSelector((state) => state.user.user.company);
  const imgUrl = company?.imgUrl;

  const email = useSelector((state) => state.user.user.emailAddress);
  const qty = useSelector((state) => state.entities.cart.products[0]?.qty);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUri, setImageUri] = useState(
    `${imgUrl}/${itemNo}/0thn.jpg`
  );
  const [highResImageUri, setHighResImageUri] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setHighResImageUri(getHighResUri(0));
  }, [itemNo]);

  const getHighResUri = (index) =>
    `${imgUrl}/${itemNo}/${index}.jpg`;

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(imageUri, { method: "HEAD" });
        if (response.ok) {
          setImageLoaded(true);
        } else {
          throw new Error("Image does not exist");
        }
      } catch (error) {
        // If there's an error (image does not exist), load the local notFound image
        setImageUri(require("../assets/images/notFound.png"));
      }
    };

    checkImage();
  }, [itemNo]);

  function handleCloseButton() {
    // dispatch(deleteProduct({ itemNo }));
    dispatch(deleteCart({ acctNo, itemNo, token }));
  }

  let unitPrice =
    typeof sellPriceUnit === "number" && sellPriceUnit ? sellPriceUnit : 0;
  if (
    unitPrice === 0 &&
    typeof sellPriceCase1 === "number" &&
    typeof unitsPerCase === "number" &&
    unitsPerCase !== 0
  ) {
    unitPrice = sellPriceCase1 / unitsPerCase;
  }
  const roundedUnitPrice = unitPrice.toFixed(2);

  const incrementCounter = () => {
    const payload = {
      item: products,
      acctNo: acctNo,
      itemNo: itemNo,
      price: sellPriceCase1,
      qty: qty + 1,
      emailAddress: email,
      qtyType: "CASE",
      cartType: "CART",
      cartTypeDesc: "",
      goScan: "Y",
      storeNo: "",
      dateAdded: new Date().toISOString(),
    };

    dispatch(updateCart({ acctNo, token, payload }));
    // dispatch(increaseQuanity({ itemNo: itemNo }));
  };
  const decrementCounter = () => {
    if (qty === 1) {
      dispatch(deleteCart({ acctNo, itemNo, token }));
    } else {
      const payload = {
        item: products,
        acctNo: acctNo,
        itemNo: itemNo,
        price: sellPriceCase1,
        qty: qty - 1,
        emailAddress: email,
        qtyType: "CASE",
        cartType: "CART",
        cartTypeDesc: "",
        goScan: "Y",
        storeNo: "",
        dateAdded: new Date().toISOString(),
      };

      dispatch(updateCart({ acctNo, token, payload }));
    }
    // if (currentCount >= 2) {
    //   dispatch(decreaseQuanity({ itemNo }));
    // }
    // setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
  };

  const openModal = () => {
    setCurrentImageIndex(0); // Reset the image index when modal is opened
    setHighResImageUri(getHighResUri(0)); // Set the initial high-res image URI
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleNextImage = () => {
    if (currentImageIndex < 1) {
      // Handle for only two images
      console.log(currentImageIndex);
      const nextIndex = currentImageIndex + 1;

      fetch(getHighResUri(nextIndex), { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            setCurrentImageIndex(nextIndex);
            setHighResImageUri(getHighResUri(nextIndex));
            console.log("Image found at index:", nextIndex);
          } else {
            console.log(
              "No more images available. Stay on current index:",
              currentImageIndex
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching the next image:", error);
        });
    }
  };

  const handlePreviousImage = () => {
    const nextIndex = currentImageIndex > 0 && currentImageIndex - 1;

    fetch(getHighResUri(nextIndex), { method: "HEAD" })
      .then((response) => {
        if (response.ok) {
          setCurrentImageIndex(nextIndex);
          setHighResImageUri(getHighResUri(nextIndex));
        } else {
          console.log("No more images available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching the next image:", error);
      });
  };

  return isOpen ? (
    <View style={styles.container}>
      <Pressable onPress={handleCloseButton} style={styles.closeButton}>
        <Fontisto name="close" size={24} color="black" />
      </Pressable>
      <View style={styles.subCon}>
        <View style={{ flex: 0.4, alignItems: "center" }}>
          <Pressable onPress={openModal}>
            <Image
              source={
                imageLoaded
                  ? { uri: imageUri }
                  : require("../assets/images/notFound.png")
              }
              style={styles.img}
              contentFit="contain"
              onError={() => {
                setImageUri(require("../assets/images/notFound.png"));
                setImageLoaded(false);
              }}
            />
          </Pressable>
        </View>
        <View style={{ flex: 0.6 }}>
          <Text style={[styles.itemText1]}>Item#: {itemNo}</Text>
          <Text style={styles.itemText}>{description}</Text>
          <View style={styles.rowText}>
            <Text>
              {size} {"    "}
            </Text>

            <Text> {pack}</Text>
          </View>
          <View style={styles.rowText}>
            <Text>
              ${sellPriceCase1} {"         "}
            </Text>
            <Text style={styles.rightText}>
              {"    "}
              {sellPriceUnit === 0 ? roundedUnitPrice : sellPriceUnit} ea
            </Text>
          </View>
          <Text style={styles.itemText}>
            {"SubTotal: " + `$${(sellPriceCase1 * currentCount).toFixed(2)}`}
          </Text>
          <CounterNew
            currentCount={currentCount}
            itemNo={itemNo}
            incrementCounter={incrementCounter}
            decrementCounter={decrementCounter}
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal} // It's good practice to handle the hardware back button on Android
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* Close button for the modal */}
              <Pressable onPress={closeModal} style={styles.modalCloseButton}>
                <Fontisto name="close" size={24} color="black" />
              </Pressable>
              <Pressable onPress={handleNextImage} style={styles.nextButton}>
                <MaterialIcons name="navigate-next" size={24} color="black" />
              </Pressable>

              <Pressable
                onPress={handlePreviousImage}
                style={styles.previousButton}
              >
                <MaterialIcons name="navigate-before" size={24} color="black" />
              </Pressable>

              {/* High-res image */}
              <Image
                source={{ uri: highResImageUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  ) : null;
};

export default ScannedItemCard;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    backgroundColor: "white",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 4,
    shadowColor: "orange",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  subCon: {
    flexDirection: "row",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  img: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 10,
  },
  rowText: {
    flexDirection: "row",
    marginVertical: 5,
    // justifyContent: "space-evenly"
  },
  rightText: {
    marginLeft: "10%",
  },
  itemText: {
    marginVertical: 5,
    color: "blue",
    // marginBottom: 10,
  },
  itemText1: {
    marginVertical: 2,
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
  },
  modalImage: {
    width: 300, // You can adjust this
    height: 300, // You can adjust this
    // marginBottom: 15,
    // aspectRatio: 1,
  },
  nextButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  previousButton: {
    position: "absolute",
    left: 10,
    bottom: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
});
