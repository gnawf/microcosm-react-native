// @flow

import Realm from "realm";

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

export default function build(): Realm {
  return Realm.open(config);
}
