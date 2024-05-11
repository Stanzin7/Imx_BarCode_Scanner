import {
  View,
  ScrollView,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSwitchAccountRes,
  searchAccounts,
  selectSwitchAccount,
} from "../redux/reducers/userReducer";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";

const SwitchAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.accessToken);
  const switchAccount = useSelector((state) => state.user.switchAccountRes);
  const loading = useSelector((state) => state.user.isLoading);
  const [searchAccount, setSearchAccount] = React.useState("");

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

  const handleManualSearch = () => {
    if (searchAccount) {
      dispatch(searchAccounts({ token, searchAccount }));
    }
  };

  const renderItem = ({ item, index }) => (
    <View key={index} style={styles.rowContainer}>
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
        <MaterialIcons
          onPress={() => {
            dispatch(
              selectSwitchAccount({ acctNo: item.acctNo, token, navigation })
            );
          }}
          name="done"
          size={24}
          color={Colors.main}
        />
      </View>
    </View>
  );

  return (
    <>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.main} />
        </View>
      )}

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search By Account No or Company"
          placeholderTextColor={Colors.dark}
          returnKeyType="done"
          onChangeText={(text) => {
            if (text.length === 0) {
              dispatch(fetchSwitchAccountRes({ token }));
            }
            setSearchAccount(text);
          }}
          value={searchAccount}
          onSubmitEditing={handleManualSearch}
        />
        <TouchableOpacity style={styles.submit} onPress={handleManualSearch}>
          <FontAwesome5 name="search" size={22} color="white" />
        </TouchableOpacity>
      </View>

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
    </>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  container: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    zIndex: 10,
  },
  input: {
    height: 50,
    flex: 0.78,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    color: Colors.dark,
  },
  submit: {
    backgroundColor: Colors.main,
    justifyContent: "center",
    borderRadius: 5,
    flex: 0.2,
    height: 50,
    alignItems: "center",
  },
});
