import type { Config } from "@docusaurus/types";

const config: Config = {
  title: "My Docs",
  url: "https://username.github.io",
  baseUrl: "/Blog/md/",
  trailingSlash: false,

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
  },
  
  themes: [
    // keep any existing themes here …
    [
      // This adds the search bar to the navbar automatically.
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true, // long‑term‑cache the index file  :contentReference[oaicite:1]{index=1}
        docsRouteBasePath: "/", // must match routeBasePath
        indexPages: true, // uncomment to add any TSX “pages” you swizzle in future
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          path: "docs", // Quarto writes here
          routeBasePath: "/", // so URLs are /md/<page>
          sidebarPath: require.resolve("./sidebars.ts"), // or sidebars as needed
        },
        blog: false, // “docs‑only” mode
      },
    ],
  ],
};

export default config;
