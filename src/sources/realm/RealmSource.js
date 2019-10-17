// @flow

import Realm from "realm";

import type { Chapter, Chapters, Novel, Novels, Source } from "~/sources/API";

export type Mode = "load" | "save";

export default class RealmSource implements Source {
  _source: Source;
  novels: Novels;
  chapters: Chapters;

  get id() { return this._source.id; }
  get name() { return this._source.name; }
  get hosts() { return this._source.hosts; }

  constructor(source: Source, realm: Realm, mode: Mode) {
    this._source = source;
    this.novels = new _Novels(source, realm, mode);
    this.chapters = new _Chapters(source, realm, mode);
  }
}

class _Novels implements Novels {
  _source: Source;
  _realm: Realm;
  _mode: Mode;

  get _novels() { return this._source.novels; };

  constructor(source: Source, realm: Realm, mode: Mode) {
    this._source = source;
    this._realm = realm;
    this._mode = mode;
  }

  async get(id) {
    switch (this._mode) {
      case "load":
        return this._realm.objects("Novel").filtered("id = $0", id)[0];
      case "save":
        const result = await this._novels.get.apply(this._novels, arguments);
        this._persist([result]);
        return result;
      default:
        throw new Error("stub");
    }
  }

  async list({ cursor }) {
    switch (this._mode) {
      case "load":
        return this._realm.objects("Novel");
      case "save":
        const result = await this._novels.list.apply(this._novels, arguments);
        this._persist(result);
        return result;
      default:
        throw new Error("stub");
    }
  }

  async search(query) {
    switch (this._mode) {
      case "save":
        const result = await this._novels.search.apply(this._novels, arguments);
        this._persist(result);
        return result;
      default:
        throw new Error("stub");
    }
  }

  _persist(novels: Array<Novel>) {
    const realm = this._realm;

    realm.write(() => {
      for (const novel of novels) {
        realm.create("Novel", novel, "modified");
      }
    });
  }
}

class _Chapters implements Chapters {
  _source: Source;
  _realm: Realm;
  _mode: Mode;

  get _chapters() { return this._source.chapters; };

  constructor(source: Source, realm: Realm, mode: Mode) {
    this._source = source;
    this._realm = realm;
    this._mode = mode;
  }

  async get(url: string) {
    switch (this._mode) {
      case "load":
        return this._realm.objects("Chapter").filtered("url = $0", url)[0];
      case "save":
        const result = await this._chapters.get.apply(this._chapters, arguments);
        this._persist([result]);
        return result;
      default:
        throw new Error("stub");
    }
  }

  async list(id, { cursor }) {
    switch (this._mode) {
      case "save":
        const result = await this._chapters.list.apply(this._chapters, arguments);
        this._persist(result);
        return result;
      default:
        throw new Error("stub");
    }
  }

  _persist(chapters: Array<Chapter>) {
    const realm = this._realm;
    const query = realm.objects("Chapter");

    realm.write(() => {
      for (let chapter of chapters) {
        // Keep old contents
        if (chapter.contents == null) {
          const results = query.filtered("id = $0", chapter.id);
          if (results[0] != null) {
            chapter = { ...chapter, contents: results[0].contents };
          }
        }

        realm.create("Chapter", chapter, "modified");
      }
    });
  }
}
