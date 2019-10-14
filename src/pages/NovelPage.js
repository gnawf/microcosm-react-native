import React from "react";
import {
  View,
} from "react-native";

export default function NovelPage() {
  return (
    <View>
      
    </View>
  );
}

NovelPage.navigationOptions = ({ navigation }) => {
  const novel = navigation.getParam("novel") || {};

  return {
    title: novel.title,
  };
};
