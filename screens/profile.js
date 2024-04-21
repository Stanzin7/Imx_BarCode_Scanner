import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const customers = user?.customers[0];
  console.log("user", user);

  const [firstName, setFirstName] = useState(customers?.firstName);
  const [lastName, setLastName] = useState(customers?.lastName);
  const [email, setEmail] = useState(user?.emailAddress);
  const [phone1, setPhone1] = useState(customers?.phone1);
  const [phone2, setPhone2] = useState(customers?.phone2);
  const [address, setAddress] = useState(
    customers?.address1 +
      " " +
      customers?.address2 +
      " " +
      customers?.city1 +
      " " +
      customers?.state1 +
      " " +
      customers?.zipcode1
  );

  return (
    <View style={styles.container}>
      <Text>Full Name</Text>
      <Text style={styles.label}>
        {firstName} {lastName}
      </Text>
      <View style={styles.separator}></View>

      <Text>Email</Text>
      <Text style={styles.label}>{email}</Text>

      <View style={styles.separator}></View>

      <Text>Phone1</Text>
      <Text style={styles.label}>{phone1}</Text>

      <View style={styles.separator}></View>

      <Text>Phone2</Text>
      <Text style={styles.label}>{phone2}</Text>

      <View style={styles.separator}></View>

      <Text>Address</Text>
      <Text style={styles.label}>{address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 5,
    fontWeight: "600",
    color: "black",
    opacity: 0.8,
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "lightgrey",
    marginVertical: 10,
  },
});

export default Profile;
