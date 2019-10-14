import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";

import TabBarIcon from "~/components/TabBarIcon";
import Pages from "~/navigation/Pages";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const CatalogStack = createStackNavigator(
  Pages,
  {
    initialRouteName: "Catalog",
  },
  config,
);

CatalogStack.navigationOptions = {
  tabBarLabel: "Catalog",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-information-circle" />,
};

CatalogStack.path = "";

const tabNavigator = createBottomTabNavigator({
  CatalogStack,
});

tabNavigator.path = "";

export default tabNavigator;
