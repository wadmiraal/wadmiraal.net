# Wouter Admiraal's Blog

*Blogging like a hacker !* This blog is built using [Gulp](http://gulpjs.com/), [Compass](http://compass-style.org/) and [Jekyll](http://jekyllrb.com/).

All code is licensed under MIT, with the exception of code located under `js/vendor` and `css/vendor`.

Posts are licensed under [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/deed).

## Concept and logic

The blog is fully static. Except a custom build of [Modernizr](http://modernizr.com/) and of [Prism](http://prismjs.com/) (including only the relevant modules), as well as [Normalize](http://necolas.github.io/normalize.css/), the site uses no libraries.

My idea was to have a site that was blazingly fast and super lightweight. The average weight of a full page is under 100Kb (not counting the Disqus plugin or Google Analytics, to be fair).

Further speeding things up is the usage of Pushstate to load only the body of the page, to even more improve the overall speed (still in progress).

The site is fully responsive, and uses many modern functionality like `querySelectorAll` or the new XHR framework. The site degrades gracefully in older browsers.

## Build

Use `npm` and `bundler` to install dependencies:

    npm install
    bundler install

Use `gulp` to build all source files, which will be placed under `jekyll-src/`. This is what I do when developing.

    gulp

When ready to deploy, use `gulp build` to generate the full site in `jekyll-src/_site`. Then FTP it to your host and you're done. Use `gulp serve` will start Jekyll and serve the site on `http://localhost:4000`.
