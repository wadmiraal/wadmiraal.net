---
title: "Drupal 8 TDD: It Is Possible"
description: "Applying TDD principles to Drupal 8 development can be cumbersome, not just because of the time it takes to run tests, but also because of the way they are configured by default. In this post, I'll show how to make your module tests run faster."
layout: post
favorite: false
tags:
  - Drupal 8
  - Wisdom
  - PHP
  - TDD
---

Writing unit tests in Drupal used to be excruciatingly slow and costly, which meant many projects stayed away from them. Luckily, with the coming of Drupal 8 and the introduction of better testing practices, the situation has improved a lot. However, using <abbr title="Test Driven Development">TDD</abbr> in a Drupal project is still pretty difficult.

The main difficulty comes from the fact that TDD practices rely on a _very_ quick feedback loop. You write a test, you run it, you refactor. Rinse and repeat. When the running part takes _minutes_, it slows the process down so much, that you lose all the benefits. It's hard to keep concentrating on your code when you wait idly for the test to complete. 
 
I am personally a big fan of TDD, and found it greatly improves the code I write. In my personal experience, I find that projects using TDD not only have a much higher test coverage than projects that do not, the tests are usually also more &ldquo:complete&rdquo;, covering more edge-cases and possible scenarios.

In any case, whether you want to apply TDD in your Drupal development workflow, or simply want to increase the amount of tests you write, the effort you'll be willing to invest in writing tests is inversely proportional to the time it takes to run them &emdash; or to get set up. Which is what I'll discuss in this post.
