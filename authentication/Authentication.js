import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator, // Import ActivityIndicator for loading indication
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/reducers/userReducer";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.user.isLoading);
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);

  const handleLogin = () => {
    dispatch(loginUser({ emailAddress: email, password: password }));
    console.log(email, password);
  };

  return (
    <View style={styles.container}>
      {/* Conditional rendering based on authentication state */}
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : user ? (
        <>
          <Text>Welcome, {user.emailAddress}!</Text>
          {/* Optionally, navigate to another screen or show different content */}
        </>
      ) : (
        <>
          {/* Show login form if not loading and no user */}
          <View style={styles.imgContainer}>
            <Image
              source={require("../assets/images/reg.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <KeyboardAvoidingView behavior="padding" style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </KeyboardAvoidingView>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          {/* Display error message if there's an error */}
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  welcomeText: {
    marginBottom: 30,
    fontSize: 25,
    textAlign: "center",
    margin: 7,
  },
  inputGroup: {
    width: "80%",
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 5,
    fontSize: 18,
    borderRadius: 20,
    width: "100%",
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "lightblue",
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 40,
  },
  loginText: {
    fontSize: 18,
  },
});

export default Authentication;
