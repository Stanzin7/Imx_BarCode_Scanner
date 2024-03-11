import { View, Text, Button, SafeAreaView } from "react-native";
import React from "react";

const Menu = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Button title="Log Out" />
      </View>
    </SafeAreaView>
  );
};

export default Menu;
