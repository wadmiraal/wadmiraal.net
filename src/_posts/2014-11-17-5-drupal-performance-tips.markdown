---
title: "5 Drupal Performance Tips"
description: "A quick post about 5 common Drupal pitfalls or bad design decisions you could avoid."
layout: post
tags:
  - Drupal
  - Code
  - Wisdom
---

This is just a quick post. I just got to get this out. It's frustrating to me to see these small, yet simply avoidable, errors and/or mistakes so often in module code, and even more in Drupal projects. True, I see this less and less in contributed modules (good thing). The Drupal community does a pretty good job of educating its members, especially its contributors.

The following are a few &ldquo;mistakes&rdquo; that won't have a big impact on your code. It's no more about writing code that works; it's mainly about writing &ldquo;excellent&rdquo; code (if at all possible with PHP/Drupal). If we as developers implement these small, simple tips, we can make our code cleaner, more performant (at a very small scale, of course) and more encapsulated.

## 1. Loading Static Assets

A module might define a CSS file and a JS file, containing all the client-side logic.

It is not uncommon to see a module use the following lines:

<pre><code class="language-php">
drupal_add_css(drupal_get_path('module', 'my_module') . '/css/my_module.css');
drupal_add_js(drupal_get_path('module', 'my_module') . '/js/my_module.js');

</code></pre>

This is *bad*, because we violate the <abbr title="Don't Repeat Yourself">DRY</abbr> principle. First and foremost, Drupal does not cache the result of `drupal_get_path()`. Meaning, we have some (tiny, but still) overhead by calling it twice (or sometimes more). It's much better to use this:

<pre><code class="language-php">
$path = drupal_get_path('module', 'my_module');
drupal_add_css($path . '/css/my_module.css');
drupal_add_js($path . '/js/my_module.js');

</code></pre>

As an added bonus, it is more readable. But, we still have a problem if we call these lines in many places:

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

// ... still many lines further ...
// In function 3.
$path = drupal_get_path('module', 'my_module');
drupal_add_css($path . '/css/my_module.css');
drupal_add_js($path . '/js/my_module.js');

</code></pre>

There are 2 problems with this:

1. If we want to add a new asset every single time, or change the file name, or any other change, we must do so in different places; we violate the DRY principle.
2. Although it does not have a *big* performance impact if several of these functions are invoked on the same page&thinsp;&mdash;&thinsp;which will happen, for instance, when a form is both displayed on the page and inside a block&thinsp;&mdash;&thinsp;it is still sloppy, and again violating our DRY principle.

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

// ... still many lines further ...
// In function 3.
my_module_add_assets();

</code></pre>

This is DRY in action. We remove the duplication (of both logic and processing) by refactoring it in a simple function. Calling this function twice will not add any overhead, as it knows the static assets have already been added.

## 2. Too Much Code In The Module File

This is a tricky one to get right, and I catch myself more often than not getting this one &ldquo;wrong&rdquo;.

Many modules put *a lot* of code in the `.module` file. Much of the code *should* probably live in there (most hook declarations, for example). But, for many modules, a lot of the logic is only executed on specific pages, or when specific events occur. Maybe these pages are only used by admins, or the event only happens once a day. However, *all* `.module` files are loaded for *every* page request. If the file is thousands of lines long, most of it only used on several pages, it's worth it to split it in smaller files.

One popular pattern in the Drupal community is to have specific files:

* ``[my module name].admin.inc``: administration logic, settings, configuration forms
* ``[my module name].pages.inc``: page callbacks, module forms

Some modules allow you to put their hook implementations in specific files. For example (this does not work for all modules exposing an API, though&thinsp;&mdash;&thinsp;see [hook_hook_info](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_hook_info/7)):

* ``[my module name].rules.inc``: contains the [Rules](https://www.drupal.org/project/rules) API implementation
* ``[my module name].views.inc``: contains the [Views](https://www.drupal.org/project/views) API implementation
* ``[my module name].token.inc``: contains the [Token](https://www.drupal.org/project/token) API implementation

Another huge benefit is that it makes your code easier to scan through. If you follow this pattern, other developers will immediately know where to look for certain information.

## 3. `require_once` At Top Of Module File

## 4. Unclear Page State Dependency

## 5. Remove Those Variables On Uninstall