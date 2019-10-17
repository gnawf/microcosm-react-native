//@flow

import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import Realm from "realm";

import RealmContext from "~/utils/RealmContext";

export default function ({ children }: {
  children: any,
}) {
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    Realm.open(config).then(setRealm);

    return () => {
      if (realm != null) {
        realm.close();
      }
    };
  }, []);

  if (realm == null) {
    return null;
  }

  return (
    <RealmContext.Provider value={realm}>
      {children}
    </RealmContext.Provider>
  );
}

const NovelSchema = {
  name: "Novel",
  primaryKey: "id",
  properties: {
    id: "string",
    url: "string",
    title: "string",
    description: "string?",
    image: "string?",
  },
};


const ChapterSchema = {
  name: "Chapter",
  primaryKey: "id",
  properties: {
    id: "string",
    url: "string",
    previous: "string?",
    next: "string?",
    title: "string",
    contents: "string?",
  },
};

const LibrarySchema = {
  name: "Library",
  primaryKey: "id",
  properties: {
    id: "string",
    novel: "Novel",
  },
};

const config = {
  schema: [
    NovelSchema,
    ChapterSchema,
    LibrarySchema,
  ],
  deleteRealmIfMigrationNeeded: true,
};
