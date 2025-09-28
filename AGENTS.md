# Repository Guidelines

## Project Structure & Module Organization
- Themes live in `themes/website`, `themes/landing`, and `themes/product`.
- Shared assets/components are in `shared/{sections,snippets,styles,scripts}` and are merged during build.
- Draft/working files use underscored folders (for example, `themes/website/_sections`) and are excluded from builds.
- Build artifacts go to `build/<type>/`. Exports (ZIPs, logs, change reports) go to `exports/releases/v<version>/`.
- Helper scripts are in `scripts/`. AI drafts can be stored in `llm-drafts/`.

## Build, Test, and Development Commands
- `npm run theme:build <website|landing|product>`: Build a theme into `build/<type>/` with shared assets merged.
- `npm run theme:export <type> [patch|minor|major] "message"`: Build, bump version, and export ZIP + `CHANGES.md` to `exports/releases/vX.Y.Z/`.
- `npm run theme:version [type] [version]`: Show or set versions; website/landing are kept in sync.
- `npm run theme:sync`: Force website and landing versions to match.
- `npm test`: Validate required files, `settings_validatable: true`, and forbid `{% render %}`.
- `npm run inject:drafts`: Convert `llm-drafts/*.html` into Kajabi sections.
- `npm run demo:generate`: Regenerate `demo.html` for quick visual checks.

## Coding Style & Naming Conventions
- Indentation: 2 spaces. Languages: Liquid, HTML, SCSS, JS.
- Liquid: Use `{% include %}` only; do not use `{% render %}`.
- Naming: sections `section_<feature>.liquid`, snippets `<name>_util.liquid`, assets kebab-case (`hero-image.jpg`), JS camelCase.
- Shared CSS: tokens live in `shared/styles/_tokens.css`; `overrides.css` is merged into theme assets.

## Testing Guidelines
- Run `npm test` before PRs. The tester checks:
  - Required files per theme (for example, `layouts/theme.liquid`, `templates/index.liquid`).
  - `config/settings_schema.json` contains `theme_info.settings_validatable: true`.
  - No `{% render %}` in Liquid.

## Commit & Pull Request Guidelines
- Commits: use Conventional Commits (for example, `feat: add search to nav`, `fix: handle null logo`). Version bumps use `vX.Y.Z: <notes>`.
- PRs: include a clear description, linked issues, screenshots of affected pages (if UI), `npm test` output, and export artifacts or `CHANGES.md` when structural changes are made.

## Security & Configuration Tips
- Do not commit secrets. Ensure ZIPs contain a single subdirectory. Avoid Shopify-specific objects.
