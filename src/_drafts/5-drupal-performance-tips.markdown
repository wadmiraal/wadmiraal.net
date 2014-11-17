---
title: "5 Drupal Tips"
description: "A quick post about 5 common Drupal pitfalls or bad design decisions you could avoid."
layout: post
tags:
  - Drupal
  - Code
  - Wisdom
---

This is just a quick post. I just got to get this out. It's frustrating to me to see these small, yet simply avoidable, errors and/or mistakes so often in module code, and even more in Drupal projects. True, I see this less and less in contributed modules (good thing). The Drupal community does a pretty good job of educating its members, especially its contributors.

The following are a few &ldquo;mistakes&rdquo; that won't have a big impact on your code. It's no more about writing code that works; it's mainly about writing &ldquo;excellent&rdquo; code (if at all possible with PHP/Drupal). If we as developers implement these small, simple tips, we can make our code cleaner, more performant (at a very small scale, of course) and more encapsulated.

## 1. Loading Assets

This is very common. A module might define a CSS file and a JS file, containing all the client-side logic.

It is not uncommon to see a module use the following lines, *in different functions*:

<pre><code class="language-php">
drupal_add_css(drupal_get_path('module', 'my_module') . '/css/my_module.css');
drupal_add_js(drupal_get_path('module', 'my_module') . '/js/my_module.js');

</code></pre>

This is *bad*, because we violate the <abbr title="Don't Repeat Yourself">DRY</abbr> principle.

First and foremost, Drupal *does not cache the result of `drupal_get_path()`.*. Meaning, we have some (tiny, but still) overhead by calling it twice (or sometimes more). It's much better to use this:

<pre><code class="language-php">
$path = drupal_get_path('module', 'my_module');
drupal_add_css($path . '/css/my_module.css');
drupal_add_js($path . '/js/my_module.js');

</code></pre>

As an added bonus, it is more readable. But, we still have a problem if we call these lines in several places:

<pre><code class="language-php">
// In function 1.
$path = drupal_get_path('module', 'my_module');
drupal_add_css($path . '/css/my_module.css');
drupal_add_js($path . '/js/my_module.js');

// ... many lines further ...
// In function 2.
$path = drupal_get_path('module', 'my_module');
drupal_add_css($path . '/css/my_module.css');
drupal_add_js($path . '/js/my_module.js');

</code></pre>

Although it does not have a *big* performance impact if both functions are invoked on the same page&thinsp;&mdash;&thinsp;which will happen, for instance, when a form (say, a search form) is both displayed on the page and inside a block&thinsp;&mdash;&thinsp;, it is still sloppy, and again violating our DRY principle.

A better approach may be this:

<pre><code class="language-php">
function my_module_add_assets() {
  static $added = FALSE;

  if (!$added) {
    $path = drupal_get_path('module', 'my_module');
    drupal_add_css($path . '/css/my_module.css');
    drupal_add_js($path . '/js/my_module.js');

    $added = TRUE;
  }
}

// In function 1.
my_module_add_assets();

// ... many lines further ...
// In function 2.
my_module_add_assets();

</code></pre>

This is DRY in action. We remove the duplication (of both logic and processing) by refactoring it in a simple function. Calling this function twice will not add any overhead, as it knows the static assets have already been added.

## 3. Too Much Code In The Module File

## 4. Unclear Page State Dependency ? Require_once at top of Module file ?

## 5. Remove Those Variables On Uninstall