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

const LibraryStack = createStackNavigator(
  Pages,
  {
    initialRouteName: "Library",
  },
  config,
);

LibraryStack.navigationOptions = {
  tabBarLabel: "Library",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
};

const DownloadsStack = createStackNavigator(
  Pages,
  {
    initialRouteName: "Downloads",
  },
  config,
);

DownloadsStack.navigationOptions = {
  tabBarLabel: "Downloads",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-download" />,
};

const tabNavigator = createBottomTabNavigator({
  CatalogStack,
  LibraryStack,
  DownloadsStack,
});

tabNavigator.path = "";

export default tabNavigator;
