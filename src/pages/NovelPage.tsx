import React, {
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Divider,
  Image,
  ListItem,
} from "react-native-elements";
import HTML from "react-native-htmlview";
import { Navigation } from "react-native-navigation";
import { UpdateMode } from "realm";

import { Novel } from "sources/API";
import NovelChapters from "components/NovelChapters";
import { usePage } from "navigation/Pages";
import { useRealm } from "navigation/Providers";
import { useSources } from "navigation/Providers";
import { useIcon } from "utils/Icons";

export default function NovelPage({ id, host }: {
  id: string,
  host: string,
}) {
  const { novel, isLoading } = useNovel(id, host);

  useTitle(novel);
  useLibraryButton(novel);

  if (isLoading) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  if (novel == null) {
    return <Text style={styles.error}>Unable to load novel</Text>;
  }

  return (
    <NovelChapters
      id={novel.id}
      host={host}
      ListHeaderComponent={<Header novel={novel} />}
    />
  );
}

function useNovel(id: string, host: string) {
  const Sources = useSources();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => setLoading(true), [id, host]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    Sources.by.host[host].novels.get(id).then(setNovel).finally(() => setLoading(false));
  }, [isLoading]);

  return {
    novel,
    isLoading,
  };
}

function Header({ novel }: {
  novel: Novel,
}) {
  return (
    <View>
      <Image
        style={styles.coverBackground}
        source={{ uri: novel.image || undefined }}
        blurRadius={2}
      />

      <View style={styles.container}>
        <Image
          style={styles.cover}
          source={{ uri: novel.image || undefined }}
        />
      </View>

      <Divider />

      <ListItem
        title={"Description"}
        titleStyle={styles.title}
        bottomDivider
      />

      <View style={styles.description}>
        <HTML value={novel.description || ""} />
      </View>

      <Divider />

      <ListItem
        title={"Chapters"}
        titleStyle={styles.title}
        bottomDivider
      />
    </View>
  );
}

function useTitle(novel: Novel | null) {
  const { id } = usePage();

  if (novel == null) {
    return;
  }

  Navigation.mergeOptions(id, {
    topBar: {
      title: {
        text: novel.title,
      },
    },
  });
}

function useLibraryButton(novel: Novel | null) {
  const [ignored, forceUpdate] = useReducer((x) => !x, false);

  const { id } = usePage();
  const add = useIcon("add", 20);
  const remove = useIcon("remove", 20);
  const realm = useRealm();

  // Query the library to see whether this novel exists
  const library = useMemo(() => {
    return realm.objects("Library").filtered("id = $0", novel ? novel.id : null);
  }, [realm, novel]);

  // Auto update navigation button upon library changes
  useEffect(() => {
    const listener = () => forceUpdate(null);
    library.addListener(listener);
    return () => library.removeListener(listener);
  }, [library]);

  // Handle button click
  useEffect(() => {
    const subscription = Navigation.events().registerNavigationButtonPressedListener((event) => {
      // Ensure button click should be handled by us
      if (event.componentId !== id || event.buttonId !== "library" || novel == null) {
        return;
      }

      realm.write(() => {
        if (library.length) {
          realm.delete(library);
        } else {
          realm.create("Library", { id: novel.id, novel }, UpdateMode.Modified);
        }
      });
    });

    // Note: cannot return subscription.remove directly as it errors out
    return () => subscription.remove();
  }, [novel]);

  // Set the top bar buttons
  Navigation.mergeOptions(id, {
    topBar: {
      rightButtons: novel == null || add == null || remove == null ? [] : [
        {
          id: "library",
          icon: library.length === 0 ? add : remove,
        },
      ],
    },
  });
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
  error: {
    margin: 16,
    color: "red",
  },
});
