import React, { useState, useEffect } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";

import AppNavigator from "./src/navigation/AppNavigator";
import Realm from "./src/components/Realm";
import Sources from "./src/components/Sources";

export default function App(props) {
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <StatusBar barStyle="default" />}
      <Realm>
        <Sources>
          <AppNavigator />
        </Sources>
      </Realm>
    </View>
  );
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
