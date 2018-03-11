---
title: "Simple functional testing in Drupal 8 with Travis CI"
description: "As much as I dislike functional tests in Drupal, sometimes you simply have to use them. But many setup examples for CI servers require installing a webserver, a database, etc. Whereas there's a much simpler and faster way."
layout: post
favorite: false
tags:
  - Drupal 8
  - Automated Testing
  - Wisdom
  - PHP
---

I was inspired to test this out when I read [this post](https://www.lullabot.com/articles/the-simplest-path-to-a-drupal-local-environment) by Lullabot. In many examples you can find online, you'll see a rather complex setting up process, usually including installing MySQL, Pear, Drush, and sometimes even a webserver.

I'm a big fan of SQLite in automated testing environments. It's much faster and simpler to set up, and usually comes pre-installed with many CI runners. Installing MySQL (or any other RDBS) is overkill, unless you use vendor-only functionality (which you shouldn't, if you can avoid it).

Many examples make use of PHP's built-in ability to serve pages, which is a great idea. Sure, it's not fast nor efficient. But it makes more than up for the fact that you don't have to install something like Apache or NginX.

[Here's a working example for a module with functional tests](https://github.com/wadmiraal/drupal8_tdd_form_validation/tree/functional_test_example). It is taken from [part 3](/lore/2018/02/12/drupal-forms-and-tdd-part-3-form-validation/) of my Drupal 8 TDD tutorial (the bonus video).

## Functional tests require a full Drupal site

Just as with kernel tests (see my previous article about [using Travis CI and Sonarcloud here](/lore/2018/01/22/drupal-8-with-travisci-and-sonarcloud/)), we need a full Drupal code base. I find it convenient to use the [Composer template for Drupal projects](https://github.com/drupal-composer/drupal-project). It installs Drupal in a nice, flexible, and standard way, which is how I structure my Drupal 8 projects.

The only caveat is that, after getting the source code, your module code is no longer in the correct place. There are several ways around this, but I find it easiest to simply copy my module code to the correct location.

You could also `cd` into another directory, like `/tmp`, install Drupal there, and then create a symlink to `$TRAVIS_BUILD_DIR`. But I'm afraid of potential future permission issues, in case Travis decides to change something in its default setup. Hence, I keep everything in the build directory, where I _know_ we have full write permissions.

_Note: if you're testing a full Drupal code base, then you obviously don't need this step, but would replace it with something like `composer install` or ` drush make`._

## A working example

Here's our example `.travis.yml` file:

<pre><code class="language-yaml">language: php
php:
  - '7.0'
  - '7.1'
cache:
  directories:
    - $HOME/.composer/cache/files
install:
  # We need a full Drupal project for our functional tests to work. Create a new project.
  - composer create-project drupal-composer/drupal-project:8.x-dev drupal --stability dev --no-interaction
  # Our code is no longer in the correct place. Copy it over.
  - mkdir -p drupal/web/modules/form_validation && cp -a form_validation* tests src drupal/web/modules/form_validation
  # Run PHP as a webserver, in the background
  - (php -S localhost:8888 -t $(pwd)/drupal/web/ &) >> /dev/null 2>&1
script:
  - cd drupal/web && php ./core/scripts/run-tests.sh --php $(which php) --dburl sqlite://tmp/tests.sqlite --sqlite /tmp/tests.sqlite --url http://127.0.0.1:8888/ --directory modules/form_validation/tests/ --concurrency 4

</code></pre>

Let's go over these lines:

<pre><code class="language-yaml">language: php
php:
  - '7.0'
  - '7.1'
</code></pre>

These are no-brainers: we're telling Travis to run these tests in PHP 7.0 and 7.1 environments.

<pre><code class="language-yaml">cache:
  directories:
    - $HOME/.composer/cache/files
</code></pre>

Here we tell Travis CI to keep the Composer cache between builds, which greatly speeds things up.

<pre><code class="language-yaml">install:
  - composer create-project drupal-composer/drupal-project:8.x-dev drupal --stability dev --no-interaction
</code></pre>

This is where we download a full copy of Drupal. We use the [Composer template for Drupal projects](https://github.com/drupal-composer/drupal-project), and save it to a folder called `drupal`.

Next&hellip;

<pre><code class="language-yaml">  - mkdir -p drupal/web/modules/form_validation && cp -a form_validation* tests src drupal/web/modules/form_validation
</code></pre>

Here, we copy all our code over to the `drupal/web/modules/form_validation` directory. This is necessary for functional tests, which will only work if put under the Drupal root.

Next&hellip;

<pre><code class="language-yaml">  - (php -S localhost:8888 -t $(pwd)/drupal/web/ &) >> /dev/null 2>&1
</code></pre>

Here, we use PHP's built-in webserver, and tell it to serve from our new webroot. We make it run in the background, and redirect all output to `/dev/null`.

At this point, we're all set up. Notice that this is very simple. If your project is a Drupal project, instead of a module like here, you could omit the part where we download core, and replace it with your own build mechanism. 

<pre><code class="language-yaml">script:
  - cd drupal/web && php ./core/scripts/run-tests.sh --php $(which php) --dburl sqlite://tmp/tests.sqlite --sqlite /tmp/tests.sqlite --url http://127.0.0.1:8888/ --directory modules/form_validation/tests/ --concurrency 4
</code></pre>

Here we finally do the running part. There's a lot going on in there, so let me break it down into chunks:

* <pre><code class="language-bash">--php $(which php)</code></pre>
  Within the Travis CI runner, `core/scripts/run-tests.sh` seems to have some issues finding the PHP binaries. We use this to point it to correct location.
* <pre><code class="language-bash">--dburl sqlite://tmp/tests.sqlite</code></pre>
  `core/scripts/run-tests.sh` expects a Drupal site to be installed, and will look for the default database in the `settings.php` file. But we didn't install Drupal. Here, we simply point it to a dummy SQLite database file. It doesn't even need to exist; it's just to keep it from complaining.
* <pre><code class="language-bash">--sqlite /tmp/tests.sqlite</code></pre>
  Here we specify which database to use for the actual tests. Because we want to use SQLite, we have to use this `--sqlite` option, and cannot simply rely on `--dburl`. Go figure.
* <pre><code class="language-bash">--url http://127.0.0.1:8888/</code></pre>
  Here we specify at what URL the site is running. This is necessary for the functional tests.
* <pre><code class="language-bash">--directory modules/form_validation/tests/</code></pre>
  Here we specify where our tests are located. It's a bit easier than listing classes, or specifying a group.
* <pre><code class="language-bash">--concurrency 4</code></pre>
  Here we specify how many test classes to run in parallel. Depending on the CI environment and your use-case, you can adjust this value. If you start running into unexplainable errors, it may be because this value is too high, and tests start getting mixed up.
  
Note that, as opposed to my previous examples, here we don't use PHPUnit to run our tests. This is because Drupal's `core/scripts/run-tests.sh` script can run tests in parallel, which is harder to achieve with PHPUnit. Furthermore, you cannot compute code coverage when running functional tests, so PHPUnit wouldn't really have added any value anyway.
  
## Conclusion

As I've mentioned many times before, I'm not advocating the use of functional tests in Drupal projects. I really recommend you use unit and/or kernel tests instead. However, sometimes there really is no other option (like, when adding tests for existing code). And for those cases, knowing how to easily setup your favorite CI environment can be a real help. 
