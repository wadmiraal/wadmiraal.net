---
title: "Drupal 8 with Travis CI and Sonarcloud"
description: "It's pretty easy to start using Drupal along with your favourite CI server, as well as add some static code analysis to the mix. In this post, I'll explain how to set up a Drupal project with Travis CI and Sonarcloud integration."
layout: post
favorite: false
tags:
  - Drupal 8
  - Wisdom
  - PHP
---

Using a service like Travis CI or Sonarcloud has always seemed like the holly grail for Drupal projects. It's unfortunate that these usually require quite a tedious setup, which includes installing a database and webserver, configuring them, and finally going as far as to install _Drupal itself_.

However, the main hurdle here is using _functional_ tests (or Behat tests, although I believe using Behat would justify the long setup). If your project only includes unit and/or kernel tests (and I argue _it should_), using a CI actually becomes _much_ easier.

## Understanding Drupal unit and kernel tests

In Drupal 8, thanks to the inclusion of a _dependency injection container_, we can now mock parts of core in our test environments, allowing us to truly use unit tests. They complete in mere milliseconds, and are ideal for both <abbr title="Test Driven Development">TDD</abbr> and using <abbr title="Continuous Integration">CI</abbr>.

However, Drupal 8's maze of dependencies and services mean we sometimes need to mock _a lot_ of Drupal code. So much in fact, that the `setUp()` method of a unit test class can become larger than the actual test methods _combined_. For this reason, some projects revert to functional tests, but&mdash;as I've discussed before&mdash;they are _way_ to slow to run, and extremely hard to debug.

Kernel tests, on the other hand, are much faster. They do need a database to run. However, contrary to functional tests, they don't require a running webserver. This is a huge win when setting up a CI environment, as most have some sort of built-in PHP environment, which often includes SQLite support. This means the runner setup will only include downloading Drupal, and moving our code into the correct location.

Finally, both kernel and unit tests can be used to compute code coverage, which is incredibly useful when performing more in depth code analysis and quality control. This is not the case with functional tests.

## Kernel tests depend on Drupal's file structure

When running automated tests on a CI server, it's tempting to use `composer require drupal/core:~8.4` followed by `phpunit`, but unfortunately it's not that simple.

Although this would work for unit tests, kernel tests assume they are run in context of a Drupal project, so they will look for folders and files in places you may not expect.

It's still worth the effort to set up, though. It may seem complicated at first, but I assure you: it's really not. Plus, it's still _much_ easier than if you were using functional tests&hellip;

## A working example with Travis CI and Sonarcloud

