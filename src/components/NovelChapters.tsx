import React, {
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  Text,
} from "react-native";

import { Chapter, NovelId } from "sources/API";
import ChapterListItem from "components/ChapterListItem";
import { useSources } from "navigation/Providers";

export default function NovelChapters({ id, host, ListHeaderComponent }: {
  id: NovelId,
  host: string,
  ListHeaderComponent?: JSX.Element,
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

function useChapters(id: NovelId, host: string) {
  const Sources = useSources();
  const [chapters, setChapters] = useState<Chapter[] | null>(null);
  const [isLoading, setLoading] = useState(true);

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
