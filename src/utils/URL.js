// @flow

import impl from "url";

type URL =  {
  auth: string;
  hash: string;
  host: string;
  hostname: string;
  href: string;
  path: string;
  pathSegments: Array<string>,
  pathname: string;
  protocol: string;
  search: string;
  slashes: boolean;
  resolve: (string) => string;
};

function parse(url: string): URL {
  const parsed = (impl.parse(url): any);
  // Base implementatino doesn't give path segments, parse it here
  parsed.pathSegments = parsed.path.split("/").filter((e) => e.length);
  return parsed;
}

export default {
  resolve: impl.resolve,
  parse,
};
