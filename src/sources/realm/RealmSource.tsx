import Realm, { UpdateMode } from "realm";

import { NovelId, Chapter, Chapters, Novel, Novels, Source } from "sources/API";

export type Mode = "load" | "save";

export default class RealmSource implements Source {
  id: string;
  name: string;
  hosts: Array<string>;
  novels: Novels;
  chapters: Chapters;

  constructor(source: Source, realm: Realm, mode: Mode) {
    this.id = source.id;
    this.name = source.name;
    this.hosts = source.hosts;
    this.novels = new _Novels(source, realm, mode);
    this.chapters = new _Chapters(source, realm, mode);
  }
}

class _Novels implements Novels {
  _novels: Novels;
  _realm: Realm;
  _mode: Mode;

  constructor(source: Source, realm: Realm, mode: Mode) {
    this._novels = source.novels;
    this._realm = realm;
    this._mode = mode;
  }

  async get(id: NovelId) {
    switch (this._mode) {
      case "load":
        return this._realm.objects<Novel>("Novel").filtered("id = $0", id)[0];
      case "save":
        const result = await this._novels.get.apply(this._novels, [id]);
        if (result != null) {
          this._persist([result]);
        }
        return result;
      default:
        throw new Error("stub");
    }
  }

  async list(args: {
    cursor?: any,
  }) {
    switch (this._mode) {
      case "load":
        return this._realm.objects<Novel>("Novel") as any as Novel[];
      case "save":
        const result = await this._novels.list.apply(this._novels, [args]);
        this._persist(result);
        return result;
      default:
        throw new Error("stub");
    }
  }

  async search(query: string) {
    switch (this._mode) {
      case "save":
        const result = await this._novels.search.apply(this._novels, [query]);
        this._persist(result);
        return result;
      default:
        throw new Error("stub");
    }
  }

  _persist(novels: Novel[] | null) {
    if (novels == null) {
      return;
    }

    const realm = this._realm;

    realm.write(() => {
      for (const novel of novels) {
        realm.create("Novel", novel, UpdateMode.Modified);
      }
    });
  }
}

class _Chapters implements Chapters {
  _chapters: Chapters;
  _realm: Realm;
  _mode: Mode;

  constructor(source: Source, realm: Realm, mode: Mode) {
    this._chapters = source.chapters;
    this._realm = realm;
    this._mode = mode;
  }

  async get(url: string) {
    switch (this._mode) {
      case "load":
        return this._realm.objects<Chapter>("Chapter").filtered("url = $0", url)[0];
      case "save":
        const result = await this._chapters.get.apply(this._chapters, [url]);
        if (result != null) {
          this._persist([result]);
        }
        return result;
      default:
        throw new Error("stub");
    }
  }

  async list(id: NovelId, args: {
    cursor?: any,
  }) {
    switch (this._mode) {
      case "save":
        const result = await this._chapters.list.apply(this._chapters, [id, args]);
        this._persist(result);
        return result;
      default:
        throw new Error("stub");
    }
  }

  _persist(chapters: Array<Chapter> | null) {
    if (chapters == null) {
      return;
    }

    const realm = this._realm;

    // Determine which incomplete chapters already exist in the database
    // We do not want to insert incomplete chapters if they already exist
    const incomplete = chapters.filter((chapter) => chapter.contents == null);
    let inserts = chapters.length;
    let doNotCreate: { [key: string]: boolean } = {};

    // Query in chunks otherwise Realm crashes
    const chunkSize = 1247;
    const numChunks = Math.ceil(incomplete.length / chunkSize);
    for (let chunkNo = 0; chunkNo < numChunks; chunkNo++) {
      const offset = chunkNo * chunkSize;
      const chunk = incomplete.slice(offset, offset + chunkSize);

      const ids = chunk.map((_, index) => `id = $${index}`).join(" OR ");
      const values = chunk.map((chapter) => chapter.id);
      const query = realm.objects<Chapter>("Chapter").filtered(ids, ...values);

      doNotCreate = query.reduce((object, chapter) => {
        inserts--;
        object[chapter.id] = true;
        return object;
      }, doNotCreate);
    }

    // Do nothing
    if (inserts === 0) {
      return;
    }

    realm.write(() => {
      for (const chapter of chapters) {
        if (doNotCreate[chapter.id]) {
          continue;
        }
        realm.create("Chapter", chapter, UpdateMode.Modified);
      }
    });
  }
}
