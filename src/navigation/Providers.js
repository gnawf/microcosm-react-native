import Realm from "realm";

import realm from "~/providers/Realm";
import sources from "~/providers/Sources";

let init = false;

const globals = {
};

export async function bootstrap() {
  if (init) {
    return;
  }

  init = true;

  globals.realm = await realm(globals);
  globals.sources = sources(globals);
}

// @flow

export function useRealm(): Realm {
  return globals.realm;
}

export function useSources(): Sources {
  return globals.sources;
}
