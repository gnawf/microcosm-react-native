// @flow

import React, {
  useMemo,
  useReducer,
  useEffect,
} from "react";
import {
  FlatList,
} from "react-native";

import { Chapter } from "sources/API";
import ChapterListItem from "components/ChapterListItem";
import { Navigation } from "react-native-navigation";
import { usePage } from "navigation/Pages";
import { useRealm } from "navigation/Providers";


export default function DownloadsPage() {
  const [ignored, forceUpdate] = useReducer((x) => !x, false);
  const realm = useRealm();

  const chapters: Realm.Results<Chapter> = useMemo(() => {
    return realm.objects("Chapter").filtered("contents != null") as Realm.Results<any>;
  }, [realm]);

  useEffect(() => {
    const listener = () => forceUpdate(null);
    chapters.addListener(listener);
    return () => chapters.removeListener(listener);
  }, [chapters]);

  useTitle();

  return (
    <FlatList
      data={chapters}
      renderItem={render}
      keyExtractor={(chapter) => chapter.id}
    />
  );
}

function render({ item: chapter }: { item: Chapter }) {
  return <ChapterListItem chapter={chapter} />;
}

function useTitle() {
  const { id } = usePage();

  useEffect(() => {
    Navigation.mergeOptions(id, {
      topBar: {
        title: {
          text: "Downloads",
        },
      },
    });
  }, []);
}
