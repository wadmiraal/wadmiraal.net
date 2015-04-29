---
title: "Content Type Strategies: defining content types in code"
description: "Creating and maintaining content types in Drupal can be a challenge and get overwhelming. Here are a few tips to define them using code."
layout: post
tags:
- Wisdom
- Drupal
---

If [creating content types can sometimes be a hassle](/lore/2015/04/08/content-type-strategies-part-1-planning/), maintaining them is even worse. Updating fields is tricky, as it will affect existing content. Versioning these changes is virtually impossible if created through the UI. Furthermore, because Drupal keeps content type configuration in the database, it is hard to reproduce in development or staging environments, and usually involves dumping the whole production database and importing it back again on staging or dev.

The good news is, in Drupal 8, with the [CMI](http://drupal8cmi.org/ "Configuration Management Initiative"), we won't have to worry about this as much; configuration will finally be shippable as plain YAML files, which can be imported and versioned in our CVS. The bad news is, many projects will continue to use D7 for probably *at least* another year, as it will take time for contrib to catch up with D8.

So, here's a guide to maintaining content types in code, for Drupal 7.

## A quick note about Features

If you don't know [Features](https://www.drupal.org/project/features), it is a module that allows you to export your Drupal site configuration to a Drupal module. You can then download this module, and simply enable it on another site. It is very powerful, and enables us to maintain our content types in code, while also managing updates and versioning. The only drawback is that the exported module requires Features as a dependency, also on the sites on which you wish to &ldquo;install&rdquo; the configuration.

If you have never tried it out, give it a spin. It's very powerful, and the preferred method for many [Drupal distributions](https://www.drupal.org/project/project_distribution) to ship default configuration out of the box (we used it extensively when I was still on the [Opigno](https://www.drupal.org/project/opigno_lms) team).

However, in this post I will focus on the Drupal-only solution, using the APIs provided by core.

## Getting started

*Tip: you can use [my Docker image](/lore/2015/03/27/use-docker-to-kickstart-your-drupal-development/) to try the following on a clean development environment.*

I prefer having one module per content type, as it keeps things clearer. But you can manage multiple content types in one module.

Create a new module structure. We will mainly need:

* an `.info` file
* a `.module` file
* an `.install` file
* an `includes/` directory, with a file called `mymodule.node_types.inc` in it

I'll take it you know how to write [an `.info` file](https://www.drupal.org/node/542202).

The `.module` file will be empty, except for these hook implementations:

<pre><code class="language-php">
&lt;?php

/**
 * @file
 * Module hooks.
 */

/**
 * Implements hook_node_info().
 */
function mymodule_node_info() {
  return array(
    'mymodule_page' => array(
      'name' => t("Special page"),
      'base' => 'mymodule',
      'description' => t("A description for the content type."),
      'has_title' => TRUE,
      'title_label' => t("Title"),
      'locked' => TRUE,
    ),
  );
}

/**
 * Implements hook_node_type_insert().
 */
function mymodule_node_type_insert($content_type) {
  if ($content_type->type == 'mymodule_page') {
    module_load_include('inc', 'mymodule', 'includes/mymodule.node_types');
    _mymodule_node_type_insert($content_type);
  }
}

/**
 * Implements hook_form().
 */
function mymodule_form($node, $form_state) {
  return node_content_form($node, $form_state);
}

</code></pre>

Let me go over them in detail:

<pre><code class="language-php">
/**
 * Implements hook_node_info().
 */
function mymodule_node_info() {
  return array(
    'mymodule_page' => array(
      'name' => t("Special page"),
      'base' => 'mymodule',
      'description' => t("A description for the content type."),
      'has_title' => TRUE,
      'title_label' => t("Title"),
      'locked' => TRUE,
    ),
  );
}
</code></pre>

This implements [`hook_node_info()`](https://api.drupal.org/api/drupal/modules%21node%21node.api.php/function/hook_node_info/7), which allows us to define custom content types and register them with Drupal. It is considered a good practice to prefix the content type machine name with the module name. The content type machine name is given by the array key. Notice the title property is optional (but recommended). We also set the content type to &ldquo;locked&rdquo;. This will prevent admins from changing the machine name through the UI.

The *base* key is an interesting one. If you define only one content type per module, you should probably use the module name here. But if you define multiple content types, you should use the content type machine name. The reason is, this *base* key is used to create some [Node API hooks](https://api.drupal.org/api/drupal/modules%21node%21node.api.php/group/node_api_hooks/7). These special *node-type-specific* hooks can only be implemented by one module: the module that defined the content type. They are similar to `hook_node_load()`, `hook_node_view()`, etc, but instead are called `hook_load()`, `hook_view()`, etc, and are run *before* all the others. The difference is, the `hook_` part is *not* the module name, but the *base* key. So, if my *base* key was `mymodule_page` instead of `mymodule`, I could implement the following hooks:

<pre><code class="language-php">
function mymodule_page_load() {
  // Do something.
}

function mymodule_page_view() {
  // Do something.
}
</code></pre>

This is ideal in situations where you have multiple content types, as it saves you the trouble from using `if/else` or `switch` statements. Very handy.

<pre><code class="language-php">
/**
 * Implements hook_node_type_insert().
 */
function mymodule_node_type_insert($content_type) {
  if ($content_type->type == 'mymodule_page') {
    module_load_include('inc', 'mymodule', 'includes/mymodule.node_types');
    _mymodule_node_type_insert($content_type);
  }
}
</code></pre>

This implements [`hook_node_type_insert()`](https://api.drupal.org/api/drupal/modules%21node%21node.api.php/function/hook_node_type_insert/7), and is called every time a new content type is registered with Drupal. We use this to add more fields to our content type. This logic is defined in `includes/mymodule.node_types.inc`. It is a good practice to separate this kind of logic in a different file, as it is usually only called once. If it were defined inside the `.module` file, it would get loaded on *every single page*, which is completely unnecessary.

We will see what is inside this `includes/mymodule.node_types.inc` file later.

<pre><code class="language-php">
/**
 * Implements hook_form().
 */
function mymodule_form($node, $form_state) {
  return node_content_form($node, $form_state);
}
</code></pre>

This final hook implements one of our special *node-type-specific* hooks. Remember: if we had set the content type *base* key to something else, we would have used *that* as the hook prefix, *not* the module name. This hook is called for generating the node form. Drupal does not add a title field by default for content types defined through code, but it does provide a nice helper function to do so. So, we simply call it, and do nothing else.

At this point, you have already defined a custom content type. [Bravo](https://www.youtube.com/watch?v=g_FdDtCB8xw)! Of course, it is not very useful yet. Let's improve it.

## Adding fields

