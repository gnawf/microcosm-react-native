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
import { Navigation } from "react-native-navigation";

import NovelsGridView from "~/components/NovelsGridView";
import { usePage } from "~/navigation/Pages";
import { useSources } from "~/navigation/Providers";

import type { Source } from "~/sources/API";

export default function CatalogPage() {
  const Sources = useSources();

  useTitle();

  return (
    <FlatList
      data={Sources.all}
      renderItem={(props) => <SourceView  {...props} />}
      keyExtractor={(source) => source.id}
    />
  );
}

function SourceView({ item }: {
  item: Source
}) {
  const navigate = useNavigate(item);

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

function useTitle() {
  const { id } = usePage();

  Navigation.mergeOptions(id, {
    topBar: {
      title: {
        text: "Catalog",
      },
    },
  });
}

function useNavigate(item: Source) {
  const { id } = usePage();

  return () => Navigation.push(id, {
    component: {
      name: "Source",
      passProps: {
        id: item.id,
      },
    },
  });
}
