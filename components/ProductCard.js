import { StyleSheet, Text, View, Pressable } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import React from "react";
import CounterNew from "./Counter";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  decreaseQuanity,
  deleteProduct,
  increaseQuanity,
} from "../redux/reducers/cartReducer";
import { Image } from "expo-image";

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
  const dispatch = useDispatch();

  function handleCloseButton() {
    dispatch(deleteProduct({ itemNo }));
    // setisOpen(false);
  }
  // let unitPrice = sellPriceUnit;
  // if (sellPriceUnit === 0) {
  //   unitPrice = sellPriceCase1 / unitsPerCase;
  // }
  // const roundedUnitPrice = unitPrice.toFixed(2);
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
    dispatch(increaseQuanity({ itemNo: itemNo }));
  };
  const decrementCounter = () => {
    if (currentCount >= 2) {
      dispatch(decreaseQuanity({ itemNo }));
    }
    // setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
  };

  return isOpen ? (
    <View style={styles.container}>
      <Pressable onPress={handleCloseButton} style={styles.closeButton}>
        <Fontisto name="close" size={24} color="black" />
      </Pressable>
      <View style={styles.subCon}>
        <View style={{ flex: 0.4, alignItems: "center" }}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.img}
              cachePolicy="memory-disk" // Correctly apply caching to network images
            />
          ) : (
            <Image
              source={require("../assets/images/notFound.png")}
              style={styles.img}
              // cachePolicy is not needed for local images, so it can be removed
            />
          )}
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
    height: 100,
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
});
