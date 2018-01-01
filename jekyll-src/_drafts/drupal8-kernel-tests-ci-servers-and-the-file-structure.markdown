---
title: "Drupal 8 Kernel Tests, CI Servers, And The File Structure"
description: "Applying TDD principles to Drupal 8 development can be cumbersome, not just because of the time it takes to run tests, but also because of Drupal's very strict dependency on its file structure. In this post, I explain how to use Composer's events to set up a working Drupal site structure upon installing or updating dependencies."
layout: post
favorite: false
tags:
  - Drupal 8
  - Wisdom
  - PHP
  - TDD
---

...

## Understanding Drupal Unit And Kernel Tests

In Drupal 8, it has become much more feasible to write _actual_ unit tests. In Drupal 7, unit tests were close to unusable, only serving very specific cases, with little added benefit. You almost always had to rely on &ldquo;web tests&rdquo; (`DrupalWebTestCase`, called &ldquo;functional tests&rdquo; in Drupal 8) to get things done (_tip: checkout my [previous posts](/lore/2014/07/23/write-testable-code-in-drupal-part-1/) on how to use unit tests more efficiently in Drupal 7_). In Drupal 8, thanks to the inclusion of a _dependency injection container_, we can now mock parts of core in our test environments, allowing us to truly use unit tests (`Drupal\Tests\UnitTestCase`). They complete in mere milliseconds (if set up correctly), and the feedback is almost instantaneous.

However, Drupal 8's maze of dependencies and services mean we sometimes need to mock _a lot_ of Drupal code. So much in fact, that the `setUp()` method of a unit test class can become larger than the actual test methods _combined_. Switching back to browser tests is not an option either: they are _way_ to slow to run, sometimes taking **several minutes** to run.

Enter &ldquo;kernel tests&rdquo;, which can be seen as a hybrid between unit functional tests. It needs a database to run (which can be a SQLite file), and can &ldquo;install&rdquo; modules. However, contrary to functional tests, the test class doesn't install anything unless told to, which is a huge time saver. This gives us the best of both worlds, letting the Drupal API do its thing with a running database, while letting us run the tests relatively quickly.

I do say _relatively quickly_, because kernel tests are still no way near as fast as unit tests, taking dozens of seconds to run per test method. In fact, I'd say they are so slow you would never run the entire test suite when doing TDD, instead focusing on a single test class or method. But still, it's just quick enough to be (more or less) usable in a TDD environment, and fast enough to justify writing a lot more tests.

## Kernel Tests Depend On Drupal's File Structure

Writing code for a Drupal project means you need a Drupal code base. It's tempting to use `composer require drupal/core:8.4.1` to load all dependencies, and code away, but it's not that simple.

Of course, if you actually want to _see_ your module in action, you will need to install it in a Drupal site. But if you only want to write code and tests, you can actually go a long way without ever installing Drupal, simply by relying on Composer's autoloading. 

Until you run kernel tests, that is.

Kernel tests assume they are run in context of a Drupal project, so they will look for folders and files in places you may not expect. If you simple call `composer require drupal/core` and run `phpunit --filter MyKernelTest`, you will run into all kinds of strange errors.

This may not be that big of a deal when having your local development server set up (_hint: use [Docker](/lore/2015/03/27/use-docker-to-kickstart-your-drupal-development/)_), but if you want to run your tests in a CI environment, you're in bad shape. However, fear not: it _is_ possible to run Drupal kernel tests, simply by relying on Composer.

## Mock Drupal's File Structure On `composer install`

Basically, a typical Drupal site has the following folder structure:

```` 
├── core
│   ├── assets
│   ├── config
│   ├── includes
│   ├── lib
│   ├── misc
│   ├── modules
│   ├── profiles
│   ├── scripts
│   ├── tests
│   └── themes
├── modules
├── profiles
├── sites
│   └── default
└── themes
````

When you install Drupal core via Composer, however, you will end up with only what's inside `core`:

````
vendor/drupal/
├── core
│   ├── assets
│   ├── config
│   ├── includes
│   ├── lib
│   ├── misc
│   ├── modules
│   ├── profiles
│   ├── scripts
│   ├── tests
│   └── themes
```` 
 
This works fine for unit tests, but kernel (and functional) tests will fail to run. For many developers, this means using `composer require drupal/core` when developing service modules, or running tests on a CI server, is not an option. The standard approach is to:

1. Download and extract Drupal.
2. `cd` into the `/modules/` directory, and clone (or copy) your module code.
3. Download all dependencies, if any.
4. `cd` into the `/core/` directory, and call `phpunit --filter ...`.

However, what if you could just call `composer install`, and then `phpunit`? That would be a much more &ldquo;standard&rdquo; approach, compared to the rest of the PHP world, and greatly simplify automated testing.

It's actually possible, and relatively easy. Plus, it forces us to define our module's namespace and dependencies in a `composer.json` file. This may seem overkill, as it is not the standard Drupal way, but since Composer has become the defacto PHP dependency manager, it only makes sense that we embrace it as well.

