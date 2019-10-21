import React from "react";
import {
  TouchableOpacity,
} from "react-native";
import {
  ListItem,
} from "react-native-elements";

import { Navigation } from "react-native-navigation";
import { Pages, usePage } from "navigation/Pages";
import { Chapter } from "sources/API";

export default function ChapterListItem({ chapter }: {
  chapter: Chapter,
}) {
  const navigate = useNavigate(chapter);

  return (
    <TouchableOpacity onPress={navigate}>
      <ListItem
        title={chapter.title}
        chevron={true}
        bottomDivider
      />
    </TouchableOpacity>
  );
}

function useNavigate(chapter: Chapter) {
  const { id } = usePage();

  return () => Navigation.push(id, {
    component: {
      name: Pages.chapter,
      passProps: {
        url: chapter.url,
      },
    },
  });
}
