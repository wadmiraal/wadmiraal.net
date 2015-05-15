---
title: "Content Type Strategies: defining content types in code"
description: "Creating and maintaining content types in Drupal can be a challenge and get overwhelming. Here are a few tips to define them using code."
layout: post
tags:
- Wisdom
- Drupal
---

If [creating content types can sometimes be a hassle](/lore/2015/04/08/content-type-strategies-part-1-planning/), maintaining them can be even worse, especially if you create your content types through the UI. Updating fields is tricky, as it will affect existing content. Keeping a history of these changes is virtually impossible. Furthermore, because Drupal keeps content type configuration in the database, it is hard to reproduce in development or staging environments, and usually involves dumping the whole production database and importing it back again on staging or dev.

The good news is, in Drupal 8, thanks to the [Configuration Management Initiative](http://drupal8cmi.org/), we won't have to worry about this as much; configuration will finally be shippable as plain YAML files, which can be imported and versioned in our favorite CVS. The bad news is, many projects will continue to use D7 for probably *at least* another year, as it will take time for contrib to catch up with D8.

So, here's a guide to maintaining content types in code, for Drupal 7.

## A quick note about Features

If you don't know [Features](https://www.drupal.org/project/features), it is a module that allows you to export your Drupal site configuration to a Drupal module. You can then download this module, and simply enable it on another site to activate the exported configuration. It is very powerful, and enables us to maintain our content types in code, while also managing updates and versioning. The only drawback is that the exported module requires Features as a dependency, also on the sites on which you wish to &ldquo;install&rdquo; the configuration.

If you have never tried it out, give it a spin. It's very powerful, and the preferred method for many [Drupal distributions](https://www.drupal.org/project/project_distribution) to ship default configuration out of the box (we used it extensively when I was still on the [Opigno](https://www.drupal.org/project/opigno_lms) team).

However, in this post I will focus on the Drupal-only solution, using the APIs provided by core.

## Getting started

*Tip: you can use [my Docker image](/lore/2015/03/27/use-docker-to-kickstart-your-drupal-development/) to try the following on a clean development environment. I used it extensively while writing this post.*

I prefer having one module per content type, as it keeps things clearer. But you can manage multiple content types in one module.

Create a new module structure. We will mainly need:

* an `.info` file
* a `.module` file
* an `includes/` directory, with a file called `mymodule.node_types.inc` in it

I'll take it you know how to write [an `.info` file](https://www.drupal.org/node/542202). Our module will have multiple dependencies:

* text
* image
* options
* list *(note: even though List depends on Options anyway, the fact we use Options explicitly justifies we list it as a dependency as well)*

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

Fields don't live within the context of a content type. Fields live on their own. They are floating elements that we can attach to content types (called &ldquo;bundles&rdquo; in fields' context).

So, before we can add a field to our content type, we need to create it. And there's a catch: a field with the same name *might already exist*. If you choose a field name that is fairly unique (by prefixing it with your module name), there's still a chance your module was enabled before, disabled for some time, and then re-enabled. When re-enabled, the fields will still exist, so if you try to create it again, your site will break.

