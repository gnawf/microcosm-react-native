// @flow

import React, { createContext } from "react";

import RFNSource from "~/sources/read-novel-full/RFNSource";

import type { Source } from "~/sources/API";

type StringToSource = {
  [string]: Source
};

type SourceContextValue = {
  sources: Array<Source>,
  byHost: StringToSource,
  byId: StringToSource,
};

const sources = [
  new RFNSource(),
];

const byId: StringToSource = {};
const byHost: StringToSource = {};

for (const source of sources) {
  byId[source.id] = source;
  for (const host of source.hosts) {
    byHost[host] = source;
  }
}

const value: SourceContextValue = {
  sources,
  byHost,
  byId,
};

export const SourceContext = createContext<SourceContextValue>(value);
