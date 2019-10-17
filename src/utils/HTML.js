import cheerio from "~/browserify/cheerio";

cheerio.prototype.first = function first() {
  return cheerio(this[0]);
};

cheerio.prototype.forEach = function(fn) {
  for (let i = 0; i < this.length; i++) {
    const child = cheerio(this[i]);
    fn(child);
  }
};

export default cheerio;
