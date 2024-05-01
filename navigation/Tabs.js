import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Scanner from "../screens/scanner";
import KeyPad from "../screens/keyPad";
import Cart from "../screens/cart";
import Menu from "../screens/menu";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PreviousOrder from "../screens/previousOrder";
import PreviousOrderDetails from "../screens/previousOrderDetails";
import SwitchAccount from "../screens/switchAccount";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import TeamsCondition from "../screens/teamsCondition";
import PrivacyPolicy from "../screens/privacyPolicy";
import Profile from "../screens/profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const customStyle = {
  fontSize: 15,
  fontWeight: "bold",
  lineHeight: 20,
  color: "white",
};
const Tabs = () => {
  const company = useSelector((state) => state.user.user?.customers[0]);
  return (
    <Tab.Navigator>
      {/* <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              <Text style={customStyle}>IMX</Text>
              <Text
                numberOfLines={1}
                style={[
                  customStyle,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Welcome {company?.company + " - " + company?.acctNo}
              </Text>
            </View>
          ),
        }}
      /> */}

      <Tab.Screen
        name="Scanner"
        component={Scanner}
        options={{
          tabBarLabel: "Scan",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="barcode-scan"
              size={size}
              color={color}
            />
          ),
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              {/* <Text style={customStyle}>IMX</Text> */}
              <Text
                numberOfLines={1}
                style={[
                  customStyle,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Welcome {company?.company}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="KeyPad"
        component={KeyPad}
        options={{
          tabBarLabel: "KeyPad",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="keypad" color={color} size={size} />
          ),
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              {/* <Text style={customStyle}>IMX</Text> */}
              <Text
                numberOfLines={1}
                style={[
                  customStyle,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Welcome {company?.company}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-cart" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              {/* <Text style={customStyle}>IMX</Text> */}
              <Text
                numberOfLines={1}
                style={[
                  customStyle,
                  {
                    marginBottom: 5,
                  },
                ]}
              >
                Welcome {company?.company}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="reorder-three-outline" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: "IMX",
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreviousOrder"
        component={PreviousOrder}
        options={{
          title: "Previous Orders",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />

      <Stack.Screen
        name="previousOrderDetails"
        component={PreviousOrderDetails}
        options={{
          title: "Order Details",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />

      <Stack.Screen
        name="SwitchAccount"
        component={SwitchAccount}
        options={{
          title: "Switch Account",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />

      <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />

      <Stack.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={{
          title: "Privacy Policy",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />

      <Stack.Screen
        name="termsAndConditions"
        component={TeamsCondition}
        options={{
          title: "Terms & Conditions",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
