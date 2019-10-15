// @flow

import impl from "url";

type URL =  {
  auth: string;
  hash: string;
  host: string;
  hostname: string;
  href: string;
  path: string;
  pathname: string;
  protocol: string;
  search: string;
  slashes: boolean;
  resolve: (string) => string;
};

function parse(url: string): URL {
  return (impl.parse(url): any);
}

export default {
  parse,
};
