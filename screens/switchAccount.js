import { View, ScrollView, FlatList, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSwitchAccountRes } from "../redux/reducers/userReducer";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const SwitchAccount = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.accessToken);
  const switchAccount = useSelector((state) => state.user.switchAccountRes);

  console.log("switchAccount", switchAccount);

  useEffect(() => {
    dispatch(fetchSwitchAccountRes({ token }));
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerText, { width: 100 }]}>AcctNo</Text>
      <Text style={[styles.headerText, { width: 150 }]}>FirstName</Text>
      <Text style={[styles.headerText, { width: 150 }]}>LastName</Text>
      <Text style={[styles.headerText, { width: 150 }]}>Company</Text>
      <Text style={[styles.headerText, { width: 150 }]}>Phone1</Text>
      <Text style={[styles.headerText, { width: 150 }]}>Phone2</Text>
      <Text style={[styles.headerText, { width: 250 }]}>Address</Text>
      <Text style={[styles.headerText, { width: 150 }]}></Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.rowContainer}>
      <Text style={[styles.rowText, { width: 100 }]}>{item.acctNo}</Text>
      <Text style={styles.rowText}>{item?.firstName}</Text>
      <Text style={styles.rowText}>{item.lastName}</Text>
      <Text style={styles.rowText}>{item.company}</Text>
      <Text style={styles.rowText}>{item.phone1}</Text>
      <Text style={styles.rowText}>{item.phone2}</Text>
      <Text style={[styles.rowText, { width: 250 }]}>
        {item.address1 + " " + item.city1 + " " + item.state1}
      </Text>
      <View style={styles.rowText}>
        <MaterialIcons name="done" size={24} color={Colors.main} />
      </View>
    </View>
  );

  return (
    <ScrollView horizontal={true}>
      <View>
        {renderHeader()}
        <FlatList
          data={switchAccount}
          renderItem={renderItem}
          keyExtractor={(item) => item.AcctNo} // Assuming AcctNo is a number
        />
      </View>
    </ScrollView>
  );
};

export default SwitchAccount;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    backgroundColor: "lightgrey",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    // padding: 5,
  },
  rowContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  rowText: {
    flex: 1,
    textAlign: "center",
    width: 150,
    alignItems: "center",
  },
});
