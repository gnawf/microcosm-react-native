// @flow

export type Novel = {
  +id: string,
  +url: string,
  +title: string,
  +description: ?string,
  +image: ?string,
};

export type Chapter = {
  +id: string,
  +title: string,
  +contents: string,
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
  list(args: {
    cursor: any,
  }): Promise<Array<Novel>>;
  search(query: string): Promise<Array<Novel>>;
}

export interface Chapters {
  get(key: any): Promise<?Chapter>;
  list(novel: string, args: {
    cursor: any,
  }): Promise<Array<Chapter>>;
}
