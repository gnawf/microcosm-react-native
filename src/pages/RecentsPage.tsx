// @flow

import React, {
  useMemo,
  useReducer,
  useEffect,
} from "react";
import {
  FlatList,
} from "react-native";
import Realm from "realm";

import { ReadingLog } from "sources/API";
import ChapterListItem from "components/ChapterListItem";
import { Navigation } from "react-native-navigation";
import { usePage } from "navigation/Pages";
import { useRealm } from "navigation/Providers";

export default function RecentsPage() {
  const realm = useRealm();

  const entries: Realm.Results<ReadingLog> = useMemo(() => {
    return realm.objects("ReadingLog").filtered("date != null SORT(date DESC) DISTINCT(chapter.novelId)") as Realm.Results<any>;
  }, [realm]);

  useTitle();
  useAutoUpdate(entries);

  return (
    <FlatList
      data={entries}
      renderItem={render}
      keyExtractor={(entry) => entry.date.toString()}
    />
  );
}

function render({ item }: {
  item: ReadingLog,
}) {
  return <ChapterListItem chapter={item.chapter} />;
}

function useAutoUpdate(query: Realm.Results<ReadingLog>) {
  const [ignored, forceUpdate] = useReducer((x) => !x, false);

  useEffect(() => {
    const listener = () => forceUpdate(null);
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
