---
title: "The state of automated testing in Drupal 8"
description: "In Drupal 7, automated testing practices were terrible. In this post, I want to outline what has changed with Drupal 8."
layout: post
tags:
  - Drupal 8
  - Wisdom
  - PHP
---

**UPDATE 2018-01-05: I made a huge mistake when running the Drupal core tests, resulting in incorrect data. My bad. Corrected data below.**

3 years ago, [I wrote a series of blog posts](/lore/2014/07/22/write-testable-code-in-drupal-part-1/) about adopting new practices for writing better automated tests in Drupal 7. Now, with Drupal 8.5 getting finalized, and the project having embraced standards like PHPUnit and dependency injection, I thought it was time to look at how we, as a community, have evolved in our practice of writing tests.

## Why automated tests matter

There are many reasons projects benefit from automated tests, but in my opinion, the single most important aspect is _confidence_. 

For the development team, confidence that what is shipped works, confidence that that last major refactoring didn't break anything, confidence that the new features added are compatible. 

For organizations that have to choose a framework, confidence that the work is well done, and future releases are likely to remain stable.

For larger projects like Drupal, which receive contributions from people outside the core team, confidence that this new patch from a new community member actually works, and doesn't break anything.

Personally, as a professional, I have come to rely on tests so much, that I strongly dislike working on projects that don't have any. Of course, I'm not talking about your typical news website, or blog; those fare well enough without tests. No, I'm talking about websites with complex functionality, like intranet sites or web applications. When deployment day comes around, it can be nerve wracking to push &ldquo;unstable&rdquo; projects to production. &ldquo;What might break this time?&rdquo; Running a suite of tests with +95% coverage prior to deployment, on the other hand, gives a team confidence. So much, in fact, that more and more major companies get into the practice of deploying to production several times _per day_.

Unfortunately for us, Drupal developers, ...

## Testing Drupal projects is hard

And, if you've never done Drupal 7 or earlier testing, believe me: _it used to be much worse_. The fact is, Drupal is an incredibly complex beast, and it's architecture means that testing can be very complicated indeed. Not only that, the _time_ it takes to run these tests tends to be **much** higher than for other PHP projects, further discouraging programmers from writing them&mdash;whether upfront, or _at all_.

The Drupal core team, as a whole, doesn't really help here, unfortunately. Although Drupal 8 has a very impressive set of tests, one cannot say that it's exemplary either. 

Consider this small experiment, which compares running the entire Symfony 4 Framework test suite with running Drupal 8.5.x's suite. I'm running these on a brand new Macbook Pro (2017, 4 CPUs, 16Gb of RAM, using SSDs), using PHP 7.1.4. I purposefully disabled all other non-critical software running on my Mac during the tests, so nothing would slow it down. 

### Symfony 4

I used the following command to run the tests:

<pre><code class="language-bash">
time ./phpunit
</code></pre>

This not only runs the tests, but gets a more accurate measurement of the total amount of time it takes to run them.

Here's PHPUnit's output:

    Time: 2.71 minutes, Memory: 522.25MB
    Tests: 23401, Assertions: 43504, Errors: 13, Failures: 2, Skipped: 2615, Incomplete: 8

Here's the actual time measurement:

    real	2m43.190s
    user	2m2.076s
    sys	    0m17.604s
    
So, running the _entire_ suite takes approximately 2m 43s. I ran these on the latest master-dev, which likely explains the 15 errors, a small thing to fix. There were also 2'615 skipped tests. This is a lot, but negligible when considering there are 23'401 tests total. They mostly concern tests using services that I didn't have running on my Mac when launching the tests (like LDAP, Redis, etc).

Furthermore, generating a coverage report gives us the following statistics:

* **Lines:** 82.60% (44679 / 54089)
* **Functions and Methods:** 71.73% (6172 / 8605)
* **Classes and Traits:** 42.43% (653 / 1539)

The result shows a _very_ valuable test suite:

