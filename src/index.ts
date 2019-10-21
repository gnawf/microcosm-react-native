import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Pages, bootstrap as pages } from "navigation/Pages";
import { bootstrap as providers } from "navigation/Providers";

Navigation.events().registerAppLaunchedListener(async () => {
  await providers();

  pages();

  const [catalog, library, recents, downloads] = await Promise.all([
    Icon.getImageSource("explore", 20),
    Icon.getImageSource("library-books", 20),
    Icon.getImageSource("history", 20),
    Icon.getImageSource("file-download", 20),
  ]);

  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          stack({ component: Pages.catalog, icon: catalog }),
          stack({ component: Pages.library, icon: library }),
          stack({ component: Pages.recents, icon: recents }),
          stack({ component: Pages.downloads, icon: downloads }),
        ],
      },
    },
  });
});


function stack({ component: name, name: text = name, icon }: {
  component: string,
  name?: string,
  icon: any,
}) {
  return {
    stack: {
      children: [
        {
          component: {
            name,
          },
        },
      ],
      options: {
        bottomTab: {
          text,
          icon,
        },
      },
    },
  };
}
