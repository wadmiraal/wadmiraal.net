---
title: "Why TDD in Drupal 8 matters"
description: "Applying TDD principles to Drupal 8 development can be cumbersome, not just because of the time it takes to run tests, but also because of the required infrastructure. And yet, I believe it is crucial for us as a community to shift towards adopting true TDD principles."
layout: post
favorite: false
tags:
  - Drupal 8
  - Automated Testing
  - Rant
  - PHP
---

Writing unit tests in Drupal used to be excruciatingly slow and costly, which meant many projects stayed away from them. Luckily, with the coming of Drupal 8 and the introduction of better testing practices, the situation has improved a lot. However, using <abbr title="Test Driven Development">TDD</abbr> in a Drupal project is still very difficult.

The main difficulty comes from the fact that TDD practices rely on a _very_ quick feedback loop. You write a test, you run it, red flag, you write code, you run the test again, green flag. Rinse and repeat. When the running part takes _minutes_, it slows the process down so much, that you lose all the benefits. It's hard to keep concentrating on your code when you wait idly for the test to complete.
 
I am personally a big fan of TDD, and find it greatly improves the code I write. In my personal experience, I find that projects using TDD not only have much higher test coverage than projects that do not, the tests are usually also more &ldquo;complete&rdquo;, covering more edge-cases and possible scenarios.

In any case, whether you want to apply TDD in your Drupal development workflow, or simply want to increase the amount of tests you write, the effort you'll be willing to invest in writing tests is inversely proportional to the amount of time it takes to run them.

## Finding good working examples is hard

Googling around for &ldquo;TDD Drupal 8&rdquo; will return many articles and talks, but almost all of them focus on writing _functional_ tests.

**Functional tests are no way to apply TDD principles!**

To illustrate, let's take the following 3 test classes:

<pre><code class="language-php">
# tests/src/Unit/MyUnitTest.php
&lt;?php

namespace Drupal\my_module\Tests\Unit;

use Drupal\Tests\UnitTestCase;

class MyUnitTest extends UnitTestCase {
  
  public function testMe() {
    $this->assertTrue(true, "It works");
  }

}

# tests/src/Kernel/MyKernelTest.php
&lt;?php

namespace Drupal\my_module\Tests\Kernel;

use Drupal\KernelTests\KernelTestBase;

class MyKernelTest extends KernelTestBase {
  
  public function testMe() {
    $this->assertTrue(true, "It works");
  }

}

# tests/src/Functional/MyFunctionalTest.php
&lt;?php

namespace Drupal\my_module\Tests\Functional;

use Drupal\Tests\BrowserTestBase;

class MyFunctionalTest extends BrowserTestBase {
  
  public function testMe() {
    $this->assertTrue(true, "It works");
  }

}
</code></pre>

As you can see, they all do nothing. I just want to demonstrate the _startup_ time for each type of test.

Now, we run them, separately (I'm on a brand new 2017 Macbook Pro, 4 CPUs, 16Gb of RAM, using PHP 7.1.4):

<pre><code class="language-bash">
# Unit tests can be run without any special environment 
# settings.
./vendor/bin/phpunit web/modules/my_module/tests/src/Unit/

# I use SQLite for the Kernel tests.
SIMPLETEST_DB=sqlite://testdb.sqlite ./vendor/bin/phpunit web/modules/my_module/tests/src/Kernel/

# Here I use MAMP for the functional tests, as it is 
# faster than using Docker. In my typical workflow, 
# I prefer using Docker, but the I/O is terrible. 
# Test times are almost twice as long compared to MAMP
# (using Docker for Mac), so for more accurate and 
# realistic results, I'll stick to MAMP in this example.
SIMPLETEST_BASE_URL=http://localhost:8888 SIMPLETEST_DB=mysql://root:root@127.0.0.1:8889/testdb ./vendor/bin/phpunit web/modules/my_module/tests/src/Functional/
</code></pre>

The results are as follows:

* 412 ms for the unit test
* 1.13 seconds for the kernel test
* 9.96 seconds for the functional test

_Side note: although startup times in unit tests are pretty constant, they can vary greatly in kernel and functional tests depending on what needs to be set up, so take these low figures with a grain of salt; they could be much higher._

Remember, this is mainly counting the startup time. So, functional test, without doing anything, takes ~10x longer than kernel tests, and ~24x times longer than unit tests.

Now, let's add 4 more test methods to each test class, again, not testing anything:

<pre><code class="language-php">
  public function testMe2() {
    $this->assertTrue(true, "It works");
  }
  
  public function testMe3() {
    $this->assertTrue(true, "It works");
  }
  
  public function testMe4() {
    $this->assertTrue(true, "It works");
  }
  
  public function testMe5() {
    $this->assertTrue(true, "It works");
  }
</code></pre>

And run the tests again. This time, the results are as follows:

* 452ms for the unit test
* 4.19 seconds for the kernel test
* 49.31 seconds for the functional test

You see where I'm going with this. If you want any reasonable amount of test coverage _and_ run those tests frequently, functional tests are a no-go. Just 5 test methods already take close to 1 minute, and it's not even testing anything yet! For me, any test suite that takes longer than 30s is too long for TDD (and that's _already_ very long, IMHO&mdash;just try it: sit still for 30s staring at your terminal; now imagine doing that every 2 to 5 minutes). I cannot conceive that all those bloggers giving TDD examples using functional tests are actually practicing what they preach. It's no way to do true TDD. Of course, these examples are not _bad_, per-se. Just don't go claiming it's the way to do TDD, discouraging newcomers from adopting the practice.

## TDD is all about speed

If tests take too long to run, why bother writing them? It's costly, and hard to justify towards a client or employer. Which is probably why many projects have little test coverage, or sometimes none at all.

If you want to apply TDD in Drupal, the only way is to use unit tests for the bulk of the tests, switch to kernel tests when mocking the Drupal API becomes too complex, and use a few functional tests to make sure the UI works as designed.

## TDD makes so much sense in Drupal 8

The reason why I think TDD makes a lot of sense in Drupal (much more, in fact, than in other frameworks), is that writing tests _after_ the code is written will almost always push you towards using functional tests. It's _very_ hard to write kernel tests for _existing_ code, and writing unit tests is almost impossible.

Writing the tests _before_ forces you to think differently about your code. This is _hard_, and goes against the grain for us Drupal developers. The reason, I think, is that we're so used to working _with_ the Drupal API, whereas writing unit-testable code would require us working _around_ it.

In some [previous posts](/lore/2014/07/22/write-testable-code-in-drupal-part-1/), I explored the usage of functional programming principles to be able to write unit tests in Drupal 7. The main idea was to write functions that didn't depend on Drupal at all. These would then be used in hooks or form callbacks, &ldquo;gluing&rdquo; our code with the Drupal API. It might feel a bit awkward at first, but it's the best way to be able to use unit tests, because we decouple our code from Drupal. Because Drupal is the main reason our tests run so slowly.

I'm not saying that's the way to go. We all have different ways of thinking about our code. Some don't even think TDD is viable in the long run. But I think we all can agree on one thing:

_Writing more tests is mandatory._

So, let's at least give it a try.

