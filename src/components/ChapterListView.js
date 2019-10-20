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
import { Navigation } from "react-native-navigation";

import URL from "~/utils/URL";
import { Pages, usePage } from "~/navigation/Pages";
import { useSources } from "~/navigation/Providers";

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
  const Sources = useSources();

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

function ChapterView({ item }: {
  item: Chapter,
}) {
  const navigate = useNavigate(item);

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

function useNavigate(chapter: Chapter) {
  const { id } = usePage();

  return () => Navigation.push(id, {
    component: {
      name: Pages.chapter,
      passProps: {
        url: chapter.url,
      },
    },
  });
}

function LoadingView() {
  return <Text style={styles.loading}>Loading…</Text>;
}

const styles = StyleSheet.create({
  loading: {
    margin: 16,
  },
});
