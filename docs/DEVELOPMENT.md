# Development, Environments & Assets

## Repo layout

```
Prod/           the deployable site (index.html, sw.js, manifest.json, icons)
scripts/        bump-version.mjs (version sync), update-lexicon.mjs (Scryfall check)
infra/          assets-cdn.yml (CloudFormation: S3 + CloudFront + budget alarm)
.github/        deploy + lexicon-check workflows
docs/           this file, MODERNIZATION.md
```

## Dev / prod environments

Two branches, one Pages site:

| Branch | URL | Purpose |
|---|---|---|
| `main` | play-mtg.com | Production |
| `dev`  | play-mtg.com/dev/ | Staging — test here first |

Workflow:

1. Do work on `dev`.
2. Push → GitHub Actions deploys it to **play-mtg.com/dev/** automatically
   (noindex'd, separate service-worker cache so it can't poison prod).
3. Verify on a real device at the /dev/ URL. Note the dev service worker uses
   stale-while-revalidate: the first load after a deploy shows the previous
   version — refresh twice or close/reopen to see the new one.
4. Promote: `git checkout main && git merge dev && git push` → prod deploys.

The deploy workflow **fails the build if the three version references disagree**.
Bump with:

```
npm run bump        # e.g. 105 → 106 everywhere
npm run bump 110    # set explicit number
```

Local testing (no build step needed): `npm run serve` → http://localhost:8642
(or just open Prod/index.html in a browser).

Git identity: this repo is configured with a local no-PII identity
(`imcg1122 <imcg1122@users.noreply.github.com>`). Keep it that way — do not
commit with a personal name or email.

## Lexicon freshness

`scripts/update-lexicon.mjs` compares the app's LEXICON against Scryfall's live
keyword catalogs (keyword-abilities, keyword-actions, ability-words). A monthly
GitHub Action runs it and opens/updates a checklist issue when Wizards prints
new keywords. Deliberate omissions go in the `IGNORED` set in the script.

(If the app later fetches Scryfall directly in-page, add `https://api.scryfall.com`
to the CSP `connect-src` in index.html.)

## Assets: local-first, S3 when heavy

**Start local.** Everything current (SVG icons, CSS effects) lives inline in
index.html and should stay there — it's what makes offline bulletproof. Embed
small final assets (icons as inline SVG, sounds as base64 in a WebAudio sprite
≤ ~100 KB).

**Move to S3 + CloudFront when** an asset class outgrows the single file —
e.g. dungeon art, high-res textures, a bigger sound bank. That's what
`infra/assets-cdn.yml` provides, including a monthly budget alarm:

```
aws cloudformation deploy --template-file infra/assets-cdn.yml \
  --stack-name mtg-playmat-assets --parameter-overrides AlertEmail=<your-alert-email>
aws s3 sync ./assets s3://<bucket-from-outputs>/ --cache-control "public,max-age=604800"
```

Remember: remote assets need (1) the CloudFront domain added to CSP
`img-src`/`media-src`, and (2) service-worker pre-caching of an asset manifest,
or they won't exist offline.

## Asset sources & licenses

- game-icons.net — CC BY 3.0 (add credit in Resources → App Info when used)
- Kenney.nl audio — CC0 · ambientCG textures — CC0
- Mana font (authentic symbols) — OFL/MIT, symbols © Wizards → requires the Fan
  Content disclaimer already present in Resources → App Info
