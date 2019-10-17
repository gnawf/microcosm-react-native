// @flow

import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { FlatList } from "react-native";

import RealmContext from "~/utils/RealmContext";
import NovelsGridView from "../components/NovelsGridView";

export default function LibraryPage() {
  const realm = useContext(RealmContext);
  const [ignored, forceUpdate] = useReducer((x) => !x, false);

  const library = useMemo(() => realm.objects("Library"), []);

  // Auto update view on Realm updates
  useEffect(() => {
    const listener = () => forceUpdate();
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

LibraryPage.navigationOptions = {
  title: "Library",
};
