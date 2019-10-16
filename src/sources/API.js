// @flow

export type NovelKey = string;

export type ChapterKey = string;

export type Novel = {
  +id: NovelKey,
  +url: string,
  +title: string,
  +description: ?string,
  +image: ?string,
};

export type Chapter = {
  +id: ChapterKey,
  +title: string,
  +contents: ?string,
  +url: string,
}

export interface Source {
  id: string;
  name: string;
  hosts: Array<string>;
  novels: Novels;
  chapters: Chapters;
}

export interface Novels {
  get(id: NovelKey): Promise<?Novel>;
  list(args: {
    cursor: any,
  }): Promise<Array<Novel>>;
  search(query: string): Promise<Array<Novel>>;
}

export interface Chapters {
  get(id: ChapterKey): Promise<?Chapter>;
  list(id: NovelKey, args?: {
    cursor: any,
  }): Promise<Array<Chapter>>;
}
