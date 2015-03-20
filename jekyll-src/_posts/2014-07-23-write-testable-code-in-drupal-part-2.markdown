---
title: "Write testable code in Drupal - part 2, purity is the answer"
description: "Writing unit tests in Drupal is slow and complex, which means many projects stay away from unit tests. This is the second part in a series to write better, more testable code."
layout: post
favorite: false
tags:
  - Drupal
  - Wisdom
  - PHP
---

In [part 1](/lore/2014/07/22/write-testable-code-in-drupal-part-1/), I discussed what was wrong with classical Drupal unit tests. In part 2, I want to discuss how we can learn from functional programming languages like Haskell to write better, more testable Drupal code.

## What Is So Cool About Functional Programming

[Functional programming](http://en.wikipedia.org/wiki/Functional_programming) is a programming paradigm just like [procedural programming](http://en.wikipedia.org/wiki/Procedural_programming) (which is what we use most of the time in Drupal) and [object-oriented programming](http://en.wikipedia.org/wiki/Object-oriented_programming) (which is what we'll be using more in Drupal 8).

I won't go into details about functional programming, but most (if not all) functional programming languages have a &ldquo;concept&rdquo;, or even &ldquo;feature&rdquo;, that is totally awesome: *function purity*.

## Pure VS Impure

In functional programming languages like Haskell, a function can either be *pure* or *impure*. You don't even *declare* a pure function in the same way you declare an impure function; their syntax is different, which makes them instantly recognizable.

A pure function can have *no side effects*. This means it cannot alter the state of the system, nor depend on it. For instance, a pure function cannot perform database queries, nor read the contents of a file. It cannot change global variables, nor read them. In cannot get passed a parameter by reference. It can only return a value.

An impure function can do all of the above and more. Actually, you could say that +95% of Drupal code is composed of *impure* functions.

This has another extremely important and interesting side-effect:

1. a pure function can call other pure function, **but can never call an impure function**.
2. an impure function can call any function.

If a pure function tries to call an impure function, the compiler will complain about it. It is just not possible. If a pure function wants to call an impure function (this cascades down the entire call stack), you have to redeclare it as being impure.

## Why Purity Is A Powerful Concept

Function purity has many advantages, but to name a few:

1. The result is only dependent on the parameters passed. Call the function twice with the same parameters, you will always get the same result.
2. The above means pure functions are very easy to write tests for.
3. Pure functions tend to be small&thinsp;&mdash;&thinsp;as they cannot alter or access the state of the machine, nor call other functions that do so, functions tend to be highly specific and short. This makes many functions more easy to scan through and understand.
4. Compilers can easily optimize code by caching results, as calling the function several times with the same parameters will always result in the same output.

Point 2 and 3 are what interest us in our PHP/Drupal world.

When writing modules, we interact with the system; we access its state and alter it. This is normal, and is what makes our module useful.

However, we (almost) always have to do some computation&thinsp;&mdash;&thinsp;alter data, parse a string, validate input, etc. And often, it is at these computation points that we introduce bugs. And it's these that we want to test most often.

But, as we mentioned in part 1, because we want to use the Drupal framework, we often tie ourselves to having to use the global state. And thus, we need to write *DrupalWebTestCases*, which, as we mentioned in part 1, are horridly slow and make TDD unfeasible.

However, when we write tests, we often test more than we should. We often test the Drupal API itself.

## Test Less & Applying Purity To Drupal

For example, imagine our module declares a custom field. Say, a text field that accepts a Markdown-formatted link.

We probably want to have a validation on this field. If a user inserts invalid Markdown, we want to block the form submission and put up an error. Probably you put this validation code, which is pretty small (one regular expression), directly in the validation callback, like so:

<pre><code class="language-php">
/**
 * Implements hook_widget_validate().
 */
function my_module_widget_validate($element, &$form_state) {
  if (!preg_match('/some crazy regex/', $element['#value'])) {
    form_error($element, "Please provide a correctly formatted link.");
  }
}

</code></pre>

How would you test this ?

There's a fat chance many go through this process:

1. Declare a new test.
2. In the test, create a new user with admin rights.
3. Log the user in.
4. Go to the &ldquo;Add new content type&rdquo; form.
5. Create a new content type.
6. Go to the content type &ldquo;Fields&rdquo; tab.
7. Add a new field for our custom field type. Skip the settings by just clicking &ldquo;Next&rdquo;.
8. Go to the &ldquo;Add new content&rdquo; page for our new content type.
9. Submit the form several times with invalid data, asserting each time that our error message is present on the page. **This is where we actually start testing**.
10. Submit the form with correct data.
11. Assert there's no warning on the page.

That's an awful lot of code to write. And you know what 99% of this code is testing ?

1. It tests that the Field API correctly exposes our custom field.
2. It tests that the Drupal paths and permissions function correctly.
3. It tests Drupal's Form API.

Only a tiny fraction of the test actually covers our validation function.

How can we simplify this ?

Well, first, because we use an API (which never breaks backward compatibility, as long as you use the same major version), we can safely assume our hook implementations will work. If we don't mess with them, they will simply function.

So the whole shebang of setting up our field is overkill. It's nice to have (like when changing your hook implementation, checking you're still doing it right), but it's not a test you need or want to run often.

What you *are* interested in, is your form validation. And this is how you can very easily solve it:

<pre><code class="language-php">
/**
 * Implements hook_widget_validate().
 */
function my_module_widget_validate($element, &$form_state) {
  if (!_my_module_validate_link_format($elements['#value'])) {
    form_error($element, "Please provide a correctly formatted link.");
  }
}

/**
 * Validation callback.
 */
function _my_module_validate_link_format($value) {
  return preg_match('/some crazy regex/', $value);
}

</code></pre>

This is function purity in action.

Our validation function does not depend on the state of the system. It does not call any Drupal functions (like `form_error()`, which is *impure*) and thus we can safely call it from any context. It is *pure*.

Our widget validation hook is *impure*, because it calls `form_error()`. However, as we stated above, impure functions *can call* pure functions. Which is exactly what we did here.

Now, you can write a *DrupalUnitTestCase*, which does the following:

1. Declare a new test.
2. Loop over a list of incorrectly formatted strings, passing them to `_my_module_validate_link_format`. Assert each call returns `false`.
3. Loop over a list of correctly formatted strings, passing them to `_my_module_validate_link_format`. Assert each call returns `true`.

You could even write this test using PHPUnit, but even with a *DrupalUnitTestCase*, this will run in *seconds*, **much** faster than any *DrupalWebTestCase* would run.

Note the power of what we did here. If our tests for `_my_module_validate_link_format` pass, it means `my_module_widget_validate` **will always work**. By testing the first, we also test the latter. However, we test at a tiny fraction of the cost in time and energy.

## Conclusion

We explored a very simple example here, but hopefully you already see the incredible power of using this very simple approach.

Of course, you will not always be able to escape the use of *DrupalWebTestCases*. Sometimes you just *have* to test your code against the entire Drupal stack. However, by splitting the complexity into smaller chunks, we can probably use a TDD approach for at least part of our module, and greatly speed up writing and running tests.

In part 3, I'll explore some more complex, real-world examples, like testing your own API (by exposing your own hooks) and using database results.
