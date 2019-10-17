// @flow

import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  ListItem,
} from "react-native-elements";
import { NavigationContext } from "react-navigation";

import NovelsGridView from "~/components/NovelsGridView";
import SourceContext from "~/utils/SourceContext";

import type { Source } from "~/sources/API";

export default function CatalogPage() {
  const Sources = useContext(SourceContext);

  return (
    <FlatList
      data={Sources.all}
      renderItem={(props) => <SourceView {...props} />}
      keyExtractor={(source) => source.id}
    />
  );
}

function SourceView({ item }: {
  item: Source
}) {
  const navigation = useContext(NavigationContext);

  const navigate = () => navigation.navigate("Source", { id: item.id, title: item.name });

  return (
    <TouchableOpacity onPress={navigate}>
      <Card onClick={navigate}>
        <Text>
          {item.name}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

CatalogPage.navigationOptions = {
  title: "Catalog",
};
