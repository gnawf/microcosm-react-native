// @flow

import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Button,
  ListItem,
} from "react-native-elements";
import { NavigationContext } from "react-navigation";
import HTML from "react-native-htmlview";

import SourceContext from "~/utils/SourceContext";
import URL from "~/utils/URL";

import type { ChapterKey, Chapter } from "~/sources/API";

export default function ChapterPage() {
  const navigation = useContext(NavigationContext);
  const url: string = navigation.getParam("url");

  const onLoad = (chapter: ?Chapter) => {
    navigation.setParams({ chapter });
  };

  return (
    <FetchChapter Component={Page} url={url} onLoad={onLoad} />
  );
}

function FetchChapter({ Component, url, onLoad }: {
  Component: typeof React.Component | Function,
  url: string,
  onLoad: (?Chapter) => void,
}) {
  const host = useMemo(() => URL.parse(url).host, [url]);
  const [chapter, setChapter] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const Sources = useContext(SourceContext);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    Sources.cached.by.host[host].chapters.get(url)
      .then((chapter) => {
        if (chapter != null && chapter.contents != null) {
          setChapter(chapter);
          setLoading(false)
        }
      });

    Sources.by.host[host].chapters.get(url)
      .then(setChapter)
      .finally(() => setLoading(false));
  }, [isLoading]);

  useEffect(() => onLoad(chapter), [chapter]);

  if (isLoading) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  return (
    <Component chapter={chapter} />
  );
}

function Page({ chapter }: {
  chapter: Chapter,
}) {
  if (chapter == null) {
    return null;
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

function NavButtons({ chapter }: {
  chapter: Chapter,
}) {
  const navigation = useContext(NavigationContext);

  const navigateNext = () => navigation.replace("Chapter", { url: chapter.next });
  const navigatePrev = () => navigation.replace("Chapter", { url: chapter.previous });

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
  navigate: () => void,
}) {
  return (
    <Button
      title={text}
      onPress={navigate}
      disabled={disabled}
      type="clear"
    />
  );
}

const styles = StyleSheet.create({
  scrollable: {
    paddingVertical: 4,
  },
  loading: {
    margin: 16,
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

ChapterPage.navigationOptions = ({ navigation }) => {
  const { title }: Chapter = navigation.getParam("chapter") || {};

  return {
    title,
  };
};
