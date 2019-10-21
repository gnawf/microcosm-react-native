import React, {
  useEffect,
  useState,
} from "react";
import { Navigation } from "react-native-navigation";

import { Novel, Source } from "sources/API";
import NovelsGridView from "components/NovelsGridView";
import { usePage } from "navigation/Pages";
import { useSources } from "navigation/Providers";

export default function SourcePage({ id, ...props }: {
  id: string,
  props: any[],
}) {
  const Sources = useSources();

  const source = Sources.by.id[id];

  return <Page {...props} source={source} />;
}

function Page({ source }: {
  source: Source,
}) {
  const { novels, hasMore, fetch } = useLoading(source);

  useTitle(source);

  return (
    <NovelsGridView
      novels={novels}
      fetch={fetch}
      hasMore={hasMore}
    />
  );
}

function useLoading(source: Source) {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    source.novels.list({ cursor }).then((items) => {
      setHasMore(items.length > 0);
      setNovels([...novels, ...items]);
      setCursor(cursor + 1);
    }).finally(() => setLoading(false));
  }, [isLoading]);

  const fetch = () => {
    if (!isLoading) {
      setLoading(true);
    }
  };

  return {
    novels,
    isLoading,
    hasMore,
    fetch,
  };
}

function useTitle(source: Source) {
  const { id } = usePage();

  useEffect(() => {
    if (source == null) {
      return;
    }

    Navigation.mergeOptions(id, {
      topBar: {
        title: {
          text: source.name,
        },
      },
    });
  }, [source]);
}
