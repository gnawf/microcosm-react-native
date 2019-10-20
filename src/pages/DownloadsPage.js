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

export default function DownloadsPage() {
  const [ignored, forceUpdate] = useReducer((x) => !x, false);
  const realm = useRealm();

  const chapters = useMemo(() => {
    return realm.objects("Chapter").filtered("contents != null");
  }, [realm]);

  useEffect(() => {
    const listener = () => forceUpdate();
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
