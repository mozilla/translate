## Translations Website

**!!! This website is only for testing the latest models from the model registry. Use about:translations in Firefox instead !!!**

This repo contains a static website utilizing the proceedings of project [Bergamot](https://browser.mt/).

The concept is the same as [Firefox Translation](https://github.com/mozilla-extensions/firefox-translations), where the inference occurs entirely in the webpage by utilizing the WebAssembly port of the neural machine translation engine [(marian)](https://github.com/mozilla/bergamot-translator), while the models are dynamically downloaded and loaded as the user switches between the languages.

It downloads translation models from https://github.com/mozilla/firefox-translations-models

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
$npm install
$bash start_dev_server.sh
$firefox https://mozilla.github.io/translate
```
