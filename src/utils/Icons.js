// @flow

import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useEffect } from "react";

import type { MaterialIconsGlyphs } from "react-native-vector-icons/MaterialIcons";

export function useIcon(name: MaterialIconsGlyphs, size?: number, color?: string) {
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    Icon.getImageSource(name, size, color).then(setIcon);
  }, [name, size, color]);

  return icon;
}
