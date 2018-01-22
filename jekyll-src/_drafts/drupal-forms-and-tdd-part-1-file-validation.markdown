---
title: "Drupal Forms and TDD, part 1: file validation"
description: "..."
layout: post
favorite: false
tags:
  - Drupal 8
  - Wisdom
  - PHP
---

Traditionally, testing Drupal forms has mainly consisted of leveraging functional tests, in order to test the form through the UI. However, with the revamp of the Forms API to a fully OO paradigm, using unit tests has now become much easier.

Using TDD when writing a form requires is to think a little bit differently about our code, compared to a more traditional approach. In this example, I'll consider a form with 3 particularities :

- a CSV file upload with a custom validation callback
- a field that only appears for users with a certain permission
- a text field with a format validation

Furthermore, upon submission, we will parse the CSV file and create new entities. I'll treat each aspect in a separate post. In this post, we'll look how to get set up, and how to manage a custom file validation callback.

## Setting up

To simplify, we'll use the [Composer template for Drupal project](https://github.com/drupal-composer/drupal-project):

    composer create-project drupal-composer/drupal-project:8.x-dev some-dir --stability dev --no-interaction


We then create a folder for our custom module:

      mkdir web/modules/form_validation

Our module will look like this:

├── form_validation.info.yml
├── form_validation.module
├── form_validation.services.yml
├── src/
│   └── ...
└── tests/
    ├── fixtures/
    │   └── ...
    └── src/
        └── Unit/
            └── ...

Now, whenever we want to run our module's tests, we can call the following:

        ./vendor/bin/phpunit -c web/core/ web/modules/form_validation/tests/

## The form

Our form class looks like this (for now):

# src/Form/BookImportForm.php

namespace Drupal\form_validation\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class BookImportForm extends FormBase {

  /**
   * {@inheritdoc}
   *
   * @codeCoverageIgnore
   */
  public function getFormId() {
    return 'form_validation_import_books';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['csv'] = [
      // We want Drupal to GC the file after we're done. Which is why we go
      // for a managed file.
      '#type' => 'managed_file',
      '#title' => $this->t("List"),
      '#required' => TRUE,
      '#upload_validators' => [
        'file_validate_extensions' => ['csv'],
        'form_validation_validate_csv' => [],
      ],
    ];

    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t("Submit"),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {

  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

}


The first part we want to test is the file validation. We'll check if the file is a valid CSV, where the 2 first columns are mandatory for each row.

We can pass a validator call back to the #validator key. This function will get passed the file to validate, as so:

...code

However, we now run into a problem: the validator should return localized error messages. In procedural Drupal programming, we must use t() for that. Unfortunately, we cannot use t() in unit tests, which would mean we have to use a kernel test. But we want to use unit tests. The trick is to convert our validation callback to a _service_:

... code

Now, we simply proxy the validation method, and preston: a OOP validation class. We can now create a stub test class, like so:

... code

We'll create 3 test files, one with an incorrect separator (we only support commas), one with incorrect data in its columns, and one that is correct:

... code

Let's create a generator for PHPunit:

... code

Now, we can write our test:

.... code (strings instead of t())

And run it:

... code

It will obviously fail, as our validator class has no logic yet. Let's add all the logic at once:

... code

It still fails... this is because we need to mock our translation service. Luckily, this is easily done like so:

... code

And run the tests again:

... code

Nope, still not. The reason is
