// @flow

import React, {
  useMemo,
  useReducer,
  useEffect,
} from "react";
import {
  FlatList,
} from "react-native";

import ChapterListItem from "~/components/ChapterListItem";
import { Navigation } from "react-native-navigation";
import { usePage } from "~/navigation/Pages";
import { useRealm } from "~/navigation/Providers";

import type { Chapter } from "~/sources/API";

export default function RecentsPage() {
  const realm = useRealm();

  const entries = useMemo(() => {
    return realm.objects("ReadingLog").sorted("date", true);
  }, [realm]);

  useAutoUpdate(entries);

  useTitle();

  return (
    <FlatList
      data={entries}
      renderItem={render}
      keyExtractor={(entry) => entry.date.toString()}
    />
  );
}

function render({ item }: {
  item: {
    chapter: Chapter,
  },
}) {
  return <ChapterListItem chapter={item.chapter} />;
}

function useAutoUpdate(query) {
  const [ignored, forceUpdate] = useReducer((x) => !x, false);

  useEffect(() => {
    const listener = () => forceUpdate();
    query.addListener(listener);
    return () => query.removeListener(listener);
  }, [query]);
}

function useTitle() {
  const { id } = usePage();

  useEffect(() => {
    Navigation.mergeOptions(id, {
      topBar: {
        title: {
          text: "Recents",
        },
      },
    });
  }, []);
}
