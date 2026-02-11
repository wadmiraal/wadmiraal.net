# Wouter Admiraal's Blog

Find it [here](http://wadmiraal.net) !

All code is licensed under MIT, with the exception of code located under `src/js/vendor` and vendor CSS inlined in `src/css/all.css`.

Posts are licensed under [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/deed).

## Concept and logic

The blog is fully static, built with [Eleventy (11ty)](https://www.11ty.dev/). Except a custom build of [Modernizr](http://modernizr.com/) and of [Prism](http://prismjs.com/) (including only the relevant modules), as well as [Normalize](http://necolas.github.io/normalize.css/), the site uses no libraries.

## Fork it

Feel free to use it for your own blog !

## Develop and build

Install dependencies:

    npm install

Build the site (output goes to `_site/`):

    npm run build

While writing (or hacking), you can run the dev server:

    npm run serve

This will build the site, start serving it at `http://localhost:8080`, and watch for changes.
