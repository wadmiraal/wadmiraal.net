---
title: "Drupal 8 unit and kernel tests, with Travis CI and Sonarcloud"
description: "It's possible (and pretty simple) to start using Drupal unit and kernel tests along with your favourite CI server, as well as add some static code analysis to the mix. In this post, I'll explain how to set up a Drupal module with Travis CI and Sonarcloud."
layout: post
favorite: false
tags:
  - Drupal 8
  - Wisdom
  - PHP
---

...

## Understanding Drupal unit and kernel tests

In Drupal 8, it has become much more feasible to write _actual_ unit tests. In Drupal 7, unit tests were close to unusable, only serving very specific cases, with little added benefit. You almost always had to rely on &ldquo;web tests&rdquo; (`DrupalWebTestCase`, called &ldquo;functional tests&rdquo; in Drupal 8) to get things done (_tip: checkout my [previous posts](/lore/2014/07/23/write-testable-code-in-drupal-part-1/) on how to use unit tests more efficiently in Drupal 7_). In Drupal 8, thanks to the inclusion of a _dependency injection container_, we can now mock parts of core in our test environments, allowing us to truly use unit tests (`Drupal\Tests\UnitTestCase`). They complete in mere milliseconds (if set up correctly), and the feedback is almost instantaneous.

However, Drupal 8's maze of dependencies and services mean we sometimes need to mock _a lot_ of Drupal code. So much in fact, that the `setUp()` method of a unit test class can become larger than the actual test methods _combined_. Switching back to browser tests is not an option either: they are _way_ to slow to run, sometimes taking **several minutes** to run.

Enter &ldquo;kernel tests&rdquo;, which can be seen as a hybrid between unit functional tests. It needs a database to run (which can be a SQLite file), and can &ldquo;install&rdquo; modules. However, contrary to functional tests, the test class doesn't install anything unless told to, which is a huge time saver. It also doesn't require a running webserver, which is another huge win when configuring a CI environment.

## Kernel tests depend on Drupal's file structure

When running automated tests on a CI server, it's tempting to use `composer require drupal/core:8.4.1` followed by `phpunit`, but unfortunately it's not that simple.

Although this would work for unit tests, kernel tests assume they are run in context of a Drupal project, so they will look for folders and files in places you may not expect.

## A working example: Travis CI and Sonarcloud

In this example, I will use [Travis CI](https://travis-ci.org), but of course other CI vendors would work too.

Basically, we need to: 

1. Download Drupal.
2. If Drupal 8.4.x, apply a small patch to make SQLite work (called `sqlite-driver-exception.patch` in our example).
3. Update the `phpunit.xml.dist` file, so we only generate code coverage stats for our own code (we'll ship with a 2nd patch file for convenience, called `travis-ci-phpunit.xml.dist.patch` in our example).
4. Copy our code to the correct location in the Drupal file structure.
5. Run PHPUnit.

You can see a working example [here](https://github.com/wadmiraal/guernsey).

Here's our module file structure:

<pre><code class="language-yaml">
├── config/
│   └── install/
│       └── ...
├── .travis.yml
├── my_module.info.yml
├── my_module.permissions.yml
├── my_module.routing.yml
├── sonar-project.properties
├── sqlite-driver-exception.patch
├── src/
│   ├── Entity/
│   │   └── ...
│   └── Form/
│       └── ...
├── templates/
│   └── ...
├── tests/
│   └── src/
│       └── Kernel/
│           └── Entity/
│               └── ...
└── travis-ci-phpunit.xml.dist.patch
</code></pre>

Here's an example `.travis.yml` file:

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

<pre><code class="language-yaml">env:
  - SIMPLETEST_DB=sqlite://testdb.sqlite
</code></pre>

Kernel tests require a running database. The easiest solution is to use SQLite, which is basically a static file. You can either add this information to the `phpunit.xml.dist` file, or set it as an environment variable. As many examples seem to use a running MySQL database, which is a lot harder and longer to set up, I prefer to make it explicit. Hence this line.

<pre><code class="language-yaml">install:
  - composer create-project drupal-composer/drupal-project:8.x-dev drupal --stability dev --no-interaction
</code></pre>

This is where we download a full copy of Drupal. We use the [Composer template for Drupal projects](https://github.com/drupal-composer/drupal-project), and save it to a folder called `drupal`.

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

Here, we apply our `travis-ci-phpunit.xml.dist.patch` to Drupal core. This patch basically tells PHPUnit we only want to compute code coverage statistics for our own code.

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

Here, we copy all our code over to the `drupal/web/modules/` directory. This is necessary for kernel tests, which will only search for code in specific locations.

<pre><code class="language-yaml">script:
  - drupal/vendor/bin/phpunit -c drupal/web/core drupal/web/modules/my_module/tests/ --coverage-clover clover.xml --log-junit junit.log
  - sonar-scanner -Dsonar.sources=drupal/web/modules/my_module/src -Dsonar.php.tests.reportPath=junit.log -Dsonar.php.coverage.reportPaths=drupal/web/clover.xml
</code></pre>

Here we finally do the running part. We use the version of PHPUnit that comes with Drupal, to make sure we don't run into compatibility issues if Travis updates its binaries. We give the location to the `phpunit.xml.dist` file using `-c`, pass our module's code location to tell PHPUnit to _only_ run our tests, and generate coverage stats.

In the second part, we run the `sonar-scanner` plugin, passing the Clover and JUnit log files for coverage analysis. Because of this, we need to pass the path to the source code actually tested, and _not_ the code in the Travis build root. Which is why `-Dsonar.sources` points to our copied code, instead of simply the root of the folder.

In our particular case, we only have kernel tests. If we had any unit tests, they would run fine as well. Functional tests, however, would not run in our case, but as I've written on this blog before, you shouldn't necessarily _write_ functional tests in the first place (and they're _way_ more complex to run in a CI environment).
