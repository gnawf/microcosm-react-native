// @flow

export type NovelKey = string;

export type ChapterKey = string;

export type URL = string;

export type Novel = {
  +id: NovelKey,
  +url: string,
  +title: string,
  +description: ?string,
  +image: ?string,
};

export type Chapter = {
  +id: ChapterKey,
  +url: URL,
  +previous: ?URL,
  +next: ?URL,
  +title: string,
  +contents: ?string,
}

export interface Source {
  +id: string;
  +name: string;
  +hosts: Array<string>;
  +novels: Novels;
  +chapters: Chapters;
}

export interface Novels {
  get(id: NovelKey): Promise<?Novel>;
  list(args: {
    cursor?: any,
  }): Promise<Array<Novel>>;
  search(query: string): Promise<Array<Novel>>;
}

export interface Chapters {
  get(url: string): Promise<?Chapter>;
  list(id: NovelKey, args: {
    cursor?: any,
  }): Promise<Array<Chapter>>;
}
