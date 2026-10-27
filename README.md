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

The site supports English (`/en/`) and Ukrainian (`/uk/`), including localized legal pages. Opening `/` selects a language before React renders: a saved manual choice wins, then a trusted country code, then the browser's first preferred language. A country code is accepted only when a trusted edge or server injects it as `window.__LEOKA_COUNTRY_CODE__` or `<meta name="leoka-country-code" content="UA">`. The client does not look up visitor IP addresses or infer country from Railway's edge location. Until a verified country injector is configured, language selection uses saved choice and browser-language fallback.

Selecting a language stores the preference in localStorage and navigates to the equivalent language-prefixed URL. Legacy unprefixed legal URLs are normalized to the selected language route.
