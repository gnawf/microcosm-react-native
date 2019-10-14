// @flow

import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NavigationContext } from "react-navigation";
import { FlatGrid } from "react-native-super-grid";

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
  item: Novel | null,
}) {
  const navigation = useContext(NavigationContext);

  if (item == null) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  const navigate = () => navigation.navigate("Novel", { novel: item });

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
