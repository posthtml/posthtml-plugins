# [PostHTML Plugins Catalog](http://posthtml.github.io/posthtml-plugins/)
A searchable catalog of [PostHTML](https://github.com/posthtml/posthtml) plugins.

## How to add a plugin
Add your plugin to [`src/pluginsNames.json`](https://github.com/posthtml/posthtml-plugins/edit/master/src/pluginsNames.json)
and send a pull request to the `master` branch.

##### The plugin:
- must be listed in the NPM registry
- must have `description` in `package.json`
- must have `homepage` in `package.json`

> For those who are going to review these PRs: you should run `npm run build` to re-build the index.
