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
    novelId: "string",
    novel: "Novel?",
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

const ReadingLogSchema = {
  name: "ReadingLog",
  properties: {
    date: "date",
    chapter: "Chapter",
  },
};

const config = {
  schema: [
    NovelSchema,
    ChapterSchema,
    LibrarySchema,
    ReadingLogSchema,
  ],
  deleteRealmIfMigrationNeeded: true,
};

export default function build(): Realm {
  return Realm.open(config);
}
