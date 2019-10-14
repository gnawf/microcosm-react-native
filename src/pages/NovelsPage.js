// @flow

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
} from "react-native";

import NovelsGridView from "../components/NovelsGridView";
import RFNSource from "../sources/read-novel-full/RFNSource";

export default function NovelsPage() {
  const [novels, setNovels] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(1);

  const fetch = () => {
    if (!isLoading) {
      setLoading(true);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    (async () => {
      try {
        const src = new RFNSource();
        const items = await src.novels.list({ cursor });
        setHasMore(items.length > 0);
        setNovels([...novels, ...items]);
        setCursor(cursor + 1);
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

NovelsPage.navigationOptions = {
  header: null,
};
