---
title: "Drupal 8 Forms and TDD, part 3: form validation"
description: "In this series of posts, I'll demonstrate how you can write forms in Drupal while using true TDD. In this third part, we'll talk about testing how the form is validated."
layout: post
favorite: false
tags:
  - Drupal 8
  - Wisdom
  - PHP
---

In [part 1](/lore/2018/01/29/drupal-forms-and-tdd-part-1-file-validation/), I showed how you can start using <abbr title="Test Driven Development">TDD</abbr> when writing Drupal code, and how to apply it to testing a custom file validation callback. In [part 2](/lore/2018/02/05/drupal-forms-and-tdd-part-2-form-building/), we tackled testing the form building. In this part, I'll show how you can test the form validation.

<iframe src="https://www.youtube.com/embed/yLpNHiTVlhY" width="700" height="394" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

I also decided to shoot a quick bonus video with a functional test, to demonstrate the difference in time execution. Food for thought: in our particular example, the functional tests take **~300x** longer than the unit tests, without adding any more value. As I mention towards the end, you could probably get that down to &ldquo;only&rdquo; 60x times longer, at the cost of maintainability.

<iframe src="https://www.youtube.com/embed/Mze8aLFecp0" width="700" height="394" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Links

* [Part 1](/lore/2018/01/29/drupal-forms-and-tdd-part-1-file-validation/).
* [Part 2](/lore/2018/02/05/drupal-forms-and-tdd-part-2-form-building/).
* The [source code](https://github.com/wadmiraal/drupal8_tdd_form_validation) for the example.
* The [Composer template for Drupal project](https://github.com/drupal-composer/drupal-project) used for the project structure.
* The [official documentation for writing automated tests in Drupal 8](https://api.drupal.org/api/drupal/core%21core.api.php/group/testing/8.5.x).
