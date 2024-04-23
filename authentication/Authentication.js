import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Import ActivityIndicator for loading indication
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/reducers/userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Authentication = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.user.isLoading);
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);

  // get company name from async storage
  const getCompanyName = async () => {
    try {
      const value = await AsyncStorage.getItem("companyName");
      if (value !== null) {
        setCompanyName(value);
      }
    } catch (e) {
      console.log("Error getting company name from async storage", e);
    }
  };

  useEffect(() => {
    getCompanyName();
  }, []);

  const handleLogin = () => {
    const newErrors = {};
    if (!companyName) newErrors.companyName = "Company name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (email && !validateEmail(email))
      newErrors.email = "Please enter a valid email";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(
        loginUser({ emailAddress: email, password: password, companyName })
      );
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
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
          <Text style={styles.welcomeText}></Text>
          <KeyboardAvoidingView behavior="padding" style={styles.inputGroup}>
            <Text style={styles.title}>Company Name</Text>
            <TextInput
              style={[styles.input, errors.companyName && styles.errorInput]}
              placeholder="Enter your company name"
              value={companyName}
              onChangeText={(text) => {
                setCompanyName(text);
                setErrors((prevState) => ({ ...prevState, companyName: "" }));
              }}
            />
            {errors.companyName && (
              <Text style={styles.errorText}>{errors.companyName}</Text>
            )}

            <Text style={styles.title}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prevState) => ({ ...prevState, email: "" }));
              }}
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={styles.title}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.errorInput]}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prevState) => ({ ...prevState, password: "" }));
              }}
              secureTextEntry
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </KeyboardAvoidingView>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          {/* Display error message if there's an error */}
          {error && (
            <Text style={{ color: "red", marginTop: 5, textAlign: "center" }}>
              {error}
            </Text>
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {
    // paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
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
    padding: Platform.OS === "ios" ? 15 : 8,
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 8,
    fontSize: 16,
    borderRadius: 10,
    width: "100%",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 6,
    marginLeft: 6,
  },
  title: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 6,
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    width: "80%",
  },
  loginText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});

export default Authentication;
