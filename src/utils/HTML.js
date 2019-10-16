import cheerio from "~/browserify/cheerio";

cheerio.prototype.first = function first() {
  return cheerio(this[0]);
};

export default cheerio;
