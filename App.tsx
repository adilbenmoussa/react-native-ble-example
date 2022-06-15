import React, { useState } from "react";
import {StyleSheet, Text, View, Button} from "react-native";

const Separator = () => (
    <View style={styles.separator} />
);

const App = () => {
  const [inrValue, setINRValue] = useState(0.0);
  const [isConnected, setIsConnected] = useState(true);

  const setINR = () => {
    setINRValue(inrValue + 1);
  };

  const onConnectToMicroINR = () => {
    setINRValue(inrValue + 1);
  };

  const renderActions = () => {
    if (isConnected) {
      return <>
        <Button onPress={onConnectToMicroINR} title="Connect to microINR"></Button>
        <Button onPress={onConnectToMicroINR} title="Stop connection"></Button>
      </>
    }
    else
      return  <Button onPress={onConnectToMicroINR} title="Connect to microINR"></Button>
  }

  return (
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>INR value: {inrValue}</Text>
        </View>
        <Separator/>
        <View style={styles.actions}>
          {renderActions()}
        </View>
        <Separator/>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>Connection status: connectionStatus</Text>
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: 10
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  },
  countText: {
    color: "#FF00FF"
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
