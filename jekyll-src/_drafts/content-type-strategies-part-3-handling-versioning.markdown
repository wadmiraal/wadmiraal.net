---
title: "Content Type Strategies: handling versioning"
description: "Maintaining content types and handling versioning can be a challenge and get overwhelming. Here are a few tips to handle updates and changes."
layout: post
tags:
- Wisdom
- Drupal
---

As [we saw before](/lore/2015/04/08/content-type-strategies-part-1-planning/), maintaining content types is an important aspect of any Drupal project. Now that [we know how to define them in code](/lore/2015/05/01/content-type-strategies-part-2-in-code/), let's dive into one of the more serious parts: handling updates and versioning.

I will be using the same example as in [part 2](/lore/2015/05/01/content-type-strategies-part-2-in-code/).

## Scenarios and caveats

There are multiple scenarios we can think of when it comes to changing content types. The easiest is adding a new field, while making sure all our content gets a default value assigned. Another is changing a multi-value field to a single-value field (or a no-limit field to a field with a limit). This one takes some planning, because: *what do we do with the data?* Do we delete the items that are over our new limit? Do we combine them? Do we want to keep a backup in the database, just in case?

Updating all field instances is potentially a heavy task. If your site has a dozen nodes of this content type, you might get away with doing everything in one go. But if you have hundreds or thousands, we need to do this in a batch. Luckily, Drupal provides us with all the tools we need.

## Registering an update

You've probably updated Drupal before. You upload (or whatever) the new code to the server, and navigate to `/update.php`. Drupal will then tell you if there are any updates pending or not. For your module to tell Drupal it requires an update, we simply implement a special hook: [`hook_update_N()`]().

