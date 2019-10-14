// @flow

import { Chapters, Novels, Source } from "../API";

const cheerio = require("cheerio-without-node-native");

import type { Chapter, Novel } from "../API";

const host = "https://readnovelfull.com";

export default class RFNSource implements Source {
  name: string;
  novels: Novels;
  chapters: Chapters;

  constructor() {
    this.name = "read-full-novels";
    this.novels = new _Novels();
    this.chapters = new _Chapters();
  }
}

class _Novels implements Novels {
  async list({ cursor }) {
    return this.query({
      page: (cursor: number),
    });
  }

  async search(query) {
    return this.query({});
  }

  async query({ query = "", page = 1 }: {
    query?: string,
    page?: number,
  }) {
    const novels: Array<Novel> = [];

    const url = `${host}/search?keyword=${encodeURIComponent(query)}&page=${page}`;

    const result = await fetch(url);

    const body = await result.text();

    const $ = cheerio.load(body);

    const rows = $(".list-novel .row");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const anchor = $(row).find(".novel-title a");
      const title = anchor.text().trim();
      const image = $(row).find("img.cover").attr("src");

      if (!anchor.length) {
        continue;
      }

      const href = anchor.attr("href");

      // Gets the last path segment & strips out any file extension
      const id = href.match(/\/([^/]+?)(\.[a-z]+)?\/?$/i)[1];

      if (href.indexOf("/search?keyword") >= 0) {
        continue;
      }

      novels.push({
        id,
        url: href,
        title,
        description: null,
        image: image.replace(/t-\d+x\d+/i, "t-300x439"),
      });
    }

    return novels;
  }
}

class _Chapters implements Chapters {
  async get(key: any) {
    return null;
  }

  async list(novel: string) {
    return [];
  }
}
