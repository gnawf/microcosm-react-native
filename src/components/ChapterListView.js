// @flow

import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ListItem,
} from "react-native-elements";
import { NavigationContext } from "react-navigation";

import SourceContext from "~/utils/SourceContext";
import URL from "~/utils/URL";

import type { Chapter, NovelKey } from "~/sources/API";

export default function ({ id, host, ListHeaderComponent }: {
  id: NovelKey,
  host: string,
  ListHeaderComponent?: typeof React.Component | Function,
}) {
  return (
    <FetchChapters
      Component={ChapterListView}
      ListHeaderComponent={ListHeaderComponent}
      id={id}
      host={host}
    />
  );
}

function FetchChapters({ Component, id, host, ...props }: {
  Component: typeof React.Component | Function,
  id: NovelKey,
  host: string,
}) {
  const [chapters, setChapters] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const Sources = useContext(SourceContext);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const source = Sources.by.host[host];
    source.chapters.list(id, {}).then(setChapters).finally(() => setLoading(false));
  }, [isLoading]);

  return (
    <Component {...props} chapters={chapters} isLoading={isLoading} />
  );
}

function ChapterListView({ chapters, isLoading, ListHeaderComponent }: {
  chapters: Array<Chapter>,
  isLoading: boolean,
  ListHeaderComponent: typeof React.Component | Function,
}) {
  return (
    <FlatList
      data={isLoading ? [] : chapters}
      renderItem={render}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={isLoading ? LoadingView : null}
    />
  );
}

function render(props) {
  return <ChapterView {...props} />;
}

function keyExtractor(chapter: Chapter) {
  return chapter.id;
}

function ChapterView({ item }) {
  const navigation = useContext(NavigationContext);

  const navigate = () => navigation.navigate("Chapter", { url: item.url });

  return (
    <TouchableOpacity onPress={navigate}>
      <ListItem
        title={item.title}
        chevron={true}
        bottomDivider
      />
    </TouchableOpacity>
  );
}

function LoadingView() {
  return <Text style={styles.loading}>Loading…</Text>;
}

const styles = StyleSheet.create({
  loading: {
    margin: 16,
  },
});
