// @flow

import React, {
  useContext,
  useState,
} from "react";

import Realm from "realm";
import RNFSource from "~/sources/read-novel-full/RNFSource";
import RealmSource from "~/sources/realm/RealmSource";
import RealmContext from "~/utils/RealmContext";
import SourceContext from "~/utils/SourceContext";

import type { Source } from "~/sources/API";
import type { Mode } from "~/sources/realm/RealmSource";

const sources = [
  new RNFSource(),
];

export default function Sources({ children }: {
  children: any,
}) {
  const realm = useContext(RealmContext);

  const [value] = useState(() => {
    return {
      ...build(realm, "save"),
      cached: {
        ...build(realm, "load"),
        cached: null,
      },
    };
  });

  return (
    <SourceContext.Provider value={value}>
      {children}
    </SourceContext.Provider>
  );
}

function build(realm: Realm, mode: Mode) {
  // Cache all the results from the sources
  const all = sources.map((source) => new RealmSource(source, realm, mode));

  const id = {};
  const host = {};

  for (const source of all) {
    id[source.id] = source;
    for (const key of source.hosts) {
      host[key] = source;
    }
  }

  return {
    all,
    by: {
      id,
      host,
    },
  };
}