In this example, I will use [Travis CI](https://travis-ci.org), but of course other CI vendors would work too. It will &ldquo;build&rdquo; a fresh Drupal site, run our tests, and push our code, with test statistics, to [Sonarcloud](https://sonarcloud.io) for static code analysis. 

You can see a working example [here](https://github.com/wadmiraal/guernsey).

Imagine this is our module's file structure:

<pre><code class="language-yaml">├── .travis.yml
├── config/
│   └── install/
│       └── ...
├── my_module.info.yml
├── my_module.permissions.yml
├── my_module.routing.yml
├── sonar-project.properties
├── sqlite-driver-exception.patch
├── src/
│   └── ...
├── templates/
│   └── ...
├── tests/
│   └── src/
│       └── Unit/
│           └── ...
│       └── Kernel/
│           └── ...
└── travis-ci-phpunit.xml.dist.patch
</code></pre>

Our example `sonar-project.properties` file looks like this:

<pre><code class="language-ini">sonar.projectKey=my_organization:my_module
sonar.projectName=My Module
</code></pre>

And here's our example `.travis.yml` file:

<pre><code class="language-yaml">language: php
php:
  - '7.0'
  - '7.1'
addons:
  sonarcloud:
    organization: "my_organization"
    token:
      secure: "secure-string="
env:
  - SIMPLETEST_DB=sqlite://testdb.sqlite
install:
  - composer create-project drupal-composer/drupal-project:8.x-dev drupal --stability dev --no-interaction
  - composer require -d drupal 'drupal/flag:4.0-alpha2'
  - patch -d drupal/web -p1 < sqlite-driver-exception.patch
  - patch -d drupal/web/core -p1 < travis-ci-phpunit.xml.dist.patch
  - mkdir -p drupal/web/modules/my_module && cp -a my_module* tests templates src config drupal/web/modules/my_module
script:
  - drupal/vendor/bin/phpunit -c drupal/web/core drupal/web/modules/my_module/tests/ --coverage-clover clover.xml --log-junit junit.log
</code></pre>

Let's go over these lines:

<pre><code class="language-yaml">language: php
php:
  - '7.0'
  - '7.1'
</code></pre>

These are no-brainers: we're telling Travis to run these tests in PHP 7.0 and 7.1 environments.

<pre><code class="language-yaml">addons:
  sonarcloud:
    organization: "my_organization"
    token:
      secure: "secure-string="
</code></pre>

Here we tell Travis to include the Sonarcloud plugin. We need to add the Sonarcloud _organization_ key, as well as an authentication token generated specifically for our repo. **Don't add this in plain text!** You can securely add this key using [`travis encrypt`](https://docs.travis-ci.com/user/environment-variables/#Encrypting-environment-variables).

If your favorite CI doesn't have built-in support for Sonarcloud, they have an executable you can download and run after the build is complete.

<pre><code class="language-yaml">env:
  - SIMPLETEST_DB=sqlite://testdb.sqlite
</code></pre>

Kernel tests require a running database. The easiest solution is to use SQLite, which is basically a static file. You can either add this information to the `phpunit.xml.dist` file, or set it as an environment variable. I prefer to make it explicit, hence this line.

<pre><code class="language-yaml">install:
  - composer create-project drupal-composer/drupal-project:8.x-dev drupal --stability dev --no-interaction
</code></pre>

This is where we download a full copy of Drupal. We use the [Composer template for Drupal projects](https://github.com/drupal-composer/drupal-project), and save it to a folder called `drupal`.

<pre><code class="language-yaml">  - composer require -d drupal 'drupal/flag:4.0-alpha2'
</code></pre>

Here we install our dependencies. In our example, we depend on a specific version of the [Flag](http://www.drupal.org/project/flag) module. You could add any modules (or even themes and profiles) you need, and Composer will put them in the correct location, thanks to the configuration shipping with the Composer template we're using.

<pre><code class="language-yaml">  - patch -d drupal/web -p1 < sqlite-driver-exception.patch
</code></pre>

Here, we apply our `sqlite-driver-exception.patch` to Drupal core. This patch is&mdash;at the time of writing&mdash;required to make SQLite work with Drupal.

It contains the following:

<pre><code class="language-diff">diff --git a/core/lib/Drupal/Core/Database/Database.php b/core/lib/Drupal/Core/Database/Database.php
index dd19018828..f3abe2b24e 100644
--- a/core/lib/Drupal/Core/Database/Database.php
+++ b/core/lib/Drupal/Core/Database/Database.php
@@ -456,9 +456,15 @@ public static function ignoreTarget($key, $target) {
    */
   public static function convertDbUrlToConnectionInfo($url, $root) {
     $info = parse_url($url);
-    if (!isset($info['scheme'], $info['host'], $info['path'])) {
+    if (!isset($info['scheme'], $info['host'])) {
       throw new \InvalidArgumentException('Minimum requirement: driver://host/database');
     }
+    if ($info['scheme'] !== 'sqlite' && !isset($info['path'])) {
+      throw new \InvalidArgumentException('Minimum requirement: driver://host/database');
+    }
+    elseif ($info['scheme'] === 'sqlite') {
+      $info['path'] = $info['host'];
+    }
     $info += [
       'user' => '',
       'pass' => '',
</code></pre>

Next&hellip;

<pre><code class="language-yaml">  - patch -d drupal/web/core -p1 < travis-ci-phpunit.xml.dist.patch
</code></pre>

Here, we apply our `travis-ci-phpunit.xml.dist.patch` to Drupal core. This patch basically tells PHPUnit we only want to compute code coverage statistics for our own code, to speed things up a bit, and avoid unnecessary warnings in Sonarcloud.

It contains the following:

<pre><code class="language-diff">diff a/phpunit.xml.dist b/phpunit.xml.dist
--- a/phpunit.xml.dist	2018-01-12 09:34:43.000000000 +0100
+++ b/phpunit.xml.dist	2018-01-12 09:35:06.000000000 +0100
@@ -55,11 +55,7 @@
   &lt;!-- Filter for coverage reports. --&gt;
   &lt;filter&gt;
     &lt;whitelist&gt;
-      &lt;directory&gt;./includes&lt;/directory&gt;
-      &lt;directory&gt;./lib&lt;/directory&gt;
-      &lt;directory&gt;./modules&lt;/directory&gt;
-      &lt;directory&gt;../modules&lt;/directory&gt;
-      &lt;directory&gt;../sites&lt;/directory&gt;
+      &lt;directory&gt;../modules/my_module&lt;/directory&gt;
       &lt;!-- By definition test classes have no tests. --&gt;
       &lt;exclude&gt;
         &lt;directory suffix="Test.php"&gt;./&lt;/directory&gt;
</code></pre>

Next&hellip;

<pre><code class="language-yaml">mkdir -p drupal/web/modules/my_module && cp -a my_module* tests templates src config drupal/web/modules/my_module
</code></pre>

Here, we copy all our code over to the `drupal/web/modules/my_module` directory. This is necessary for kernel tests, which will only search for our code inside the Drupal root.

<pre><code class="language-yaml">script:
  - drupal/vendor/bin/phpunit -c drupal/web/core drupal/web/modules/my_module/tests/ --coverage-clover clover.xml --log-junit junit.log
</code></pre>

Here we finally do the running part. We use the version of PHPUnit that comes with Drupal, to make sure we don't run into compatibility issues if Travis updates its binaries. We give the location to the `phpunit.xml.dist` file using `-c`, pass our module's code location to tell PHPUnit to _only_ run our tests, and generate coverage stats.

<pre><code class="language-yaml"> - sonar-scanner -Dsonar.sources=drupal/web/modules/my_module/src -Dsonar.php.tests.reportPath=junit.log -Dsonar.php.coverage.reportPaths=drupal/web/clover.xml
</code></pre>

In the second part, we run the `sonar-scanner` plugin, passing the Clover and JUnit log files for coverage analysis. Because of this, we need to pass the path to the source code actually tested, and _not_ the code in the Travis build root. Which is why `-Dsonar.sources` points to our copied code, instead of simply the root of the folder.

In our particular case, we only have kernel tests. If we had any unit tests, they would run fine as well. Functional tests, however, would not run in our case, but as I've written on this blog before, you shouldn't necessarily _write_ functional tests in the first place (and they're _way_ more complex to run in a CI environment).

Now, whenever we push to our repository, Travis CI will fetch the code and run our build, run the tests, and push the files for code analysis to Sonarcloud.

## What can we learn from this example

This setup is pretty straightforward, once you know it. It's easy to replicate, and the only thing that will likely change is the dependency management. It also encourages us to use kernel and unit tests, and stay away from functional tests as much as possible.

The ability to run tests using a CI server also opens the door for code analysis tools, like Code Climate (my personal favorite) and Sonarqube. These tools are invaluable for producing better quality code. And as icing on the cake: the ability to add test coverage statistics to the mix further encourages to write unit and kernel tests, _and_ to write _more_ of them (functional tests cannot compute code coverage; one more reason not to use them).

All this isn't to say functional tests are _bad_. They are just very complicated and time consuming to write, run, and debug. For this reason, they should not be used for testing highly specific units of logic; rather, they are best used for testing UIs and very high-level concepts. And even then, I'd argue you'd be better of using Behat tests, which, although even _more_ complicated to set up, at least encourage you to think more about the behavior and UI, rather than the underlying code. But that's a topic for another day.
