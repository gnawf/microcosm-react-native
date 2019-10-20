// @flow

import React, { createContext, useContext } from "react";
import { Navigation } from "react-native-navigation";

import CatalogPage from "~/pages/CatalogPage";
import SourcePage from "~/pages/SourcePage";
import RecentsPage from "~/pages/RecentsPage";
import DownloadsPage from "~/pages/DownloadsPage";
import LibraryPage from "~/pages/LibraryPage";
import NovelPage from "~/pages/NovelPage";
import ChapterPage from "~/pages/ChapterPage";

export const Pages = {
  catalog: "Catalog",
  source: "Source",
  recents: "Recents",
  downloads: "Downloads",
  library: "Library",
  novel: "Novel",
  chapter: "Chapter",
};

const PageContext = createContext<?string>(null);

const register = (name, Component) => Navigation.registerComponent(
  name,
  () => ({ componentId, ...props }) => (
    <PageContext.Provider value={componentId}>
      <Component {...props} />
    </PageContext.Provider>
  ),
);

export function usePage(): {
  id: string,
} {
  const page = useContext(PageContext);

  if (page == null) {
    throw new Error("Unable to find page");
  }

  return { id: page };
}

export function bootstrap() {
  register(Pages.catalog, CatalogPage);
  register(Pages.source, SourcePage);
  register(Pages.recents, RecentsPage);
  register(Pages.downloads, DownloadsPage);
  register(Pages.library, LibraryPage);
  register(Pages.novel, NovelPage);
  register(Pages.chapter, ChapterPage);
}