Thus, it is *always* a good idea to check if the field already exists. The same goes for field *instances*. An *instance* is a field attached to a particular content type (or, actually, to a particular *bundle* of an *entity*, but that's beyond the scope of this post). If your module got disabled, than re-enabled again, it will try to attach a field to its content type. But disabling the module does not necessarily disable the content type. So, here again, when re-enabling our module, we might trigger errors. So, to prevent that, we check if the instance exists as well.

We will be adding 3 fields.

#### Quick note about fields vs widgets

When creating a field for your content type, you need to do two things: create a *field*, and attach it to the content type using a *widget*.

The *field* on itself is not usable in a form. It is just a data structure definition. Creating a field creates a new set of tables in the database, ready to store and version data.

In order to show the field on a form, you need a *widget*. Some fields can be used with different widgets; more on this below.

### The text field

Let's add a text field to our page, which can have multiple occurrences, but a maximum of 5.

In our `includes/mymodule.node_types.inc` file:

<pre><code class="language-php">
&lt;?php

/**
 * Add fields to our custom content type.
 */
function _mymodule_node_type_insert($content_type) {
  $field = field_info_field('mymodule_text');
  if (empty($field)) {
    field_create_field(array(
      'field_name' => 'mymodule_text',
      'cardinality' => 5,
      'type' => 'text',
    ));
  }

  $instance = field_info_instance('node', 'mymodule_text', 'mymodule_page');
  if (empty($instance)) {
    field_create_instance(array(
      'entity_type' => 'node',
      'bundle' => 'mymodule_page',
      'field_name' => 'mymodule_text',
      'label' => "Some text",
      'required' => TRUE,
      'widget' => array(
        'type' => 'text_textfield',
      ),
    ));
  }
}
</code></pre>

Notice we gave it a type of *text*, which means the field can contain a string of maximum 255 characters, and used an appropriate widget, *text_textfield*. If we wanted a longer text, we could have used a type of *text_long* and the *text_textarea* widget. Drupal provides many other field types, like *file*, *image*, *number_integer*, *number_float*, etc. There are plenty of widget types as well: *list_text* (select list), *options_buttons* (radio buttons or checkboxes), etc.

Also notice we do *not* use [`t()`](https://api.drupal.org/api/drupal/includes%21bootstrap.inc/function/t/7) on the field label. The reason is, the labels will be in the language of the session during which the module was enabled. Meaning, if you enable this module while seeing the interface in French, the fields will get French labels. But these labels will be in French *for all* languages. This would make it untranslatable in many cases. Instead, we give it the English value, and can rely on the [Internationalization module](https://www.drupal.org/project/i18n) for translation.

If you are puzzled by this, you are allowed to be: multilingual support in Drupal up to version 7 is very bad. Drupal 8 will address this issue fully, thanks to the [Multilingual Initiative](http://www.drupal8multilingual.org/).

### The image field

Let's add another field, an image that can have an unlimited number of items. Still in our `includes/mymodule.node_types.inc` file:

<pre><code class="language-php">
&lt;?php

/**
 * Add fields to our custom content type.
 */
function _mymodule_node_type_insert($content_type) {
  // Text field logic...

  $field = field_info_field('mymodule_image');
  if (empty($field)) {
    field_create_field(array(
      'field_name' => 'mymodule_image',
      'cardinality' => -1,
      'type' => 'image',
    ));
  }

  $instance = field_info_instance('node', 'mymodule_image', 'mymodule_page');
  if (empty($instance)) {
    field_create_instance(array(
      'entity_type' => 'node',
      'bundle' => 'mymodule_page',
      'field_name' => 'mymodule_image',
      'label' => "Some image",
      'required' => FALSE,
      'widget' => array(
        'type' => 'image_image',
      ),
    ));
  }
}
</code></pre>

Notice the *cardinality* that was set to `-1`. This means *no limit*, so the users can add as many items for that field as necessary.

We use mostly the defaults for our fields. But, every setting that can be set through the UI, can also be set here. For example, we might want to limit the images to only JPG:

<pre><code class="language-php">
  $instance = field_info_instance('node', 'mymodule_image', 'mymodule_page');
  if (empty($instance)) {
    field_create_instance(array(
      'entity_type' => 'node',
      'bundle' => 'mymodule_page',
      'field_name' => 'mymodule_image',
      'label' => "Some image",
      'required' => FALSE,
      'widget' => array(
        'type' => 'image_image',
      ),
      'settings' => array(
        'file_extensions' => 'jpg jpeg',
      ),
    ));
  }
</code></pre>

In this particular case, the file extensions are an *instance* setting, so we must set it on the instance creation. Some settings, however, are *global*; these are set in the same manner (using a `settings` key), but when creating the field itself (example below).

[Here](https://api.drupal.org/api/drupal/modules%21field%21field.api.php/function/implementations/hook_field_info/7) you can see a full list of core modules that implement [`hook_field_info()`](https://api.drupal.org/api/drupal/modules%21field%21field.api.php/function/hook_field_info/7). By looking at what each of the modules return for field types, as well as settings for each of these types, you can figure out how to define your settings when creating fields and instances. And [here](https://api.drupal.org/api/drupal/modules%21field%21field.api.php/function/implementations/hook_field_widget_info/7) you can see a full list of core modules that implement [`hook_field_widget_info()`](https://api.drupal.org/api/drupal/modules%21field%21field.api.php/function/hook_field_widget_info/7). By looking at these, you will be able to determine what widget to use for your fields.

### The radio buttons

Let's add one final field, a list of radio buttons. This field will be a little bit special, as the options will not be defined when creating the field, but generated dynamically. Still in our `includes/mymodule.node_types.inc` file:

<pre><code class="language-php">
&lt;?php

/**
 * Add fields to our custom content type.
 */
function _mymodule_node_type_insert($content_type) {
  // Text field logic...

  // Image field logic...

  $field = field_info_field('mymodule_options');
  if (empty($field)) {
    field_create_field(array(
      'field_name' => 'mymodule_options',
      'cardinality' => 1,
      'type' => 'list_text',
      'settings' => array(
        'allowed_values_function' => 'mymodule_field_options',
      ),
    ));
  }

  $instance = field_info_instance('node', 'mymodule_options', 'mymodule_page');
  if (empty($instance)) {
    field_create_instance(array(
      'entity_type' => 'node',
      'bundle' => 'mymodule_page',
      'field_name' => 'mymodule_options',
      'label' => "Some options",
      'required' => TRUE,
      'widget' => array(
        'type' => 'options_buttons',
      ),
    ));
  }
}
</code></pre>

You notice we use the *list_text* field type, which means each entry will be stored as text. We use the *options_buttons* widget, which will render a list of checkboxes if the cardinality is different from 1, and as radio buttons if the cardinality is exactly 1.

Now, when you go to the `node/add/mymodule-page` URL, you will get an error. That's because we must define the function that generates the radio button values, `mymodule_field_options`. Inside `mymodule.module`, add the following:

<pre><code class="language-php">
/**
 * Return a list of possible values for our node field.
 *
 * @return array
 *    A list if values.
 */
function mymodule_field_options() {
  return array(
    'option_1' => t("Option 1"),
    'option_2' => t("Option 2"),
  );
}
</code></pre>

This is just a hard-coded list, but you could get values from a database, from a custom hook implementation, etc.

Of course, you could use a pre-defined, hard-coded list of values. You would do so like this:

<pre><code class="language-php">
  $field = field_info_field('mymodule_options');
  if (empty($field)) {
    field_create_field(array(
      'field_name' => 'mymodule_options',
      'cardinality' => 1,
      'type' => 'list_text',
      'settings' => array(
        'allowed_values' => array(
          'option_1' => "Option 1",
          'option_2' => "Option 2",
        ),
      ),
    ));
  }
</code></pre>

Notice that, here again, we do *not* use [`t()`](https://api.drupal.org/api/drupal/includes%21bootstrap.inc/function/t/7) on the options, for the same reason as mentioned before.

## Conclusion

As you can see, it is fairly straightforward to define your content types in code. It usually takes some time to figure out how to get the settings right, especially for non-Core field types (like Entityreference). However, the code is fairly minimal, and easy to read (it's pretty self-documenting when you think about it).

Now, this is just the tip of the iceberg. The real challenge is handling *updates*; when the content type *changes*. I will discuss that in my next post.

### Final word about Features

Features would make all the above easier, by allowing you to create the content type through the UI and simply export a module. But, Features is mainly a tool for site-builders. I, as a developer, prefer installing as little modules on my sites as possible. And, although Features certainly doesn't add a large overhead, I still find it annoying to have it initialize itself on each page load, although I only needed it once to actually import my content type.

But maybe that's just me...

