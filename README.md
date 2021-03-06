# Wouter Admiraal's Blog

Find it [here](http://wadmiraal.net) !

*Blogging like a hacker !* This blog is built using [Gulp](http://gulpjs.com/), [Compass](http://compass-style.org/) and [Jekyll](http://jekyllrb.com/).

All code is licensed under MIT, with the exception of code located under `js/vendor` and `css/vendor`.

Posts are licensed under [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/deed).

## Concept and logic

The blog is fully static. Except a custom build of [Modernizr](http://modernizr.com/) and of [Prism](http://prismjs.com/) (including only the relevant modules), as well as [Normalize](http://necolas.github.io/normalize.css/), the site uses no libraries.

My idea was to have a site that was blazingly fast and super lightweight. The average weight of a full page is under 100Kb (not counting the Disqus plugin or Google Analytics, obviously).

Further speeding things up is the usage of Pushstate to load only the body of the page, to even more improve the overall speed (still in progress).

The site is fully responsive, and uses many modern functionality like `querySelectorAll` or the new XHR framework. The site degrades gracefully in older browsers.

## Fork it

Feel free to use it for your own blog !

## Develop and build

Use `npm` and `bundler` to install dependencies:

    npm install
    bundler install

Use the `build` script to build all source files, which will be placed under `jekyll-src/_site`:

    npm run build

Then FTP it to your host and you're done.

While writing (or hacking), you can call

    npm run serve

Which will build the site and start serving it at `http://localhost:4000` (Jekyll will also watch the files for changes).

## Accessibility

I embedded an accessibility check, to ensure the site follows the most critical WCAG 2.0 guidelines. Once the site is built, run the `test` script to test for accessibility:

    npm test 

## Next steps

Well, I'm thinking about replacing Jekyll with some JS equivalent (I've worked with [Assemble](http://assemble.io/) before). This will make integration with Gulp more natural and streamlined, and will reduce my Ruby dependencies (leaving only Sass and Compass). Ideally, I would like a full JS solution.

We'll see...

