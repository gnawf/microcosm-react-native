// @flow

export type NovelId = string;

export type ChapterId = string;

export type URL = string;

export type Novel = {
  +id: NovelId,
  +url: string,
  +title: string,
  +description: ?string,
  +image: ?string,
};

export type Chapter = {
  +id: ChapterId,
  +url: URL,
  +previous: ?URL,
  +next: ?URL,
  +title: string,
  +contents: ?string,
  +novelId: NovelId,
  +novel: ?Novel,
}

export interface Source {
  +id: string;
  +name: string;
  +hosts: Array<string>;
  +novels: Novels;
  +chapters: Chapters;
}

export interface Novels {
  get(id: NovelId): Promise<?Novel>;
  list(args: {
    cursor?: any,
  }): Promise<Array<Novel>>;
  search(query: string): Promise<Array<Novel>>;
}

export interface Chapters {
  get(url: string): Promise<?Chapter>;
  list(id: NovelId, args: {
    cursor?: any,
  }): Promise<Array<Chapter>>;
}
