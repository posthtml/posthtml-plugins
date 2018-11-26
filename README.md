# [PostHTML Plugins Catalog](http://posthtml.github.io/posthtml-plugins/)
A searchable catalog of [PostHTML](https://github.com/posthtml/posthtml) plugins.

## How to add a plugin
Add your plugin to [`js/config/pluginsNames.json`](https://github.com/posthtml/posthtml-plugins/edit/master/js/config/pluginsNames.json)
and send a pull request to the `master` branch.

> For those who are going to review these PRs: you should run `npm run build` to re-build the index.

##### The plugin:
- must be listed in the NPM registry
- must have `description` in `package.json`
- must have `homepage` in `package.json`
