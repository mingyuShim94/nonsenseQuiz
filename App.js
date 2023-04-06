import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Stack from "./Navigation/Stack";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import mobileAds from "react-native-google-mobile-ads";
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        mobileAds()
          .initialize()
          .then((adapterStatuses) => {
            // Initialization complete!
          });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        SplashScreen.hide();
      }
    }

    prepare();
  }, []);
  if (!appIsReady) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack />
    </NavigationContainer>
  );
}
