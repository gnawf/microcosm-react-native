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
  View,
} from "react-native";
import {
  ListItem,
} from "react-native-elements";
import { Navigation } from "react-native-navigation";

import URL from "~/utils/URL";
import ChapterListItem from "~/components/ChapterListItem";
import { Pages, usePage } from "~/navigation/Pages";
import { useSources } from "~/navigation/Providers";

import type { Chapter, NovelKey } from "~/sources/API";

export default function NovelChapters({ id, host, ListHeaderComponent }: {
  id: NovelKey,
  host: string,
  ListHeaderComponent?: typeof React.Component | Function,
}) {
  const { chapters, isLoading } = useChapters(id, host);

  return (
    <FlatList
      data={chapters || []}
      renderItem={render}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={isLoading ? LoadingView : null}
    />
  );
}

function useChapters(id: NovelKey, host: string) {
  const Sources = useSources();
  const [chapters, setChapters] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const source = Sources.by.host[host];
    source.chapters.list(id, {}).then(setChapters).finally(() => setLoading(false));
  }, [isLoading]);

  return {
    chapters,
    isLoading,
  };
}

function render({ item: chapter }: { item: Chapter }) {
  return <ChapterListItem chapter={chapter} />;
}

function keyExtractor(chapter: Chapter) {
  return chapter.id;
}

function LoadingView() {
  return <Text style={styles.loading}>Loading…</Text>;
}

const styles = StyleSheet.create({
  loading: {
    margin: 16,
  },
});
