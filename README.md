# My Publication work monorepo (blog, md, marimo, and shinylive tutorials)

o3 chat conv: <https://chatgpt.com/c/68160bdd-3668-8001-b4d0-64ad52655e47>

```txt
.
├─ src/
│   ├─ blog/
│   │   └─ posts/                  # ← Quarto blog sources (.qmd/.md)
│   │   └─ _quarto.yml
│   ├─ md/                 # ← Jekyll docs sources (.md, layouts, etc.)
│   │   └─ _config.yml
│   ├─ nb/                 # ← marimo notebooks (optional – see §4)
│   ├─ app/                # ← Shiny‑Python WASM app (optional)
├─ docs/                   # ← **final static site** (never edit by hand)
│   ├─ blog/   (Quarto output)
│   ├─ md/     (Jekyll output)
│   ├─ nb/     (marimo output)
│   └─ app/    (Shiny output)
└─ .github/workflows/deploy.yml

```

## Local Preview

```sh
# Re‑generate blog + docs locally
quarto render posts --output-dir docs/blog
jekyll build --source md_src --destination docs/md
open docs/blog/index.html   # or serve docs/ with any static file server
```

## References

- <https://quarto.org/docs/publishing/>
  - <https://quarto.org/docs/publishing/github-pages.html>
  - <https://quarto.org/docs/publishing/ci.html#rendering-for-ci>
    - <https://github.com/quarto-dev/quarto-actions>
- <https://posit-dev.github.io/brand-yml/>
- <https://jekyllrb.com/>
- <https://docs.marimo.io/guides/wasm/>
- <https://shiny.posit.co/py/get-started/shinylive.html>
  - <https://github.com/posit-dev/shinylive?tab=readme-ov-file>
  - <https://github.com/RamiKrispin/shinylive?tab=readme-ov-file>