If you don't have a `composer.json` file, simply start by calling `composer init`. It will ask you some questions about your module. When done, you must declare all your module's dependencies. Please note that _all_ Drupal 8 modules are in a Composer registry (not enabled by default), so you could very well call `composer require drupal/devel`, for example. 

Then, we need to define what dependencies you have for _development_. This usually includes at least Drupal Core (we don't require it for production, as we will always be in a Drupal environment anyway), as well as Drupal's own development dependencies (as they are not recursively resolved by Composer). We also need `composer/installers`, as this is a Drupal project:

<pre><code class="language-bash">
composer require --dev drupal/core:8.4.1
composer require --dev "phpunit/phpunit:>=4.8.35 <5"
composer require --dev "phpspec/prophecy:^1.4"
composer require --dev "symfony/css-selector:~3.2.8"
composer require --dev "symfony/phpunit-bridge:~3.2.8"
composer require --dev "mikey179/vfsStream:^1.2"
composer require --dev composer/installers
</code></pre>

Once you have all your dependencies, we need to define our own namespace(s). Drupal's autoloading mechanism usually does this for us, but in true Composer/PSR4 style, we will define it ourselves. Open `composer.json`, and add the following:

<pre><code class="language-javascript">
    "autoload": {
        "psr-4": {
            "Drupal\\my_module\\": "src",
            "Drupal\\Tests\\my_module\\": "tests/src"
        }
    }
</code></pre>

This is where the standard Drupal module code lives. If you use a different structure, update the above accordingly.

We also want Composer to know where to find Drupal modules and themes. We need to register the Drupal Packagist repository for that. Open `composer.json`, and add the following:

<pre><code class="language-javascript">
    "repositories": [
        {
            "type": "composer",
            "url": "https://packages.drupal.org/8"
        }
    ]
</code></pre>

We also need to make Composer &ldquo;aware&rdquo; of where Drupal specific code (modules, themes) must live. Open `composer.json` again, and add the following:

<pre><code class="language-javascript">
    "extra": {
        "installer-paths": {
            "vendor/drupal/modules/contrib/{$name}": ["type:drupal-module"],
            "vendor/drupal/profiles/contrib/{$name}": ["type:drupal-profile"],
            "vendor/drupal/themes/contrib/{$name}": ["type:drupal-theme"]
        }
    }
</code></pre>

Finally, we need to tell Composer to create some default directories and files for us, whenever we install or update our dependencies. We use Composer's `scripts` for that. Scripts can also serve as even handlers, which is what we use here. Open `composer.json` again, and add the following:

<pre><code class="language-javascript">
    "scripts": {
        "post-install-cmd": [
            "cd vendor/drupal && ln -sf ../autoload.php",
            "mkdir -p vendor/drupal/{modules,themes,profiles}",
            "mkdir -p vendor/drupal/sites",
            "mkdir -p vendor/drupal/modules/custom/my_module",
            "for file in ./*; do { [ $file != './vendor' ] || continue; cd vendor/drupal/modules/custom/my_module && ln -fs ../../../../../$file && cd -; }; done"
        ],
        "post-update-cmd": "@post-install-cmd"
    }
</code></pre>

You will notice that the `post-update-cmd` simply uses the `post-install-cmd`, so we keep things nice and <abbr title="Don't Repeat Yourself">DRY</abbr>. Let's go over each line separately:

<pre><code class="language-javascript">
            "cd vendor/drupal && ln -sf ../autoload.php",
</code></pre>

Drupal has a hard-coded path to include the `autoload.php` file for running tests. This cannot be configured, unfortunately. But the default `autload.php` file Composer generates is one level higher. So, we simply create a symbolic link to the real `autoload.php` file, to trick Drupal into using it.

<pre><code class="language-javascript">
            "mkdir -p vendor/drupal/{modules,themes,profiles}",
            "mkdir -p vendor/drupal/sites",
</code></pre>

Drupal's test bootstrap code will dynamically look for code in `/modules/`, `/themes/`, `/profiles/` and `/sites/`. Unfortunately, it doesn't test to see if those folders exist before scanning them, which will trigger PHP warnings. So, we create empty directories to prevent that.

<pre><code class="language-javascript">
            "mkdir -p vendor/drupal/modules/my_module",
            "for file in ./*; do { [ $file != './vendor' ] || continue; cd vendor/drupal/modules/my_module && ln -fs ../../../../$file && cd -; }; done"
</code></pre>

This is an odd one, but still required. Even though PHPUnit will use our own code for the test runs, it is likely &emdash; if you use kernel tests &emdash; that you will need to &ldquo;install&rdquo; some configuration that ships with your module. However, Drupal will look for your module in its filesystem, and if it doesn't find it, it will abort the test. To trick Drupal into &ldquo;seeing&rdquo; our module, we simply symlink everything in the project root to `vendor/drupal/modules/my_module` (you can even leave the `my_module` name, Drupal doesn't care). We skip the `./vendor/` directory, to prevent an infinite recursive loop, but we do symlink the rest.

In the end, your `composer.json` file will look something like this:

<pre><code class="language-javascript">

</code></pre>

Now, when you call `composer install`, you will have a fully-functional set up for running your unit tests. Which brings us to the final step.

## Create A `phpunit.xml` File
