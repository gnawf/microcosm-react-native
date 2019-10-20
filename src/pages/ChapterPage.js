// @flow

import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  ListItem,
} from "react-native-elements";
import HTML from "react-native-htmlview";
import { Navigation } from "react-native-navigation";

import URL from "~/utils/URL";
import { Pages, usePage } from "~/navigation/Pages";
import { useSources } from "~/navigation/Providers";

import type { Chapter, ChapterKey } from "~/sources/API";

export default function ChapterPage({ url }: {
  url: string,
}) {
  const { chapter, isLoading } = useChapter(url);

  useTitle(chapter);

  if (isLoading) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  if (chapter == null) {
    return <Text style={styles.error}>Unable to load chapter</Text>;
  }

  return (
    <ScrollView style={styles.scrollable}>
      <NavButtons chapter={chapter} />

      <HTML
        value={chapter.contents}
        style={styles.content}
        stylesheet={stylesheet}
      />

      <NavButtons chapter={chapter} />
    </ScrollView>
  );
}

function useChapter(url) {
  const Sources = useSources();
  const host = useMemo(() => URL.parse(url).host, [url]);
  const [chapter, setChapter] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Trigger load when URL changes
  useEffect(() => setLoading(true), [url]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    Sources.cached.by.host[host].chapters.get(url)
      .then((chapter) => {
        if (chapter != null && chapter.contents != null) {
          setChapter(chapter);
          setLoading(false);
        }
      });

    Sources.by.host[host].chapters.get(url)
      .then(setChapter)
      .finally(() => setLoading(false));
  }, [isLoading]);

  return {
    chapter,
    isLoading,
  };
}

function NavButtons({ chapter }: {
  chapter: Chapter,
}) {
  const navigateNext = useNavigate(chapter.next);
  const navigatePrev = useNavigate(chapter.previous);

  return (
    <View style={styles.navButtons}>
      <NavButton
        text="Previous"
        disabled={chapter.previous == null}
        navigate={navigatePrev}
      />

      <NavButton
        text="Next"
        disabled={chapter.next == null}
        navigate={navigateNext}
      />
    </View>
  );
}

function NavButton({ text, disabled, navigate }: {
  text: string,
  disabled: boolean,
  navigate: ?() => void,
}) {
  return (
    <Button
      title={text}
      onPress={navigate}
      disabled={disabled || navigate == null}
      type="clear"
    />
  );
}

function useTitle(chapter: ?Chapter) {
  const { id } = usePage();

  if (chapter == null) {
    return;
  }

  Navigation.mergeOptions(id, {
    topBar: {
      title: {
        text: chapter.title,
      },
    },
  });
}

function useNavigate(url: ?string) {
  const { id } = usePage();

  if (url == null) {
    return null;
  }

  return () => Navigation.push(id, {
    component: {
      name: Pages.chapter,
      passProps: {
        url: url,
      },
    },
  });
}

const styles = StyleSheet.create({
  scrollable: {
    paddingVertical: 4,
  },
  loading: {
    margin: 16,
  },
  error: {
    margin: 16,
    color: "red",
  },
  content: {
    marginHorizontal: 16,
  },
  navButtons: {
    margin: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const stylesheet = StyleSheet.create({
  p: {
    fontSize: 14,
    textAlign: "justify",
  },
  h1: {
    fontWeight: "bold",
    fontSize: 20,
  },
  h2: {
    fontWeight: "bold",
    fontSize: 18,
  },
  h3: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
