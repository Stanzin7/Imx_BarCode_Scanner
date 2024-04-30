import Toast from "react-native-root-toast";

const ShowToast = (message, type) => {
  const commonOptions = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    textColor: "white",
    opacity: 1,
    fontSize: 16,
  };

  let specificOptions = {};

  switch (type) {
    case "success":
      specificOptions = { backgroundColor: "green" };
      break;
    case "error":
      specificOptions = { backgroundColor: "red" };
      break;
    case "warning":
      specificOptions = { backgroundColor: "orange" };
      break;
    case "info":
      specificOptions = { backgroundColor: "blue" };
      break;
    default:
      specificOptions = { backgroundColor: "gray" };
  }

  Toast.show(message, { ...commonOptions, ...specificOptions });
};

export default ShowToast;
