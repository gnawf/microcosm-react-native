import { createBrowserApp } from "@react-navigation/web";
import { createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "~/navigation/MainTabNavigator";
import Pages from "~/navigation/Pages";

const switchNavigator = createSwitchNavigator({
  Main: MainTabNavigator,
  ...Pages,
});

switchNavigator.path = "";

export default createBrowserApp(switchNavigator);
