import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { previousOrder } from "../redux/reducers/userReducer";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";

const PreviousOrder = ({ navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.accessToken);
  const acctNo = useSelector((state) => state.user.user.acctNo);
  const prevOrder = useSelector((state) => state.user.previousOrders);

  useEffect(() => {
    dispatch(previousOrder({ acctNo, token }));
  }, []);

  const orderDetails = (orderNo) => {
    navigation.navigate("previousOrderDetails", {
      orderNo: orderNo,
    });
  };

  const TableHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>Order No</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.4 }]}>Date</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>Total</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>Status</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TableHeader />
      <FlatList
        data={prevOrder}
        keyExtractor={(item) => item.orderNo}
        renderItem={({ item }) => {
          const formattedDate = moment(item?.dateCreated).format("M/D/YYYY");
          const formattedTime = moment(item?.dateCreated).format("h:mm:ss A");

          return (
            <View style={styles.tableRow}>
              <Text style={[styles.value, { flex: 0.2 }]}>{item.orderNo}</Text>
              <View style={{ flex: 0.4 }}>
                <Text style={styles.value}>{formattedDate}</Text>
                <Text style={styles.value}>{formattedTime}</Text>
              </View>
              <Text style={[styles.value, { flex: 0.2 }]}>
                {"$" + item.orderTotal?.toFixed(2)}
              </Text>

              <View style={{ flex: 0.2, alignItems: "center" }}>
                <MaterialIcons
                  onPress={() => orderDetails(item?.orderNo)}
                  name="card-giftcard"
                  size={24}
                  color="grey"
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default PreviousOrder;

const styles = StyleSheet.create({
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
});
