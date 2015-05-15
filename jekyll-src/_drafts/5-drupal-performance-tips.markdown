---
title: "4 quick Drupal tips"
description: "A quick post about 4 common Drupal pitfalls or sub-optimal design decisions we can avoid."
layout: post
tags:
  - Drupal
  - PHP
  - Wisdom
---

This is just a quick post. It's frustrating to me to see these small, yet simply avoidable, errors and/or mistakes so often in code. True, I see this less and less in contributed modules (good thing). The Drupal community does a pretty good job of educating its members, especially its contributors. And, also true: some of *my* older modules still fall into this category (*ahem*, [PHPExcel]())\*.

The following are a few &ldquo;mistakes&rdquo; that won't have a big impact on your code. It's also not about writing code that works; it's mainly about writing &ldquo;excellent&rdquo; code (if at all possible in PHP). If we as developers implement these small, simple tips, we can make our code cleaner, more performant (at a very small scale, of course) and more encapsulated.

\**Note: this is the main reason I started [Herald](). It doesn't catch all the points below yet, but I sure want it to get there. Go check it out, or [read about it here]().*

## 1. Loading static assets

A module might define a CSS file and a JS file, containing all the client-side logic.

It is not uncommon to see a module use the following lines:

<pre><code class="language-php">
drupal_add_css(drupal_get_path('module', 'my_module') . '/css/my_module.css');
drupal_add_js(drupal_get_path('module', 'my_module') . '/js/my_module.js');

</code></pre>

This is &ldquo;bad&rdquo;, because we violate the <abbr title="Don't Repeat Yourself">DRY</abbr> principle. First and foremost, Drupal does not cache the result of `drupal_get_path()`. Meaning, we have some (tiny, but still) overhead by calling it twice (or sometimes more). It's much better to use this:

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

1. We violate the DRY principle.
2. Although it does not have a *big* performance impact if several of these functions are invoked on the same page&thinsp;&mdash;&thinsp;which will happen, for instance, when a form is both displayed on the page and inside a block&thinsp;&mdash;&thinsp;it is still sloppy.

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

## 2. Too much code in the `.module` file

This is a tricky one to get right, and I catch myself more often than not getting this one &ldquo;wrong&rdquo;.

Many modules put *a lot* of code in the `.module` file. Much of the code *should* probably live in there (most hook declarations, for example). But, for many modules, a lot of the logic is only executed on specific pages, or when specific events occur. Maybe these pages are only used by administrators, or the event only happens once a day. However, *all* `.module` files are loaded for *every* page request. If the file is thousands of lines long, most of it only used on several pages, it's worth it to split it in smaller files.

One popular pattern in the Drupal community is to have specific files:

* `[my_module].admin.inc`: administration logic, settings, configuration forms
* `[my_module].pages.inc`: page callbacks, module forms

Some modules allow you to put their hook implementations in specific files (this does not work for all modules exposing an API, though&thinsp;&mdash;&thinsp;see [hook_hook_info](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_hook_info/7)). For example:

* `[my_module].rules.inc`: contains the [Rules](https://www.drupal.org/project/rules) hooks.
* `[my_module].views.inc`: contains the [Views](https://www.drupal.org/project/views) hooks.
* `[my_module].token.inc`: contains the [Token](https://www.drupal.org/project/token) hooks.

Another huge benefit is that it makes your code easier to scan through. If you follow this pattern, other developers will immediately know where to look for certain information.

## 3. `require_once` at the top of the `.module` file

This one makes me cringe, every time I see it. It's the same as 2, but even worse. What code is so important that you need to include it for every page request? Why doesn't that include happen inside a function, so you only load the code when it is *actually useful*? If the code included is a class, you can use Drupal 7's (very crude) [autoloader logic](), which is far more flexible. If it is a menu callback, why don't you use the *file* directive in your [`hook_menu()`]() implementation? 

## 4. Remove those variables on uninstall

If your module has a configuration form that sets variables ([`variable_set()`](), or using [`system_settings_form()`]()), these are not removed when your module is uninstalled. Drupal does not know which variables belong to what module. It's up to you to actually remove them.

This is pretty easy. You can simply implement [`hook_uninstall()`](), which you put inside your module's `.install` file, and call [`variable_del()`]() on each of the variables you define:

<pre><code class="language-php">
/**
 * Implements hook_uninstall().
 */
function mymodule_uninstall() {
  variable_del('mymodule_setting_1');
  variable_del('mymodule_setting_2');
  variable_del('mymodule_setting_3');
}
</code></pre>

This will remove lingering variables. It is a good practice, as the `variables` database table can get quite large. Because this entire table's data is loaded *for every page request*, it is critical to keep it as small as possible, and not pollute it with data from module's that are not even used anymore.




