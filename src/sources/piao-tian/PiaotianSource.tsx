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
const CHAPTERS_URL = URL.parse(BASE_URL.resolve('/html'));
const LIST_URL = URL.parse(BASE_URL.resolve('/quanben/index.html'));

function _novelId(novelUrl: string): string {
  const arr = novelUrl.split('/');
  return arr[arr.length - 2] + URL.removeExtension(arr[arr.length - 1]);
}

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
    const links: string[] = [];
    $('table.grid tbody tr td:nth-child(1) a').each((_, element) => {
      const a = $(element)
      links.push(a.attr('href'));
    });

    const novels: Novel[] = []
    const promises: Promise<Novel | null>[] = [];
    links.forEach((link) => {
      const id = _novelId(link);
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
    const result = await fetch(url);
    const body = await result.text();
    const $ = cheerio.load(body);

    const linkBar = $('div.toplink').first();

    const prevButton = linkBar.first();
    const previous = prevButton.attr('href') == 'index.html' ? null : prevButton.attr('href');

    const nextButton = linkBar.get(2);
    const next = nextButton.attr('href') == 'index.html' ? null : nextButton.attr('href');

    const novelUrl = linkBar.last().attr('href');
    const urlArr = url.split('/');

    const contents = $('#content');
    contents.find('h1').remove();
    contents.find('table').remove();
    contents.find('div').remove();

    return {
      id: URL.removeExtension(urlArr[urlArr.length - 1]),
      url,
      previous,
      next,
      title: $('h1').first().text().trim(),
      contents: contents.html(),
      novelId: _novelId(novelUrl),
      novel: null,
    };
  }

  async list(novelId: NovelId, args: { cursor?: any; }): Promise<Chapter[] | null> {
    const url = CHAPTERS_URL.resolve(`/${novelId}/.html`);
    const result = await fetch(url);
    const body = await result.text();
    const $ = cheerio.load(body);
    const aElements = $('ul li a').toArray();
    const chapters: Chapter[] = [];
    aElements.forEach(a => {
      const id = URL.removeExtension(a.attribs['href']);
      const chapterUrl = url + a.attribs['href'];
      const title = a.data == undefined ? chapterUrl : a.data; // Could use something else other than the chapterUrl if there is no title
      chapters.push({
        id: id,
        url: chapterUrl,
        previous: null,
        next: null,
        title,
        contents: null,
        novelId: novelId,
        novel: null,
      })
    });

    return chapters;
  }

}
