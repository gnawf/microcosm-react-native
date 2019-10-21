// @flow

import { Chapters, Novels, Source } from "~/sources/API";
import URL from "~/utils/URL";
import HTML from "~/utils/HTML";

import type { Chapter, Novel, NovelId } from "~/sources/API";

const RNF_URL = URL.parse("https://readnovelfull.com");

const IDS = function () {
  const prefix = "@rnf/";

  function stripExtension(input: string) {
    return input.replace(/\.[a-z]+$/, "");
  }
  function format(id: string) {
    id = stripExtension(id);
    return id.startsWith(prefix) ? id : prefix + id;
  }
  function chapterId(url: string) {
    const pathSegments = URL.parse(url).pathSegments;
    const cid = pathSegments[pathSegments.length - 1];
    return format(cid);
  }
  function novelId(url: string) {
    const nid = URL.parse(url).pathSegments[0];
    return format(nid);
  }
  function unformat(id: string) {
    return id.startsWith(prefix) ? id.substring(prefix.length) : id;
  }
  return { format, chapterId, novelId, unformat };
}();

export default class RNFSource implements Source {
  id: string;
  name: string;
  hosts: Array<string>;
  novels: Novels;
  chapters: Chapters;

  constructor() {
    this.id = "read-novel-full";
    this.name = "Read Novel Full";
    this.hosts = [RNF_URL.host];
    this.novels = new _Novels();
    this.chapters = new _Chapters();
  }
}

class _Novels implements Novels {
  async get(id) {
    const url = RNF_URL.resolve(`/${IDS.unformat(id)}.html`);
    const result = await fetch(url);
    const body = await result.text();
    const $ = HTML.load(body);
    const title = $(".title").first().text().trim();
    const description = html($(".desc-text").first());
    const image = $(".book img").first().attr("src");

    return {
      id: IDS.format(id),
      url,
      title,
      description,
      image: image.replace(/t-\d+x\d+/i, "t-300x439"),
    };
  }

  async list({ cursor = 1 }) {
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

    const searchUrl = RNF_URL.resolve(`/search?keyword=${encodeURIComponent(query)}&page=${page}`);
    const result = await fetch(searchUrl);
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

      const novelUrl = anchor.attr("href");

      if (novelUrl.indexOf("/search?idword") >= 0) {
        continue;
      }

      novels.push({
        id: IDS.novelId(novelUrl),
        url: URL.resolve(searchUrl, novelUrl),
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
    const title = $(".chr-title").text();
    const contents = html($("#chr-content").first());
    const novelUrl = $("a.novel-title[href]").attr("href");
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
      id: IDS.chapterId(url),
      url,
      previous,
      next,
      title,
      contents,
      novelId: IDS.novelId(novelUrl),
      novel: null,
    };
  }

  async list(id) {
    const chapters: Array<Chapter> = [];

    const novelId = await this.getNovelId(id);
    const url = RNF_URL.resolve(`ajax/chapter-option?novelId=${novelId}&currentChapterId=1`);
    const result = await fetch(url);
    const body = await result.text();
    const $ = HTML.load(body);
    const rows = $("select option");

    for (let i = 0; i < rows.length; i++) {
      const chapter = $(rows[i]);

      const title = chapter.text();
      const href = chapter.attr("value");

      const chapterUrl = URL.resolve(url, href);

      chapters.push({
        id: IDS.chapterId(href),
        url: chapterUrl,
        previous: null,
        next: null,
        title,
        contents: null,
        novelId: IDS.novelId(chapterUrl),
        novel: null,
      });
    }

    return chapters;
  }

  async getNovelId(slug: NovelId): Promise<number> {
    slug = IDS.unformat(slug);

    const url = RNF_URL.resolve(`/${slug}.html`);
    const result = await fetch(url);
    const body = await result.text();
    const $ = HTML.load(body);
    const id = $("[data-novel-id]").attr("data-novel-id");

    return parseInt(id);
  }
}

function html(input) {
  input.find("br, script").remove();
  input.find("p").forEach((paragraph) => {
    if (paragraph.text().trim().length === 0) {
      paragraph.remove();
    }
  });

  return input.html();
}
