// @flow

import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  ListItem,
} from "react-native-elements";
import { NavigationContext } from "react-navigation";

import SourceContext from "~/sources/SourceContext";
import URL from "~/utils/URL";

import type { NovelKey, Chapter } from "~/sources/API";

export default function ({ id, host }: {
  id: NovelKey,
  host: string,
}) {
  return (
    <FetchChapters
      Component={ChapterListView}
      id={id}
      host={host}
    />
  );
}

function FetchChapters({ Component, id, host }: {
  Component: typeof React.Component | Function,
  id: NovelKey,
  host: string,
}) {
  const [chapters, setChapters] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const { byHost } = useContext(SourceContext);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    (async () => {
      const source = byHost[host];
      const chapters = await source.chapters.list(id);
      setChapters(chapters);
      setLoading(false);
    })();
  }, [isLoading]);

  if (isLoading) {
    return <Text>Loading…</Text>;
  }

  return (
    <Component chapters={chapters} />
  );
}

function ChapterListView({ chapters }: {
  chapters: Array<Chapter>,
}) {
  return (
    <FlatList
      data={chapters}
      renderItem={(props) => <ChapterView {...props} />}
      keyExtractor={(chapter) => chapter.id}
    />
  );
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
