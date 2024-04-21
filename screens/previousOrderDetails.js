import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { previousOrderDetails } from "../redux/reducers/userReducer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

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

  useEffect(() => {
    dispatch(previousOrderDetails({ orderNo, acctNo, token }));
  }, []);

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

      <TableHeader />
      <FlatList
        data={prevOrderDetails?.orderDetails}
        keyExtractor={(item) => item.itemNo}
        renderItem={({ item }) => {
          console.log("item", item);
          const itemName = item?.item?.itemNo + " - " + item?.item?.description;
          const imageUri = item?.image;

          console.log("imageUri", imageUri);
          return (
            <View style={styles.tableRow}>
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
});
