## Translations Website

This repo contains a static website utilizing the proceedings of project [Bergamot](https://browser.mt/).

The concept is the same as [Firefox Translation](https://github.com/mozilla-extensions/firefox-translations), where the inference occurs entirely in the webpage by utilizing the WebAssembly port of the neural machine translation engine  [(marian)](github.com/mozilla/bergamot-translator), while the models are dynamically downloaded and loaded as the user switches between the languages.

## Live Demo
The live demo is hosted on Github Pages and published on https://mozilla.github.io/translate.

Compatible and tested on:
- Firefox desktop
- Chrome desktop
- Edge desktop
- Brave desktop
- Firefox Nightly for Android
- Chrome for Android

## Testing locally

```
npm install
bash start_dev_server.sh
```