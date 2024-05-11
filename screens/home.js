import {
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../redux/reducers/userReducer";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import { ImageBackground } from "expo-image";

const Home = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.user.token);
  const category = useSelector((state) => state.user.category);
  const loading = useSelector((state) => state.user.isLoading);
  const company = useSelector((state) => state.user.user.company);
  const assetsUrl = company?.assetsUrl;

  useEffect(() => {
    if (isFocused) {
      console.log("Home is focused", token);
      dispatch(fetchCategory({ token }));
    }
  }, [isFocused]);

  const getCategoryAbbreviation = (webcatdesc) => {
    const words = webcatdesc.split(" ");
    const abbreviation = words.map((word) => word.charAt(0)).join("");
    return abbreviation;
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.main} />
        </View>
      )}
      <FlatList
        data={category}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
        renderItem={({ item, index }) => {
          console.log("item", item.thumbnail);
          return (
            <>
              <View
                key={index}
                style={{
                  width: 160,
                  height: 160,
                  margin: 10,
                  backgroundColor: "white",
                  elevation: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  source={{
                    uri:
                     ( item.thumbnail == null || item.thumbnail === "")
                        ? `${assetsUrl}/category.png`
                        : `${assetsUrl}/${item.thumbnail}`,
                  }}
                  style={{
                    width: 155,
                    height: 130,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  contentFit="fill"
                >
                  {(item.thumbnail === null || item.thumbnail === "") && (
                    <Text style={{ color: "black", fontSize: 55 }}>
                      {getCategoryAbbreviation(item.webcatdesc)}
                    </Text>
                  )}
                </ImageBackground>
              </View>
              <Text
                style={{ color: "black", fontSize: 15, textAlign: "center" }}
              >
                {item.webcatdesc}
              </Text>
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#f6f6f6",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity here
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