* It's fast and cheap to run (so much in fact, that it's run on every push on [Travis CI](https://travis-ci.org/symfony/symfony)).
* The coverage is acceptable (80% is considered a good target to aim for). 
* The fact that such a small amount is failing indicates that the test suite is well maintained, probably being refactored with the rest of the project as it evolves.

Now, compare that with Drupal.

### Drupal 8.5

**UPDATE: in my original post, I forgot to run the tests with the `SIMPLETEST_BASE_URL` environment variable, so of course many tests were reported as failing. Stupid&hellip; In my defense, they should have been marked as _skipped_, not _failing_.**

I used the following command to run the tests:

<pre><code class="language-bash">
SIMPLETEST_BASE_URL=http://localhost SIMPLETEST_DB=mysql://drupal:drupal@db/drupal time ./vendor/bin/phpunit -c core/phpunit.xml.dist
</code></pre>

Here's PHPUnit's output:

    Time: 72 minutes, Memory: 772.00MB

So, running the _entire_ suite takes approximately **72m**. Here again, we have many skipped tests, but like before, this can be because of missing services.

_In Drupal's defense, I ran this inside a Docker container, and IO performance is notoriously bad on Docker for Mac. So this number may be much lower for other setups. If you can make tests run as fast as the [drupal.org CI server](https://dispatcher.drupalci.org/job/drupal_patches/), you may need approximately 40 minutes to run the entire suite. I doubt, however, that you can get much lower than that._

Furthermore, generating a coverage report gives us the following statistics:

* **Lines:** 7.12% (16796 / 236041)
* **Functions and Methods:** 15.15% (2454 / 16196)
* **Classes and Traits:** 16.46% (574 / 3488)

This might seem very low, until you consider that &ldquo;functional&rdquo; tests don't allow PHPUnit to compute code coverage. The actual coverage is probably much higher, but the fact is: _we don't know_. 

I see 2 issues with this suite:

1. **The time to run them is _way_ to long.** This breaks developer momentum: they cannot stop and run the tests to see if everything still works. A single error could mean running the tests multiple times, potentially spending _hours_ waiting for results to come back. Of course, one can filter the tests by group, or even class or test method. But this doesn't change the fact that, at some point, the whole suite must be run. And when it takes this long, developers tend to choose the path of least resistance, and skip them altogether, if they can. This has 2 consequences:
    1. Developers tend to _write_ less tests, because they don't have the time to run them.
    2. Developers tend to _refactor_ existing tests less, for the same reason. This means that tests risk becoming obsolete over time.
2. **The test coverage is unknown, and thus confidence drops.** If you cannot reliably compute what your test coverage is, you tend to lose confidence. Of course, coverage metrics are no silver bullet. You could cover 100% of code and not have a single reliable test. But it gives _an idea_ of how well you're doing.

## This is bad

This must be a major hurdle when trying to contribute to the Drupal project (I know it is for me). It's already difficult to get a patch accepted, but the time it tales to simply write a failing test, test your patch, then test (at the very least) the module you worked on, before _finally_ submitting the patch, is already a _huge_ (and not very enjoyable, I might add) endeavour. I fully agree with the fact patches _must_ come with failing regression tests, but admit that submitting a bug fix to the community takes a lot of commitment.

I must admit I felt quite disappointed when seeing these results. Which is why I decided to see how contrib was faring.

## What we can learn from contrib

I decided to check a few popular modules on drupal.org. I'll show the results for [Token](https://www.drupal.org/project/token), being the most installed Drupal 8 module, and [Webform](https://www.drupal.org/project/webform), another one of the most popular modules, which also happens to have an above average level of complexity.

To set up, I used the [Composer template for Drupal projects](https://github.com/drupal-composer/drupal-project):

<pre><code class="language-bash">
composer create-project drupal-composer/drupal-project:8.x-dev run_tests --stability dev --no-interaction
cd run_tests
composer require drupal/token
composer require "drupal/webform:5.0-rc1" # No stable release yet.
# The latest PHPUnit fails if the -c option points to a file inside a folder, for some
# reason. This is a work-around:
cp web/core/phpunit.xml.dist .
sed -i '' 's/tests\//web\/core\/tests\//' phpunit.xml.dist
</code></pre>

The above code will use Drupal 8.4.3. Unfortunately, Drupal introduced a bug which makes Kernel tests incompatible with SQLite, which is what I use when running tests. To correct the issue, I had to apply the following patch:

    diff --git a/core/lib/Drupal/Core/Database/Database.php b/core/lib/Drupal/Core/Database/Database.php
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

### Token

I used the following command to run the tests:

<pre><code class="language-bash">
SIMPLETEST_DB=sqlite://testdb.sqlite ./vendor/bin/phpunit --group token
</code></pre>

Here's PHPUnit's output:

    Time: 1.05 minutes, Memory: 210.00MB
    OK (23 tests, 372 assertions)

Generating a coverage report gives us the following statistics:

* **Lines:** 25.75% (128 / 497)
* **Functions and Methods:** 29.82% (17 / 57)
* **Classes and Traits:** 14.29% (2 / 14)

This seemed very low to me at first, until I decided to look what was exactly covered. The maintainers made the decision to focus their efforts on the actual business logic of the module. Aspects like rendering local tasks, or form elements, are not covered by tests. But I'd argue they don't necessarily _have_ to be: when using an API, like Drupal, you don't want to test the fact the API works as desired. You _might_ want to test your &ldquo;bridge code&rdquo; (in our case, hook implementations and plugin definitions), but usually this adds relatively little value compared to other aspects.

1 minute for running a test suite is still reasonable, although a far cry from the mere seconds it usually takes for similar sized projects in other frameworks. As a comparison, it takes 30s to run the _entire_ test suite for the Laravel framework&hellip; I want to emphasize this is not the maintainers' fault, rather it's a limitation from Drupal's architecture.

Still, this is short enough to encourage running them frequently. Furthermore, all tests pass, which suggests the suite is actively maintained.

I'd also like to note that Token is relying solely on &ldquo;kernel&rdquo; tests. Kernel tests are a great alternative to &ldquo;functional&rdquo; tests, as they provide almost the same level of flexibility, yet run in a fraction of the time, and don't require a fully set up webserver. Furthermore, PHPUnit can compute code coverage using kernel tests, which is another nice plus.

### Webform

I used the following command to run the tests:

<pre><code class="language-bash">
SIMPLETEST_BASE_URL=http://localhost SIMPLETEST_DB=sqlite://testdb.sqlite ./vendor/bin/phpunit --group webform,webform_browser,webform_javascript
</code></pre>

Here's PHPUnit's output:

    Time: 14.25 minutes, Memory: 212.00MB
    Tests: 148, Assertions: 300, Failures: 1, Skipped: 1

_Here again, I ran this inside a Docker container, which has bad IO. Actual numbers may be much lower for other setups._

Generating a coverage report gives us the following statistics:

* **Lines:** 6.45% (1910 / 29603)
* **Functions and Methods:** 10.39% (236 / 2271)
* **Classes and Traits:** 10.19% (37 / 363)

The coverage stats are very low, but just as for Drupal core, part of the tests are functional, meaning the code they cover cannot be computed.

14m 15s for running a test suite is too long (but, again, not using Docker may prove _much_ faster). I'd say anything above 30s will break your momentum when writing code. **However**, the maintainers were smart enough to split their tests into 3 distinct groups. If you only run the _webform_ group, the time drops to 41s (and you don't need a running webserver).

Still, even with 14m 15s for the whole suite, this is short enough to encourage running them relatively frequently. Furthermore, almost all tests pass, suggesting the suite is being maintained.

I'd also like to note that Webform is relying on both unit and kernel tests for the bulk of its tests (142 out of 148), using functional tests where it would be difficult to do otherwise. I think this is the best approach for a Drupal project, favoring fast test types for the bulk of the business logic, and resorting to functional tests to add &ldquo;coverage&rdquo; for UI-related functionality.

## Lessons for the future

I'm pleasantly surprised by the fact that (at least some) contrib is adopting better testing practices. In Drupal 7, a lot&mdash;if not most&mdash;of contrib didn't have tests _at all_. 

If we, as a community, want to provide the best possible code for our clients and projects, investing time in automated tests is not only useful; it's _mandatory_.

I think the number 1 factor we need to strive for is writing tests that are _faster to run_. Only then will developers be encouraged to run suites more frequently, which in turn will lead to them writing more tests. This means looking to projects like Webform for inspiration: 

* Put the bulk of your logic in standalone, Drupal-independent units, which are easily tested by _unit_ tests.
* For logic that _has_ to use the Drupal API (requiring a database), use _kernel_ tests as much as possible.
* Finally, for the few cases where you _have_ to test the interface itself (and _only_ then), rely on functional tests. 

If we strive to achieve this, I reckon our community will only benefit from it.
