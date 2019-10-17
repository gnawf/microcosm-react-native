import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";

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
  tabBarIcon: ({ focused }) => <TabBarIcon
    focused={focused}
    name="md-information-circle-outline"
    type="ionicon"
  />,
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
  tabBarIcon: ({ focused }) => <TabBarIcon
    focused={focused}
    name="md-book"
    type="ionicon"
  />,
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
  tabBarIcon: ({ focused }) => <TabBarIcon
    focused={focused}
    name="md-download"
    type="ionicon"
  />,
};

const tabNavigator = createBottomTabNavigator({
  CatalogStack,
  LibraryStack,
  DownloadsStack,
});

tabNavigator.path = "";

export default tabNavigator;
