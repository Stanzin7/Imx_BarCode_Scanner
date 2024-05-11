import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  FlatList,
  Keyboard,
} from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchItems, searchItems } from "../redux/reducers/userReducer";
import ItemProductCard from "../components/ItemProductCard";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

const SearchItem = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.accessToken);
  const acctNo = useSelector((state) => state.user.user.acctNo);
  const searchItemsData = useSelector((state) => state.user.searchItems);
  const loading = useSelector((state) => state.user.isLoading);
  const [searchAccount, setSearchAccount] = React.useState("");
  const isFocused = useIsFocused();

  const handleItemSearch = () => {
    Keyboard.dismiss();
    dispatch(searchItems({ barcodeId: searchAccount, token, acctNo }));
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(clearSearchItems());
    }
  }, [isFocused]);

  const renderNoData = () => {
    if (searchItemsData == null || searchItemsData?.length === 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 17 }}>No data found!</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.main} />
        </View>
      )}

      <View style={styles.wrapcontainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Items"
          placeholderTextColor={Colors.dark}
          returnKeyType="done"
          onChangeText={(text) => {
            if (text.length === 0) {
              dispatch(clearSearchItems());
            }
            setSearchAccount(text);
          }}
          value={searchAccount}
          onSubmitEditing={handleItemSearch}
        />
        <TouchableOpacity style={styles.submit} onPress={handleItemSearch}>
          <FontAwesome5 name="search" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchItemsData}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 100,
        }}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.itemNo}
        renderItem={({ item }) => {
          const itemDetails = item;
          return (
            <ItemProductCard
              key={itemDetails?.itemNo}
              imageUrl={itemDetails?.imageUrl}
              itemNo={itemDetails?.itemNo}
              description={itemDetails?.description}
              sellPriceCase1={itemDetails?.sellPriceCase1}
              unitsPerCase={itemDetails?.unitsPerCase}
              sellPriceUnit={itemDetails?.sellPriceUnit}
              size={itemDetails?.size}
              pack={itemDetails?.pack}
            />
          );
        }}
        ListEmptyComponent={renderNoData}
      />
    </>
  );
};

export default SearchItem;
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  wrapcontainer: {
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
  },
  flatList: {
    marginTop: 20,
  },
});
