import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import NovelsPage from "../pages/NovelsPage";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const HomeStack = createStackNavigator(
  { Home: NovelsPage },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-information-circle" />,
};

HomeStack.path = "";

const tabNavigator = createBottomTabNavigator({
  HomeStack,
});

tabNavigator.path = "";

export default tabNavigator;
