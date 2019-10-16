// @flow

import React, {
  useState,
  useEffect,
  useContext,
} from "react";
import {
  View,
  Text,
} from "react-native";
import { NavigationContext } from "react-navigation";

import NovelsGridView from "~/components/NovelsGridView";
import RealmContext from "~/utils/RealmContext";
import RFNSource from "~/sources/read-novel-full/RFNSource";
import SourceContext from "~/sources/SourceContext";

import type { Source, Novel } from "~/sources/API";

export default function SourcePage(props: {
  props: Object,
}) {
  const navigation = useContext(NavigationContext);
  const { byId } = useContext(SourceContext);

  const id = navigation.getParam("id");
  const source = byId[id];

  return <Page {...props} source={source} />;
}

function Page({ source }: {
  source: Source,
}) {
  const realm = useContext(RealmContext);
  const [novels, setNovels] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(1);

  const fetch = () => {
    if (!isLoading) {
      setLoading(true);
    }
  };

  const persist = (novels: Array<Novel>) => realm.write(() => {
    for (const novel of novels) {
      realm.create("Novel", novel, "modified");
    }
  });

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    (async () => {
      try {
        const items = await source.novels.list({ cursor });
        setHasMore(items.length > 0);
        setNovels([...novels, ...items]);
        setCursor(cursor + 1);
        persist(items);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoading]);

  return (
    <NovelsGridView
      novels={novels}
      fetch={fetch}
      hasMore={hasMore}
    />
  );
}

SourcePage.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("title"),
  };
};
