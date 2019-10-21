import Realm from "realm";
import realm from "providers/Realm";
import sources, { Sources } from "providers/Sources";

let init = false;

// @ts-ignore
const globals: {
  realm: Realm,
  sources: Sources,
} = {
};

export async function bootstrap() {
  if (init) {
    return;
  }

  init = true;

  // @ts-ignore
  globals.realm = await realm(globals);
  // @ts-ignore
  globals.sources = sources(globals);
}

export function useRealm(): Realm {
  return globals.realm;
}

export function useSources(): Sources {
  return globals.sources;
}
