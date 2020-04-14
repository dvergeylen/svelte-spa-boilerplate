## Svelte + Rails 6 Boilerplate
This document aims to provide a step by step guide to start from a [sveltejs/template](https://github.com/sveltejs/template) project and bring it to a fully functional JAM stack.

#### Sveltejs/template
Start by downloading [sveltejs/template zip](https://github.com/sveltejs/template/archive/master.zip) file. Don't fork it, download the latest master.

```bash
curl -L https://github.com/sveltejs/template/archive/master.zip -o svelte_template.zip
unzip svelte_template.zip
mv template-master myapp

# That's it!
# See a hello world page:
yarn install
npm run dev
# → go to localhost:5000 to see a hello world page
```

#### Tree structure
The original tree structure goes like this:

```bash
$ tree
.
├── package.json
├── public
│   ├── favicon.png
│   ├── global.css
│   └── index.html
├── README.md
├── rollup.config.js
└── src
    ├── App.svelte
    └── main.js

2 directories, 8 files
```
Where application components are written in the `src` folder, next to `main.js`. `main.js` is the file bundled by rollup to `bundle.js` + `bundle.css` as defined in `rollup.config.js`.

Rollup config file is really where the magic happens. It can take multiple files as input and bundle them as multiple outputs. Instead of using one single file (aformentioned `main.js`), we assume from now on that for every REST URL that leads to a GUI matches a stand-alone "app" (a `.js` file) that must be bundled with everything it needs to operate.

The new tree structure thus goes like this:

```bash
$ tree -d
.
├── public
│   ├── build
│   ├── fonts
│   │   └── fontawesome-webfonts
│   └── images
└── src
    ├── components
    ├── javascripts
    │   ├── apps
    │   └── utils
    └── stylesheets

11 directories
```
* `public/images` is where image assets will go.
* `public/fonts` is where font assets will go (e.g: fontawesome-webfonts as installed below)
* `src/components` is where svelte `.svelte` components will go
* `src/javascripts`
    * `apps/` is where each javascript file (representing apps respectively) will go. `main.js` is removed and replaced by these apps.
        * `static.js` is a minimal app that bundles the components added on static web pages (≃ where one doesn't need to be logged in to see the content). These webpages should be sufficient without these components (SEO, information, ...) as they are only there for convenience (sign in / sign up / sign out buttons, for instance).
        * `users.js` when displaying *mywebsite.com/users.html* web app, ...
    * `utils/` contains the javascript processing needed in some svelte components. The goal is to outsource these processings from the components where only (mostly) UI-related javascript should occur. 
    This separate folder makes its javascript also available for static webpages without the need for specific components when needed.
* `src/stylesheets` is where styles needed in static webpages and apps lies. It includes libraries (Bulma, Fontawesome, ...) but also `utils` or `variables`.

#### Adding Sass support
```bash
yarn add node-sass sass svelte-preprocess
```
and add a preprocessor to svelte plugin in `rollup.config.js`:
```diff
diff --git rollup.config.js rollup.config.js
index ce3c9eb..c2e120d 100644
--- rollup.config.js
+++ rollup.config.js
@@ -4,6 +4,9 @@ import commonjs from '@rollup/plugin-commonjs';
 import livereload from 'rollup-plugin-livereload';
 import { terser } from 'rollup-plugin-terser';

+// Pre-processes
+import sveltePreprocess from 'svelte-preprocess';
+
 const production = !process.env.ROLLUP_WATCH;

 export default {
@@ -22,7 +25,8 @@ export default {
                        // a separate file - better for performance
                        css: css => {
                                css.write('public/build/bundle.css');
-                       }
+                       },
+      preprocess: sveltePreprocess(),
                }),
```

###### Bonus: VSCodium svelte support
Install the following extensions :
* jamesbirtles.svelte-vscode
* ardenivanov.svelte-intellisense

And create `svelte.config.js` file:
```js
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
    preprocess: sveltePreprocess(),
};
```

#### Publishing static svelte site as  gh-pages
Create a deploy script to copy (build) `public/` folder content to a `gh-pages` branch that will be used as the publishing source.

* Install `gh-pages`
```bash
yarn add gh-pages
```
* Add script to `package.json` file:

```diff
{
  "name": "svelte-app",
  "version": "1.0.0",
  "homepage": "https://mywebsite.com",
  "scripts": {
    [...]
+   "deploy": "npm run build &&  ./node_modules/gh-pages/bin/gh-pages.js -d public/"
  },
  [...]
}
```
* Create a CNAME file in public/ folder:
    ```
    mywebsite.com
    ```
* Commit and run `npm run deploy`
* On github.com project's page, go to Settings → Github Pages. Choose `gh-pages` branch as the publishing source and check the subdomain is correctly set.
* Go to your DNS provider and add a CNAME record that points to `yourusername.github.io`
* Wait a bit and you are done!

#### Importing bulma
* Add yarn packages: `bulma` and `rollup-plugin-scss`.
* Update `rollup.config.js` to bundle a new file: `bundle.js`

See commit [#8584b3](https://github.com/dvergeylen/svelte-rails6-boilerplate/commit/8584b3a7fc2333d89caf706f629c98d8c4e726a1) as reference

#### Importing fontawesome
Combination of these two doc pages:
https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers
https://fontawesome.com/how-to-use/on-the-web/using-with/sass

Create a `.npmrc` configuration file to add the Fontawesome pro credentials. Don't forget to edit root `.gitignore` file to ignore it 😉!

Fontawesome 'webfonts' folder as to be copied from `node_modules/@fortawesome/fontawesome/`
    to the public folder (`public/fonts/fontawesome-webfonts`) as these fonts may evolve in the future. Add a `npm` script to copy them when building (and publishing).

See commit [#9a7128](https://github.com/dvergeylen/svelte-rails6-boilerplate/commit/9a712821ef63f04906a197517639ee40f4bb84b5) as reference

#### Add ESLint configuration
* `yarn add `eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-promise`
* create a `.eslintignore` file:
    ```bash
    node_modules/**
    public/build/**
    ```
* create a `.eslintrc` file:
    ```json
    {
      "env": {
        "browser": true,
        "node": true
      },
      "extends": "airbnb-base",
      "rules": {
        "consistent-return": "off",
        "no-param-reassign": "off",
        "no-use-before-define": [
          "error",
          {
            "functions": false
          }
        ],
        "no-underscore-dangle": [
          "error",
          {
            "allow": [
              "_id"
            ],
            "allowAfterThis": true
          }
        ],
        "promise/no-native": "error",
        "promise/always-return": "error"
      },
      "plugins": [
        "promise",
        "import"
      ]
    }
    ```
See commit [#265e36](https://github.com/dvergeylen/svelte-rails6-boilerplate/commit/265e369df58c10b1232096632d89246f75b1a57e) as reference

#### Authenticating via Auth0
