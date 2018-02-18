---
title: "Drupal 8 Forms and TDD, part 1: file validation"
description: "In this series of posts, I'll demonstrate how you can write forms in Drupal while using true TDD. In this first part, we'll talk about file upload validation."
layout: post
favorite: false
tags:
  - Drupal 8
  - Automated Testing
  - Wisdom
  - PHP
---

Traditionally, testing Drupal forms has mainly consisted of testing the form through the UI using functional tests. However, with the revamp of the Forms API to a fully <abbr title="Object Oriented">OO</abbr> paradigm, using unit tests has now become much easier.

Using TDD when writing a form requires us to think a little bit differently about our code, compared to a more traditional approach. In this example, I'll consider a form with 3 particularities :

- a CSV file upload with a custom validation callback
- a field that only appears for users with a certain permission
- a text field with a format validation

Furthermore, upon submission, we will parse the CSV file and create new entities. I'll treat this as a series of posts. In this first post, we'll look how to get set up, and how to use TDD when writing a custom file validation callback.

<iframe width="700" height="394" src="https://www.youtube.com/embed/iK15gqkV9oc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Links

* [Part 2](/lore/2018/02/05/drupal-forms-and-tdd-part-2-form-building/).
* [Part 3](/lore/2018/02/12/drupal-forms-and-tdd-part-3-form-validation/).
* [Part 4](/lore/2018/02/19/drupal-forms-and-tdd-part-4-form-submission/).
* The [source code](https://github.com/wadmiraal/drupal8_tdd_form_validation) for the example.
* The [Composer template for Drupal project](https://github.com/drupal-composer/drupal-project) used for the project structure.
* The [official documentation for writing automated tests in Drupal 8](https://api.drupal.org/api/drupal/core%21core.api.php/group/testing/8.5.x).
