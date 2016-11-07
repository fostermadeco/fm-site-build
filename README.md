FM Site Build Tools
https://www.npmjs.com/package/fm-site-build
=========

Library of gulp tasks to perform site build actions, including: 

* Compile Sass
* Concat and minify Javascript
* Separate development and production files
* Versioning/cache busting

## Installation

  `npm install fm-site-build --save-dev`

## Usage

* Copy files in sample folder to main roote of site.
* Edit fm-site-build.options.js to fit site specific needs.
* Run 'bower install' and 'npm install'

Run gulp tasks, see below for more explanation of each:

```
gulp dev

gulp watch

gulp dist
```

## Tasks

### Development
Watch js and scss files and refresh browser with [Browsersync](https://www.browsersync.io/)

```
gulp watch --proxy example.dev
```

The proxy flag is optional. There is a default option in gulp.options.js to set the local url. If your local differs, then add the proxy flag. 

Create a development version of the assets

```
gulp dev
```

Creates files with source maps in dev/ dir.

### Production
Create a production version of the assets

```
gulp dist
```

Creates files in dist folder. In index.html, add references for main-min.js, main-min.css, vendor-min.css and modernizr-min.js. When this task is run, the file reference in index.html will be replace with a hash for the version. For example, main-min-9a26907288.css.

## Sample directory structure sample site usage

```
.
├── dev                             # <-- Generated, pre-production app assets
│   ├── app.css                    # <-- Compiled, concatenated sass files
│   ├── vendor.css                  # <-- Compiled, concatenated vendor styles
│   ├── main.js                     # <-- Concatenated js files with source maps
├── dist                            # <-- Generated, production-ready app assets
│   ├── main-min.css                # <-- Minified css
│   ├── main-min.js                 # <-- Minified js
│   assets                           # <-- Where you edit files
│   ├── scss
│   │   ├── mixins                  # <-- Folders for sass partials - add to fm-site-build.options.js
│   │   └── main.scss
│   └── js                          # <-- Edit js files and add more to subfolders
├── images                          # <-- Image assets, relative to `/`
├── fonts                           # <-- Font assets, relative to `/`
├── static                          # <-- pdfs, etc. Files that need to be relative to `/`
├── vendor                          # <-- Third-party assets
│   ├── bower_components            # <-- Specify path in .bowerrc
│   ├── css                         # <-- other vendor css not in Bower
│   └── js                          # <-- other vendor js not in Bower
└── public/site/../templates        # <-- Wherever your templates are
    └── index.html                  # <-- Where your stylesheets and js are included from
```

## Contributing changes and bumping version

Bump version in package.json

```
git add .
git commit -m "desc of changes"
git tag v0.0.6
git push origin master --tags
npm publish
```

## Tests (coming soon)

```
npm test
```