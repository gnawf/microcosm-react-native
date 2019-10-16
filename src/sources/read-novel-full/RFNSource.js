// @flow

import { Chapters, Novels, Source } from "~/sources/API";
import URL from "~/utils/URL";
import HTML from "~/utils/HTML";

import type { Chapter, Novel } from "~/sources/API";

const RFN_URL = URL.parse("https://readnovelfull.com");

export default class RFNSource implements Source {
  id: string;
  name: string;
  hosts: Array<string>;
  novels: Novels;
  chapters: Chapters;

  constructor() {
    this.id = "read-full-novel";
    this.name = "Read Full Novel";
    this.hosts = [RFN_URL.host];
    this.novels = new _Novels();
    this.chapters = new _Chapters();
  }
}

class _Novels implements Novels {
  async get(id) {
    const url = RFN_URL.resolve(`/${id}.html`);

    const result = await fetch(url);

    const body = await result.text();

    const $ = HTML.load(body);

    const title = $(".title").first().text().trim();
    const description = $(".desc-text").first().text().trim();
    const image = $(".book img").first().attr("src");

    return {
      id,
      url,
      title,
      description,
      image: image.replace(/t-\d+x\d+/i, "t-300x439"),
    };
  }

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

    const url = RFN_URL.resolve(`/search?keyword=${encodeURIComponent(query)}&page=${page}`);

    const result = await fetch(url);

    const body = await result.text();

    const $ = HTML.load(body);

    const rows = $(".list-novel .row");

    for (let i = 0; i < rows.length; i++) {
      const row = $(rows[i]);
      const anchor = row.find(".novel-title a");
      const title = anchor.text().trim();
      const image = row.find("img.cover").attr("src");

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
        url: URL.resolve(url, href),
        title,
        description: null,
        image: image.replace(/t-\d+x\d+/i, "t-300x439"),
      });
    }

    return novels;
  }
}

class _Chapters implements Chapters {
  async get(url) {
    const chapters: Array<Chapter> = [];

    const result = await fetch(url);

    const body = await result.text();

    const $ = HTML.load(body);

    const id = URL.parse(url).path.match(/\/(.*?)(?:\.[a-z]+)$/)[1];

    const title = $(".chr-title").text().match(/chapter\s+\d+/i)[0];

    const content = $("#chr-content").first();
    content.find("br, script").remove();
    content.find("p").forEach((paragraph) => {
      if (paragraph.text().trim().length === 0) {
        paragraph.remove();
      }
    });
    const contents = content.html();

    let previous, next;

    $(".chr-nav a.btn[href]").forEach((anchor) => {
      const text = anchor.text().toLowerCase();
      if (text.indexOf("next") >= 0) {
        next = URL.resolve(url, anchor.attr("href"));
      } else if (text.indexOf("prev") >= 0) {
        previous = URL.resolve(url, anchor.attr("href"));
      }
    });

    return {
      id,
      url,
      previous,
      next,
      title,
      contents,
    };
  }

  async list(id) {
    const chapters: Array<Chapter> = [];

    const _id = await this.getNovelId(id);

    const url = RFN_URL.resolve(`ajax/chapter-option?novelId=${_id}&currentChapterId=1`);

    const result = await fetch(url);

    const body = await result.text();

    const $ = HTML.load(body);

    const rows = $("select option");

    for (let i = 0; i < rows.length; i++) {
      const chapter = $(rows[i]);

      const title = chapter.text();
      const href = chapter.attr("value");

      const chapterUrl = URL.resolve(url, href);
      const id = URL.parse(chapterUrl).path.match(/\/(.*?)(?:\.[a-z]+)$/)[1];

      chapters.push({
        id,
        url: chapterUrl,
        previous: null,
        next: null,
        title,
        contents: null,
      });
    }

    return chapters;
  }

  async getNovelId(slug): Promise<number> {
    const url = RFN_URL.resolve(`/${slug}.html`);

    const result = await fetch(url);

    const body = await result.text();

    const $ = HTML.load(body);

    const id = $("[data-novel-id]").attr("data-novel-id");

    return parseInt(id);
  }
}
