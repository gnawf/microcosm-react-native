// @flow

import React, {
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Navigation } from "react-native-navigation";

import { Library } from "sources/API";
import NovelsGridView from "components/NovelsGridView";
import { usePage } from "navigation/Pages";
import { useRealm } from "navigation/Providers";

export default function LibraryPage() {
  const realm = useRealm();
  const [ignored, forceUpdate] = useReducer((x) => !x, false);

  const library: Realm.Results<Library> = useMemo(() => realm.objects("Library"), [realm]);

  useTitle();

  // Auto update view on Realm updates
  useEffect(() => {
    const listener = () => forceUpdate(null);
    library.addListener(listener);
    return () => library.removeListener(listener);
  }, [library]);

  const novels = library.map((entry) => entry.novel);

  return (
    <NovelsGridView
      novels={novels}
      hasMore={false}
    />
  );
}

function useTitle() {
  const { id } = usePage();

  Navigation.mergeOptions(id, {
    topBar: {
      title: {
        text: "Library",
      },
    },
  });
}
