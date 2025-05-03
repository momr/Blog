# My Publication work monorepo (blog, md, marimo, and shinylive tutorials)

o3 chat conv: <https://chatgpt.com/c/68160bdd-3668-8001-b4d0-64ad52655e47>

```txt
.
├─ src/
│  ├─ blog/                    # ← Quarto website project (blog)
│  │  ├─ _quarto.yml
│  │  └─ posts/
│  ├─ md/                      # ← Quarto → Docusaurus sources
│  │  └─ _quarto.yml
│  ├─ nb/                      # (optional) marimo notebooks
│  └─ app/                     # (optional) Shiny‑Python WASM
├─ docusaurus/                 # Docusaurus site (created once with NPX)
│  ├─ docs/                    # Quarto writes here
│  ├─ sidebars.js
│  └─ docusaurus.config.js
├─ docs/                       # FINAL static site shipped to Pages
│  ├─ blog/   (Quarto HTML)    → /blog
│  ├─ md/     (Docusaurus)     → /md
│  ├─ nb/     (marimo)         → /nb
│  └─ app/    (Shiny WASM)     → /app
└─ .github/workflows/deploy.yml

```

## requirements

```sh
# for python dependencies
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt

# for docusaurus
# from your repo root, create the site under src/docusaurus
npx create-docusaurus@latest src/docusaurus classic
# → generates package.json, tsconfig, config.js, etc.
# now install the deps:
cd src/docusaurus
npm install --save @easyops-cn/docusaurus-search-local
```

## 2 · Config files (only the parts that changed)

### 2.1 `src/blog/_quarto.yml`  (blog)

```yaml
project:
  type: website
  output-dir: ../../docs/blog     # two levels up from src/blog
website:
  title: "My Blog"
```

### 2.2 `src/md/_quarto.yml`  (Quarto → Docusaurus)

```yaml
project:
  type: docusaurus               # must be declared :contentReference[oaicite:0]{index=0}
  output-dir: ../../docusaurus/docs
execute:
  freeze: auto
format:
  docusaurus-md:
    code-fold: true
```

### 2.3 `docusaurus/docusaurus.config.js`

```js
export default {
  title: 'My Docs',
  url: 'https://username.github.io',
  baseUrl: '/md/',               // lives under /md
  trailingSlash: false,
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',          // where Quarto drops .md
          routeBasePath: '/',    // avoid extra /docs in URL
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
      },
    ],
  ],
};
```

---

## 3 · GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
name: build-and-deploy
on: [push]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # -------- Quarto blog (/blog) --------
      - uses: quarto-dev/quarto-actions/setup@v2
      - run: quarto render src/blog            # _quarto.yml handles output‑dir

      # -------- Quarto → Docusaurus (/md) --------
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install JS deps
        run: |
          cd docusaurus
          npm ci                                # or pnpm/yarn
      - name: Render Quarto docs
        run: quarto render src/md              # writes to docusaurus/docs
      - name: Build Docusaurus site
        run: |
          cd docusaurus
          npm run build                        # outputs to docusaurus/build
          rsync -a --delete build/ ../docs/md

      # -------- Optional extras --------
      - run: marimo convert src/nb --out docs/nb || true
      - run: ./build_shiny_wasm.sh && cp -r shiny_build docs/app || true

      # -------- Package for Pages --------
      - run: touch docs/.nojekyll
      - uses: actions/upload-pages-artifact@v4   # v4 is required by deploy v4 :contentReference[oaicite:1]{index=1}
        with: { path: docs }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

---

## 4 · What you get

| Final URL | Built by          | Live folder | Authoring source     |
| --------- | ----------------- | ----------- | -------------------- |
| `/blog/`  | Quarto website    | `docs/blog` | `src/blog/posts/`    |
| `/md/`    | Docusaurus        | `docs/md`   | `src/md/` via Quarto |
| `/nb/`    | marimo (opt.)     | `docs/nb`   | `src/nb/`            |
| `/app/`   | Shiny WASM (opt.) | `docs/app`  | `src/app/`           |

Everything publishes from a **single repo** through a **single GitHub Pages workflow**—now with the cleaner `src/`‑based authoring structure you asked for.

---

### Quick local preview

```bash
# From repo root
quarto render src/blog
quarto render src/md
cd docusaurus && npm start   # hot‑reloads docs at http://localhost:3000/md

# or
quarto preview src/blog # to serve it locally
cd docusaurus && npm run serve # to serve and test search functionality
```

## References

- <https://quarto.org/docs/publishing/>
  - <https://quarto.org/docs/publishing/github-pages.html>
  - <https://quarto.org/docs/publishing/ci.html#rendering-for-ci>
    - <https://github.com/quarto-dev/quarto-actions>
- <https://posit-dev.github.io/brand-yml/>
- <https://github.com/facebook/docusaurus>
- <https://docs.marimo.io/guides/wasm/>
- <https://shiny.posit.co/py/get-started/shinylive.html>
  - <https://github.com/posit-dev/shinylive?tab=readme-ov-file>
  - <https://github.com/RamiKrispin/shinylive?tab=readme-ov-file>
