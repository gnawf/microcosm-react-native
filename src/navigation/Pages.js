// @flow

import CatalogPage from "~/pages/CatalogPage";
import SourcePage from "~/pages/SourcePage";
import DownloadsPage from "~/pages/DownloadsPage";
import LibraryPage from "~/pages/LibraryPage";
import NovelPage from "~/pages/NovelPage";

const Pages: {
  [string]: any,
} = {
  Catalog: CatalogPage,
  Source: SourcePage,
  Downloads: DownloadsPage,
  Library: LibraryPage,
  Novel: NovelPage,
};

export default Pages;
