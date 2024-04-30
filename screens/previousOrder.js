import { StyleSheet, Text, View, FlatList,ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { previousOrder } from "../redux/reducers/userReducer";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";

const PreviousOrder = ({ navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.accessToken);
  const acctNo = useSelector((state) => state.user.user.acctNo);
  const prevOrder = useSelector((state) => state.user.previousOrders);
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(previousOrder({ acctNo, token }));
  }, []);

  const orderDetails = (orderNo) => {
    navigation.navigate("previousOrderDetails", {
      orderNo: orderNo,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.main}  />
      </SafeAreaView>
    );
  }

  if(prevOrder?.length === 0) {
    return (
      <SafeAreaView style={styles.safeAreaContainerEmptyCart}>
          <Text style={styles.text}>
            You have no previous orders.
          </Text>
      </SafeAreaView>
    )
  }

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
        renderItem={({ item, index }) => {
          const formattedDate = moment(item?.dateCreated).format("M/D/YYYY");
          const formattedTime = moment(item?.dateCreated).format("h:mm:ss A");

          return (
            <View key={index} style={styles.tableRow}>
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
  safeAreaContainerEmptyCart: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
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
  text: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
    color: "grey",
  },
});
