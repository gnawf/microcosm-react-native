// @flow

import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useEffect } from "react";

export function useIcon(name: string, size?: number, color?: string) {
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    Icon.getImageSource(name, size, color).then(setIcon);
  }, [name, size, color]);

  return icon;
}
