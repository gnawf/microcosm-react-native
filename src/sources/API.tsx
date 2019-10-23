// @flow

export type NovelId = string;

export type ChapterId = string;

export type URL = string;

export interface Novel {
  id: NovelId;
  url: string;
  title: string;
  description: string | null;
  image: string | null;
};

export interface Chapter {
  id: ChapterId;
  url: URL;
  previous: URL | null;
  next: URL | null;
  title: string;
  contents: string | null;
  novelId: NovelId;
  novel: Novel | null;
};

export interface ReadingLog {
  id: string;
  date: Date;
  chapter: Chapter;
};

export interface Library {
  id: NovelId;
  novel: Novel;
};

export interface Source {
  id: string;
  name: string;
  hosts: string[];
  novels: Novels;
  chapters: Chapters;
}

export interface Novels {
  get(id: NovelId): Promise<Novel | null>;
  list(args: {
    cursor?: any,
  }): Promise<Novel[] | null>;
  search(query: string): Promise<Novel[] | null>;
}

export interface Chapters {
  get(url: string): Promise<Chapter | null>;
  list(id: NovelId, args: {
    cursor?: any,
  }): Promise<Chapter[] | null>;
}
