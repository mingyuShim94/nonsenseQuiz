import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Stage from "../Screens/Stage";
import StageSelect from "../Screens/StageSelect";
const NativeStack = createNativeStackNavigator();

const Stack = () => {
  return (
    <NativeStack.Navigator screenOptions={{ headerShown: false }}>
      <NativeStack.Screen name="StageSelect" component={StageSelect} />
      <NativeStack.Screen name="Stage" component={Stage} />
    </NativeStack.Navigator>
  );
};

export default Stack;
