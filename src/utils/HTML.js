import cheerio from "cheerio-without-node-native";

cheerio.prototype.first = function first() {
  return cheerio(this[0]);
};

export default cheerio;
