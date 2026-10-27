# LEOKA

LEOKA is an AI-native technology company operated by Green Craft LLC.

Production: [https://leoka.us](https://leoka.us)

## Development

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Languages and routes

The site supports English (`/en/`) and Ukrainian (`/ua/`), including localized legal pages. Ukrainian is the default for new visitors. A saved manual language choice takes priority, so visitors who selected English keep English. Explicit `/en/` and `/ua/` routes always stay in the requested language. The root route uses `history.replaceState` to open the matching language-prefixed page while preserving the query string and fragment. Legacy `/uk/...` links are migrated to the equivalent `/ua/...` URL while preserving the remaining path, query string, and fragment.

Country-based and browser-language selection are not used. Selecting a language stores `en` or `ua` as the manual preference in localStorage and navigates to the equivalent language-prefixed URL. A previously saved `uk` preference is migrated to `ua`. Legacy unprefixed legal URLs are normalized to the selected language route. `ua` is the website's route and storage locale code; HTML `lang` and SEO `hreflang` use the standards-based Ukrainian language tags `uk` and `uk-UA`.
