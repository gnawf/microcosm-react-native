// @flow

import React from "react";
import {
  Icon,
} from "react-native-elements";

import Colors from "~/constants/Colors";

const style = {
  marginBottom: -3,
};

export default function TabBarIcon({ name, type, focused }: {
  name: string,
  type: string,
  focused: boolean,
}) {
  return (
    <Icon
      name={name}
      type={type}
      size={26}
      style={style}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
