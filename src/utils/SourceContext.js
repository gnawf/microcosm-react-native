// @flow

import React, { createContext } from "react";

import type { Source } from "~/sources/API";

type StringToSource = {
  [string]: Source
};

type Sources = {
  all: Array<Source>,
  by: {
    id: StringToSource,
    host: StringToSource,
  }
};

type SourcesWithCache = {
  ...Sources,
  cached: Sources,
};

export default createContext<SourcesWithCache>({});
