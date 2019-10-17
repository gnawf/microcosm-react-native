// @flow

import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  Divider,
  Icon,
  Image,
  ListItem,
} from "react-native-elements";
import { NavigationContext } from "react-navigation";

import ChapterListView from "~/components/ChapterListView";
import SourceContext from "~/utils/SourceContext";
import RealmContext from "~/utils/RealmContext";
import URL from "~/utils/URL";

import type { Novel } from "~/sources/API";

export default function NovelPage() {
  const navigation = useContext(NavigationContext);
  const id: string = navigation.getParam("id");
  const host: string = navigation.getParam("host");

  const onLoad = (novel: ?Novel) => {
    navigation.setParams({ novel });
  };

  return (
    <FetchNovel Component={Page} id={id} host={host} onLoad={onLoad} />
  );
}

function FetchNovel({ Component, id, host, onLoad }: {
  Component: typeof React.Component | Function,
  id: string,
  host: string,
  onLoad: (?Novel) => void,
}) {
  const [novel, setNovel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const Sources = useContext(SourceContext);

  React.useEffect(() => {
    if (!isLoading) {
      return;
    }

    (async () => {
      try {
        const source = Sources.by.host[host];
        const novel = await source.novels.get(id);
        setNovel(novel);
        onLoad(novel);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoading]);

  if (isLoading) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  return <Component novel={novel} />;
}

function Page({ novel }: {
  novel: Novel,
}) {
  const host = useMemo(() => URL.parse(novel.url).host, [novel]);

  return (
    <ScrollView>
      <View>
        <Image
          style={styles.coverBackground}
          source={{ uri: novel.image }}
          blurRadius={2}
        />

        <View style={styles.container}>
          <Image
            style={styles.cover}
            source={{ uri: novel.image }}
          />
        </View>
      </View>

      <Divider />

      <ListItem
        title={"Description"}
        titleStyle={styles.title}
        bottomDivider
      />

      <Text style={styles.description}>
        {novel.description}
      </Text>

      <Divider />

      <ListItem
        title={"Chapters"}
        titleStyle={styles.title}
        bottomDivider
      />

      <ChapterListView
        id={novel.id}
        host={host}
      />
    </ScrollView>
  );
}

function LibraryButton() {
  const navigation = useContext(NavigationContext);
  const realm = useContext(RealmContext);
  const [ignored, forceUpdate] = useReducer((x) => !x, false);

  const novel: Novel = navigation.getParam("novel");
  const library = useMemo(() => {
    return realm.objects("Library").filtered("id = $0", novel ? novel.id : null);
  }, [novel]);

  useEffect(() => {
    const listener = () => forceUpdate();
    library.addListener(listener);
    return () => library.removeListener(listener);
  }, [library]);

  if (novel == null) {
    return null;
  }

  const toggle = () => realm.write(() => {
    if (library.length) {
      realm.delete(library);
    } else {
      realm.create("Library", { id: novel.id, novel }, "modified");
    }
  });

  return (
    <Icon
      name={library.length ? "remove" : "add"}
      onPress={toggle}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  title: {
    fontSize: 24,
  },
  description: {
    padding: 16,
    fontSize: 16,
    textAlign: "justify",
  },
  cover: {
    width: 131,
    height: 192,
  },
  coverBackground: {
    position: "absolute",
    flex: 1,
    height: 240,
  },
  loading: {
    margin: 16,
  },
});

NovelPage.navigationOptions = ({ navigation }) => {
  const { title }: Novel = navigation.getParam("novel") || {};

  return {
    title,
    headerRight: <LibraryButton />,
  };
};
