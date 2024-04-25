import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyInfo,
  previousOrder,
  setLogout,
} from "../redux/reducers/userReducer";
import { toggleSound } from "../redux/reducers/cartReducer";
import {
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  MaterialIcons,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";

const Menu = ({ navigation }) => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state) => state.user.companyInfo);
  const soundEnabled = useSelector((state) => state.entities.cart.soundEnabled);
  const acctNo = useSelector((state) => state.user.user.acctNo);

  const MenuList = [
    {
      id: 0,
      name: "Profile",
      icon: "user",
      screen: "profile",
      type: "AntDesign",
    },
    {
      id: 1,
      name: "PreviousOrder",
      icon: "package",
      screen: "PreviousOrder",
      type: "Feather",
    },
    {
      id: 2,
      name: "Switch Account",
      icon: "switch-account",
      screen: "SwitchAccount",
      type: "MaterialIcons",
    },
    {
      id: 3,
      name: "Location",
      icon: "location-outline",
      menuInfo: companyInfo?.addressLine1 + "\n" + companyInfo?.addressLine2,
      type: "Ionicons",
    },
    {
      id: 4,
      name: "Call Us",
      icon: "phone",
      screen: "CallUs",
      menuInfo: companyInfo?.phone,
      type: "Feather",
    },
    {
      id: 5,
      name: "Email",
      icon: "email-outline",
      screen: "Email",
      menuInfo: companyInfo?.newOrderEmail,
      type: "MaterialCommunityIcons",
    },
    {
      id: 6,
      name: "Fax",
      icon: "fax",
      menuInfo: companyInfo?.fax1 + "\n" + companyInfo?.fax2,
      screen: "Fax",
    },
    {
      id: 7,
      name: "Terms & Conditions",
      icon: "questioncircleo",
      screen: "Terms & Conditions",
      type: "AntDesign",
    },
    {
      id: 8,
      name: "Privacy Policy",
      icon: "policy",
      screen: "privacyPolicy",
      type: "MaterialIcons",
    },
    {
      id: 9,
      name: "Play Sound",
      icon: "sound",
      screen: "PlaySound",
      menuInfo: soundEnabled ? "On" : "Off",
      type: "AntDesign",
    },
    {
      id: 10,
      name: "Version",
      icon: "versions",
      screen: "VersionNumber",
      menuInfo: "1.1.0",
      type: "Octicons",
    },
    {
      id: 11,
      name: "Log Out",
      icon: "logout",
      screen: "LogOut",
      type: "MaterialIcons",
    },
  ];

  const handleLogout = () => {
    dispatch(setLogout());
    console.log("User logged out");
  };
  const handleMenuOption = (option) => {
    console.log(`${option} was selected`);
    if (option === "Play Sound") {
      dispatch(toggleSound()); // Toggle sound option
    }
  };
  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.menuContainer}>
          {MenuList.map((item, index) => (
            <View style={styles.menuItemRow} key={index}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {item.type === "AntDesign" ? (
                  <AntDesign name={item.icon} size={21} color="grey" />
                ) : item?.type === "Feather" ? (
                  <Feather name={item.icon} size={21} color="grey" />
                ) : item?.type === "MaterialIcons" ? (
                  <MaterialIcons name={item.icon} size={21} color="grey" />
                ) : item?.type === "Ionicons" ? (
                  <Ionicons name={item.icon} size={21} color="grey" />
                ) : item?.type === "Octicons" ? (
                  <Octicons name={item.icon} size={21} color="grey" />
                ) : (
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={21}
                    color="grey"
                  />
                )}

                <TouchableOpacity
                  disabled={
                    item?.name == "Play Sound"
                      ? false
                      : item?.menuInfo
                      ? true
                      : false
                  }
                  onPress={() => {
                    if (item.name === "Log Out") {
                      handleLogout();
                    } else if (item.name == "Play Sound") {
                      handleMenuOption("Play Sound");
                    } else {
                      navigation.navigate(item.screen);
                    }
                  }}
                  activeOpacity={0.1}
                >
                  <Text style={styles.menuItem}>{item.name}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.menuInfo}>{item?.menuInfo}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuContainer: {
    marginTop: 14,
  },
  menuItem: {
    marginLeft: 12,
  },
  menuItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    padding: 13,
  },
  menuInfo: {
    color: "blue",
  },
});

export default Menu;
