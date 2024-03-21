import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Scanner from "../screens/scanner";
import KeyPad from "../screens/keyPad";
import Cart from "../screens/cart";
import Menu from "../screens/menu";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
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
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: "IMX",
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
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: "IMX",
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
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 15,
          },
          headerTitle: "IMX",
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
}
