// @flow

import React, { useContext, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";
import { Image } from "react-native-elements";
import { Navigation } from "react-native-navigation";

import URL from "~/utils/URL";
import { Pages, usePage } from "~/navigation/Pages";

import type { Novel } from "~/sources/API";

type Fetch = () => void;

export default function NovelsGridView({ novels, size = 100, fetch, hasMore }: {
  novels: Array<Novel>,
  size?: number,
  fetch?: Fetch,
  hasMore: boolean,
}) {
  const items = hasMore ? [...novels, null] : [...novels];

  return (
    <FlatGrid
      items={items}
      itemDimension={size}
      renderItem={(props) => <NovelView {...props} />}
      onEndReached={fetch}
      onEndReachedThreshold={0.0}
    />
  );
}

function NovelView({ item }: {
  item: ?Novel,
}) {
  if (item == null) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  const navigate = useNavigate(item);

  return (
    <View key={item.id} style={styles.novel}>
      <TouchableOpacity onPress={navigate}>
        <Image
          style={styles.cover}
          source={{ uri: item.image }}
        />
        <Text style={styles.title} numberOfLines={4}>
          {item.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function useNavigate(novel: ?Novel) {
  const { id } = usePage();

  if (novel == null) {
    return null;
  }

  return () => {
    const host = URL.parse(novel.url).host;

    Navigation.push(id, {
      component: {
        name: Pages.novel,
        passProps: {
          id: novel.id,
          host,
        },
      },
    });
  };
}

const styles = StyleSheet.create({
  novel: {
    flex: 1,
  },
  cover: {
    height: 150,
    resizeMode: "cover",
  },
  title: {
    marginTop: 8,
    textAlign: "center",
  },
  loading: {
    flex: 1,
  },
});
