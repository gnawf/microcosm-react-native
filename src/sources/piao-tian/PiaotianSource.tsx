import {
  Chapter,
  Chapters,
  Novel,
  NovelId,
  Novels,
  Source,
} from "sources/API";
import URL from "utils/URL";
import cheerio from "browserify/cheerio";
import { element } from "prop-types";

const BASE_URL = URL.parse('https://www.ptwxz.com');
const BOOK_URL = URL.parse(BASE_URL.resolve('/bookinfo'));
const READ_URL = URL.parse(BASE_URL.resolve('/html'));
const LIST_URL = URL.parse(BASE_URL.resolve('/quanben/index.html'));

export default class PiaotianSource implements Source {
  id: string;
  name: string;
  hosts: string[];
  novels: Novels;
  chapters: Chapters;

  constructor() {
    this.id = "piaotian";
    this.name = "PiaoTian";
    this.hosts = [BASE_URL.host];
    this.novels = new _Novels();
    this.chapters = new _Chapters();
  }
}

class _Novels implements Novels {
  async get(id: string): Promise<Novel | null> {
    const url = BOOK_URL.resolve(`/${id}.html`);
    const result = await fetch(url);
    const body = await result.text();
    const $ = cheerio.load(body);
    const title = $("h1").first().text().trim();
    const description = $('table table div').get(1).innerHTML.text().trim();
    const image = $("td a img").get(4).attr("src");
    return {
      id,
      url,
      title,
      description,
      image: image.replace(/t-\d+x\d+/i, "t-300x439"),
    };
  }
  async list(args: { cursor?: any; }): Promise<Novel[] | null> {
    const url = BOOK_URL.resolve(`/?page=${args.cursor | 1}.html`);
    const result = await fetch(url);
    const body = await result.text();
    const $ = cheerio.load(body);
    const links: String[] = [];
    $('table.grid tbody tr td:nth-child(1) a').each((_, element) => {
      const a = $(element)
      links.push(a.attr('href'));
    });

    const novels: Novel[] = []
    const promises: Promise<Novel | null>[] = [];
    links.forEach((link) => {
      const arr = link.split('/');
      const id = arr[arr.length - 2] + arr[arr.length -1];
      const novelFetch = this.get(id);
      novelFetch.then((res) => {
        if (res) {
          novels.push(res)
        }
      });
      promises.push(novelFetch);
    });
    await Promise.all(promises);
    return novels;
  }
  
  async search(query: string): Promise<Novel[] | null> {
    throw new Error("Method not implemented.");
  }
}

class _Chapters implements Chapters {
  async get(url: string): Promise<Chapter | null> {
    throw new Error("Method not implemented.");
  }
  async list(id: string, args: { cursor?: any; }): Promise<Chapter[] | null> {
    throw new Error("Method not implemented.");
  }
}