When you first enable a module, Drupal will look for any `hook_update_N()` functions in the `.install`  file, take the highest one and store it as the current &ldquo;schema version&rdquo; (if it doesn't find one, it simply stores null). When a new version of the module is uploaded, and the `/update.php` page visited, Drupal will start looking for a `hook_schema_N()` function with a *higher* value than the one stored. If it finds one (or more), it will tell the site administrator an update is pending. When the site administrator launches the updates, Drupal will call these functions in sequence. At the end, it will store the name of the last one executed.

The naming schema for these `hook_update_N()` functions should be `hook_update_{core}{major version}{update number (2 digits)}()`. Notice that the first 2 digits (core version and your module major version) *are important*. Drupal uses those to trigger the correct updates. The two remaining digits are sequential, and you can simply start at `00`, incrementing with 1 every update, all the way up to `99`.

### Update hooks and a clean install

It is a common misconception that Drupal will run update hooks on a clean install. When you install a module for the first time, even if this module *has* update hooks, Drupal will *not* invoke them. It will simply look for the update hook with the highest value and store *that* as the current &ldquo;schema version&rdquo;. This means, you cannot simply leave old code in your module and think Drupal will update it for you when enabling the module for the first time. In our case, we will need to update our content type definition in our update hooks *and* in the `includes/mymodule.node_types.inc` file.

## Adding a new field

Adding a new field is easy. First, we want to update our content type inside `includes/mymodule.node_types.inc`, so it works on clean installs:

<pre><code class="language-php">
&lt;?php

/**
 * Add fields to our custom content type.
 */
function _mymodule_node_type_insert($content_type) {
  // Other fields logic, see previous post...

  $field = field_info_field('mymodule_new_text');
  if (empty($field)) {
    field_create_field(array(
      'field_name' => 'mymodule_new_text',
      'cardinality' => 1,
      'type' => 'text',
    ));
  }

  $instance = field_info_instance('node', 'mymodule_new_text', 'mymodule_page');
  if (empty($instance)) {
    field_create_instance(array(
      'entity_type' => 'node',
      'bundle' => 'mymodule_page',
      'field_name' => 'mymodule_new_text',
      'label' => "New text",
      'required' => TRUE,
      'default_value' => array(
        array(
          'value' => 'My default value',
        ),
      ),
      'widget' => array(
        'type' => 'text_textfield',
      ),
    ));
  }
}
</code></pre>

Notice the default value, that mimics the data-structure of a field array.

Now, we have 2 issues:

1. This field will not get registered for sites that already have the module enabled. We have to add it in an update hook.
2. Once added, existing content will not get a default value. The default value we set in the instance creation only applies to the form's default value. No data is actually stored for existing content. But we want the default value for all existing content as well.

Let's tackle the first one.

In `mymodule.install`, create our first `hook_update_N()` hook. My module's major version being 1.x, and this being the first update, mine is called `mymodule_update_7101()`:

<pre><code class="language-php">
&lt;?php

/**
 * @file
 * Module install and update logic.
 */

/**
 * Implements hook_update_N().
 *
 * Add a new field mymodule_new_text to content type mymodule_page. Add default
 * value to existing content.
 */
function mymodule_update_7101(&$sandbox) {
  // Load our node type logic.
  module_load_include('inc', 'mymodule', 'includes/mymodule.node_types');

  // Load our content type.
  $content_type = node_type_load('mymodule_page');
  _mymodule_node_type_insert($content_type);

  return t("Added a new field 'mymodule_new_text' to content type 'mymodule_page'.");
}
</code></pre>

See what we did there? We re-used the same function we use when installing our module! We can, because we added a systematic check if a field and/or its instance already exist (read [the previous post](/lore/2015/05/01/content-type-strategies-part-2-in-code/) for more information).

We also *must* return a string with a message for the user. You can also return an empty string if you wish, but you *must* return something.

But this is not enough. We want to add a default value as well. To do this, we will use Drupal's [Batch API](https://api.drupal.org/api/drupal/includes%21form.inc/group/batch/7). We can use the Batch API for updates as well.

In our update hook:

<pre><code class="language-php">
function mymodule_update_7101(&$sandbox) {
  // Prepare the sandbox.
  if (!isset($sandbox['progress'])) {
    // We now run this here, as we only want to execute this once. Otherwise, we
    // will update our field on every batch run, which is unnecessary.
    module_load_include('inc', 'mymodule', 'includes/mymodule.node_types');
    $content_type = node_type_load('mymodule_page');
    _mymodule_node_type_insert($content_type);

    $sandbox['max'] = db_select('node', 'n')
                ->condition('type', 'mymodule_page')
                ->countQuery()
                ->execute()
                ->fetchField();
    $sandbox['progress'] = 0;
    $sandbox['current_nid'] = 0;
  }

  // Let's only update 10 at a time.
  $result = db_select('node', 'n')
    ->fields('n', array('nid'))
    ->condition('nid', $sandbox['current_nid'], '>')
    ->condition('type', 'mymodule_page')
    ->range(0, 10)
    ->execute();

  while ($nid = $result->fetchField()) {
    $node = node_load($nid);

    // Set the field default value.
    $node->mymodule_new_text[LANGUAGE_NONE][0]['value'] = 'My default value';

    // Prepare a new revision and add a log message.
    $node->revision = TRUE;
    $node->log = "Add a default value for the new field 'mymodule_new_text'.";

    // Save the node.
    node_save($node);

    $sandbox['progress']++;
    $sandbox['current_nid'] = $nid;
  }

  $sandbox['#finished'] = empty($sandbox['max']) ? 1 : ($sandbox['progress'] / $sandbox['max']);

  return t("Added a new field 'mymodule_new_text' to content type 'mymodule_page'.");
}
</code></pre>

We first prepare our sandbox. Setting the *#finished* key to something different from 1 will tell Drupal to run this in a batch, and to keep calling our update function until we set it to exactly 1. We prepare a *max* and *progress* key, so we can keep track of our progress. We fetch 10 nodes from the database at a time. We then save all of them, adding our field default value as well as a log message (which explains what happened).

After running this update, all your nodes will have the new field, a new revision, and a nice log message explaining what happened.

## Add a new limit to our image field

Sometimes, we want to have a new limit on a field. This is pretty simple in practice, however we must we ask ourselves: *what do we do with the data that goes over the limit?*

Let's tackle the new limit first. Let's say we go from unlimited to only 5. We first update `includes/mymodule.node_types.inc`, so fresh installs get the correct limit:

<pre><code class="language-php">
/**
 * Add fields to our custom content type.
 */
function _mymodule_node_type_insert($content_type) {
  // Text field logic...

  $field = field_info_field('mymodule_image');
  if (empty($field)) {
    field_create_field(array(
      'field_name' => 'mymodule_image',
      'cardinality' => 5,
      'type' => 'image',
    ));
  }

  // Instantiation, rest of fields...
}
</code></pre>

But, we must now enforce this limit on our existing field. Let's create a new `hook_update_N()` for this. In `mymodule.install`:


<pre><code class="language-php">
/**
 * Implements hook_update_N().
 *
 * Limit the field mymodule_image on the mymodule_page content type to 5.
 */
function mymodule_update_7102(&$sandbox) {
  // Load our field.
  $field = field_info_field('mymodule_image');

  // Update its settings.
  $field['cardinality'] = 5;
  field_update_field($field);

  return t("Updated the limit of the field 'mymodule_image' on content type 'mymodule_page' to 5.");
}
</code></pre>

As opposed to what we did for the new text field and the default value, this applies *immediately*. Meaning, all nodes will now load only 5 images. Even though the old ones still exist...

### Keep a full copy of the previous data and store a revision

When changing the limit of a field, previously saved data is *not* automatically removed. This is on purpose: it's up to you to decide what data to keep or not. If you edit a node and submit it again, it will remove the excess fields. But that might not be what you want. What if you need to fetch one of these excess images? What if you want to have some sort of backup?

One solution is to keep these entries, but store a new revision which only has 5. This will allow you to change the limit back to a higher level later on, and revert to a past revision to get the images back. This solution is pretty easy to implement, and very elegant (IMHO).

<pre><code class="language-php">
function mymodule_update_7102(&$sandbox) {
  // Prepare the sandbox.
  if (!isset($sandbox['progress'])) {
    // Here again, we run the actual field update in here. This is to prevent to
    // run it on every batch run.
    $field = field_info_field('mymodule_image');
    $field['cardinality'] = 5;
    field_update_field($field);

    $sandbox['max'] = db_select('node', 'n')
                ->condition('type', 'mymodule_page')
                ->countQuery()
                ->execute()
                ->fetchField();
    $sandbox['progress'] = 0;
    $sandbox['current_nid'] = 0;
  }

  // Let's only update 10 at a time.
  $result = db_select('node', 'n')
    ->fields('n', array('nid'))
    ->condition('nid', $sandbox['current_nid'], '>')
    ->range(0, 10)
    ->execute();

  while ($nid = $result->fetchField()) {
    $node = node_load($nid);

    // Prepare a new revision and add a log message.
    $node->revision = TRUE;
    $node->log = "Bring the limit of 'mymodule_image' down to 5.";

    // Save the node.
    node_save($node);

    $sandbox['progress']++;
    $sandbox['current_nid'] = $nid;
  }

  $sandbox['#finished'] = empty($sandbox['max']) ? 1 : ($sandbox['progress'] / $sandbox['max']);

  return t("Updated the limit of the field 'mymodule_image' on content type 'mymodule_page' to 5.");
}
</code></pre>

And presto: your nodes now indeed have 5 items, but their past revisions retain the excess items, so nothing is lost.

### Cleanup old data

Another solution is to get rid of the images, as Drupal would, but to get rid of all of them without needing to re-save each node by hand.

We can replace our revision logic from before with a delete statement for the field data:

<pre><code class="language-php">
function mymodule_update_7102(&$sandbox) {
  // Prepare the sandbox...
  // Update the field settings...
  // Fetch 10 nodes.

  while ($nid = $result->fetchField()) {
    // Remove all fields that have a delta higher than 5.
    db_delete('field_data_mymodule_image')
      ->condition('entity_id', $nid)
      ->condition('delta', 4, '>')
      ->execute();

    db_delete('field_revision_mymodule_image')
      ->condition('entity_id', $nid)
      ->condition('delta', 4, '>')
      ->execute();

    $sandbox['progress']++;
    $sandbox['current_nid'] = $nid;
  }

  $sandbox['#finished'] = empty($sandbox['max']) ? 1 : ($sandbox['progress'] / $sandbox['max']);

  return t("Updated the limit of the field 'mymodule_image' on content type 'mymodule_page' to 5.");
}
</code></pre>

Now, we only have our 5 first images, and our DB is clean.

## Wrapping up

This two part tutorial showed you how you can handle your content types' in code, including versioning and updates, without relying on any third-party modules. As you can see, Drupal provides us with all the necessary tools. We have many options available to us and, if used wisely, we can provide a robust and traceable solution for our project, greatly simplifying the deployment of our content type configuration across environments.
