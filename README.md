# Wouter Admiraal's Blog

Find it [here](http://wadmiraal.net) !

All code is licensed under MIT, with the exception of code located under `js/vendor` and `css/vendor`.

Posts are licensed under [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/deed).

## Concept and logic

The blog is fully static. Except a custom build of [Modernizr](http://modernizr.com/) and of [Prism](http://prismjs.com/) (including only the relevant modules), as well as [Normalize](http://necolas.github.io/normalize.css/), the site uses no libraries.

## Fork it

Feel free to use it for your own blog !

## Develop and build

Use `bundler` to install dependencies:

    bundler install

Use the `jekyll build` command to build the site, which will be placed under `/_site`:

    bundle exec jekyll build

Then FTP it to your host and you're done.

While writing (or hacking), you can call

    bundle exec jekyll serve

Which will build the site and start serving it at `http://localhost:4000` (Jekyll will also watch the files for changes).
