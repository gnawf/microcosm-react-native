// @flow

import Realm from "realm";
import RealmSource from "~/sources/realm/RealmSource";
import RNFSource from "~/sources/read-novel-full/RNFSource";

import type { Source } from "~/sources/API";
import type { Mode } from "~/sources/realm/RealmSource";

type StringToSource = {
  [string]: Source
};

type Values = {
  all: Array<Source>,
  by: {
    id: StringToSource,
    host: StringToSource,
  }
};

export type Sources = {
  ...Values,
  cached: Values,
};

const sources = [
  new RNFSource(),
];

function build(realm: Realm, mode: Mode) {
  const all: Array<Source> = sources.map((source) => new RealmSource(source, realm, mode));

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

export default function ({ realm }: {
  realm: Realm,
}) {
  return {
    ...build(realm, "save"),
    cached: {
      ...build(realm, "load"),
      cached: null,
    },
  };
}
