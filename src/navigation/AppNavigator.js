import { createAppContainer, createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "~/navigation/MainTabNavigator";
import Pages from "~/navigation/Pages";

export default createAppContainer(
  createSwitchNavigator({
    Main: MainTabNavigator,
    ...Pages,
  }),
);
