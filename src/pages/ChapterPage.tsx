// @flow

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
} from "react-native-elements";
import HTML from "react-native-htmlview";
import { Navigation } from "react-native-navigation";
import { UpdateMode } from "realm";
import uuidv4 from "uuid/v4";

import URL from "utils/URL";
import { Chapter } from "sources/API";
import { usePage } from "navigation/Pages";
import { useRealm, useSources } from "navigation/Providers";

type OnPress = (event: GestureResponderEvent) => void;

export default function ChapterPage({ url: originalUrl }: {
  url: string,
}) {
  const [url, setUrl] = useState(originalUrl);

  const { chapter, isLoading } = useChapter(url);

  useTitle(chapter);
  useReadingLog(chapter);

  if (isLoading) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  if (chapter == null) {
    return <Text style={styles.error}>Unable to load chapter</Text>;
  }

  return (
    <ScrollView style={styles.scrollable}>
      <NavButtons chapter={chapter} navigate={setUrl} />

      <View style={styles.content}>
        <HTML
          value={chapter.contents || ""}
          stylesheet={stylesheet}
        />
      </View>

      <NavButtons chapter={chapter} navigate={setUrl} />
    </ScrollView>
  );
}

function useChapterHolder(url: string) :[
  Chapter | null,
  (chapter: Chapter | null) => void,
]{
  const urlRef = useRef<string>(url);

  // Store the URL as a reference so all old hooks can access the latest
  useEffect(() => { urlRef.current = url; }, [url]);

  const [chapter, setChapter] = useState<Chapter | null>(null);

  return [
    chapter,
    // Only update the chapter if the current hook's URL maches the latest URL
    (value) => { if (url == urlRef.current) setChapter(value); },
  ];
}

function useChapter(url: string) {
  const Sources = useSources();
  const host = useMemo(() => URL.parse(url).host, [url]);
  const [chapter, setChapter] = useChapterHolder(url);
  const [isLoading, setLoading] = useState(false);

  // Trigger load when URL changes
  useEffect(() => {
    setChapter(null);
    setLoading(true);
  }, [url]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const fetch = async () => {
      const promises = [
        Sources.cached.by.host[host].chapters.get(url),
        Sources.by.host[host].chapters.get(url),
      ];

      for (const promise of promises) {
        const chapter = await promise;
        // Contents are null if the chapter is just a ref
        if (chapter == null || chapter.contents == null) {
          continue;
        }
        setChapter(chapter);
        setLoading(false);
      }
    };

    fetch();
  }, [isLoading]);

  return {
    chapter,
    isLoading,
  };
}

function NavButtons({ chapter, navigate }: {
  chapter: Chapter,
  navigate: (url: string) => void,
}) {
  const chapters = useMemo(() => {
    const { previous, next } = chapter;

    return {
      previous: previous != null ? () => navigate(previous) : undefined,
      next: next != null ? () => navigate(next) : undefined,
    };
  }, [chapter]);

  return (
    <View style={styles.navButtons}>
      <NavButton text="Previous" navigate={chapters.previous} />
      <NavButton text="Next" navigate={chapters.next} />
    </View>
  );
}

function NavButton({ text, navigate }: {
  text: string,
  navigate: OnPress | undefined,
}) {
  return (
    <Button
      title={text}
      onPress={navigate}
      disabled={navigate == null}
      type="clear"
    />
  );
}

function useTitle(chapter: Chapter | null) {
  const { id } = usePage();

  useEffect(() => {
    if (chapter != null && chapter.title != null) {
      const match = chapter.title.match(/chapter\s+\d+/i);
      const title = match ? match[0] : chapter.title;
      Navigation.mergeOptions(id, {
        topBar: {
          title: {
            text: title,
          },
        },
      });
    }
  }, [chapter]);
}

function useReadingLog(chapter: Chapter | null) {
  const realm = useRealm();

  useEffect(() => {
    if (chapter == null) {
      return;
    }

    // Mark as read after 10 seconds on the page
    const id = setTimeout(() => {
      realm.write(() => {
        realm.create("ReadingLog", {
          id: uuidv4(),
          date: new Date(),
          chapter,
        }, UpdateMode.Modified);
      });
    }, 10000);

    return () => {
      clearTimeout(id);
    };
  }, [chapter]);
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
    fontSize: 16,
    textAlign: "justify",
  },
  h1: {
    fontWeight: "bold",
    fontSize: 22,
  },
  h2: {
    fontWeight: "bold",
    fontSize: 20,
  },
  h3: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
