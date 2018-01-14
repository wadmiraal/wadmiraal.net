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

Writing code for a Drupal project means you need a Drupal code base. It's tempting to use `composer require drupal/core:8.4.1` to load all dependencies, and code away, but it's not that simple.

Of course, if you actually want to _see_ your module in action, you will need to install it in a Drupal site. But if you only want to write code and tests, you can actually go a long way without ever installing Drupal, simply by relying on Composer's autoloading. 

Until you run kernel tests, that is.

Kernel tests assume they are run in context of a Drupal project, so they will look for folders and files in places you may not expect. If you simple call `composer require drupal/core` and run `phpunit --filter MyKernelTest`, you will run into all kinds of strange errors.

This may not be that big of a deal when having your local development server set up (_hint: use [Docker](/lore/2015/03/27/use-docker-to-kickstart-your-drupal-development/)_), but if you want to run your tests in a CI environment, you'll need to do some extra work.

## A working example: Travis CI

In this example, I will use [Travis CI](https://travis-ci.org), but of course other CI vendors would work too.

Basically, we need to: 

1. Download Drupal.
2. If Drupal 8.4, apply a small patch to make SQLite work (called `sqlite-driver-exception.patch` in our example).
3. Update the `phpunit.xml.dist` file, so we only generate code coverage stats for our own code.
4. Copy our code to the correct location in the Drupal file structure.
5. Run PHPUnit.


Here's an example `.travis.yml` file:

    language: php
    php:
      - '7.0'
      - '7.1'
    env:
      - SIMPLETEST_DB=sqlite://testdb.sqlite
    install:
      - composer create-project drupal-composer/drupal-project:8.x-dev drupal --stability dev --no-interaction
      - cp sqlite-driver-exception.patch drupal/web && cd drupal/web/ && patch -p1 < sqlite-driver-exception.patch && cd -
      - mkdir -p drupal/web/modules/guernsey && cp -a guernsey* tests templates src config drupal/web/modules/guernsey
      - cp travis-ci-phpunit.xml.dist.patch drupal/web/core && cd drupal/web/core && patch -p1 < travis-ci-phpunit.xml.dist.patch && cd -
    script:
      - drupal/vendor/bin/phpunit -c drupal/web/core drupal/web/modules/guernsey/tests/ --coverage-clover clover.xml --log-junit junit.log

