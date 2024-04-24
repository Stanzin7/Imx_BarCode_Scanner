import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { previousOrderDetails } from "../redux/reducers/userReducer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "../constants/Colors";
import { addToCartFirst, updateCart } from "../redux/reducers/cartReducer";

const PreviousOrderDetails = ({
  route: {
    params: { orderNo },
  },
}) => {
  console.log("orderNo new", orderNo);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.accessToken);
  const acctNo = useSelector((state) => state.user.user.acctNo);
  const prevOrderDetails = useSelector(
    (state) => state.user.previousOrderDetails
  );
  const cartProducts = useSelector((state) => state.entities.cart);
  const email = useSelector((state) => state.user.user.emailAddress);
  const products = useSelector(
    (state) => state.entities.cart.products[0]?.item
  );
  const qty = useSelector((state) => state.entities.cart.products[0]?.qty);
  const company = useSelector((state) => state.user.user.company);
  const imgUrl = company?.imgUrl;

  useEffect(() => {
    dispatch(previousOrderDetails({ orderNo, acctNo, token, imgUrl }));
  }, []);

  const IndAddtoCart = (item) => {
    const isExist = cartProducts.products.some(
      (data) => data.itemNo === item.itemNo
    );

    console.log("isExist", isExist);
    if (isExist) {
      const payload = {
        item: products,
        acctNo: acctNo,
        itemNo: item?.itemNo,
        price: item?.price,
        qty: item?.qty + qty,
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
        itemNo: item?.itemNo,
        storeNo: "",
        qty: item?.qty,
        acctNo: acctNo,
        emailAddress: email,
        price: item?.price,
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
  };

  const AllAddtoCart = () => {
    prevOrderDetails?.orderDetails.map((item) => {
      const isExist = cartProducts.products.some(
        (data) => data.itemNo === item.itemNo
      );

      console.log("isExist", isExist);
      if (isExist) {
        const payload = {
          item: products,
          acctNo: acctNo,
          itemNo: item?.itemNo,
          price: item?.price,
          qty: item?.qty + qty,
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
          itemNo: item?.itemNo,
          storeNo: "",
          qty: item?.qty,
          acctNo: acctNo,
          emailAddress: email,
          price: item?.price,
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
    });
  };

  const TableHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Item</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>Qty</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>Type</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.1 }]}></Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.heading}>Order No: {orderNo}</Text>
      <View style={styles.container}>
        <Text style={styles.boldText}>
          Order Date:{" "}
          <Text style={styles.normalText}>{prevOrderDetails?.dateCreated}</Text>
        </Text>

        <Text style={styles.boldText}>
          PO Number:{" "}
          <Text style={styles.normalText}>
            {prevOrderDetails?.ponumber || "N/A"}
          </Text>
        </Text>

        <Text style={styles.boldText}>
          Invoice No:{" "}
          <Text style={styles.normalText}>
            {prevOrderDetails?.invoiceNo || "N/A"}
          </Text>
        </Text>

        <Text style={styles.boldText}>
          Total:
          <Text style={styles.normalText}>
            {"$" + prevOrderDetails?.orderTotal?.toFixed(2)}
          </Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => AllAddtoCart()}>
        <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
        <Text style={styles.btnLabel}>Add All Avaialable Items to Cart </Text>
      </TouchableOpacity>

      <TableHeader />
      <FlatList
        data={prevOrderDetails?.orderDetails}
        keyExtractor={(item) => item.itemNo}
        renderItem={({ item, index }) => {
          const itemName = item?.item?.itemNo + " - " + item?.item?.description;
          const imageUri = item?.image;
          return (
            <View key={index} style={styles.tableRow}>
              <View
                style={{
                  flex: 0.5,
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    imageUri
                      ? { uri: imageUri }
                      : require("../assets/images/notFound.png")
                  }
                  style={styles.img}
                  contentFit="contain"
                />
                <Text style={[styles.value]}>{itemName}</Text>
              </View>
              <Text style={[styles.value, { flex: 0.2 }]}>{item.qty}</Text>
              <Text style={[styles.value, { flex: 0.2 }]}>{item.qtyType}</Text>
              <View style={{ flex: 0.1, alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="cart-plus"
                  size={24}
                  color="red"
                  onPress={() => IndAddtoCart(item)}
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default PreviousOrderDetails;

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  container: {
    marginHorizontal: 10,
    padding: 10,
  },
  boldText: {
    fontWeight: "bold",
    marginVertical: 3,
  },
  normalText: {
    fontWeight: "normal",
    marginLeft: 10,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    textAlign: "center",
  },
  img: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: Colors.main,
    padding: 10,
    margin: 10,
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnLabel: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
