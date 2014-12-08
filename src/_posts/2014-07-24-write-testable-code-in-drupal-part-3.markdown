---
title: "Write Testable Code In Drupal - Part 3, Practical Examples"
description: "Writing unit tests in Drupal is slow and complex, which means many projects stay away from unit tests. This is the third part in a series to write better, more testable code."
layout: post
favorite: false
tags:
  - Wisdom
  - Code
  - Drupal
---

In [part 2](/lore/2014/07/23/write-testable-code-in-drupal-part-2/), I discussed how to apply function purity to Drupal code to speed up our unit tests. In part 3, I want to explore some more, real-world examples, namely using database results and exposing your own hooks.

## Defining And Testing Your Own Hooks

I'm going to use a simple module I made some time ago, called [Guide Me](https://www.drupal.org/project/guideme), as an example. It provides an API for modules to provide a step-by-step guide, or &ldquo;learning path&rdquo;, to its usage (using the [Joyride](http://zurb.com/playground/jquery-joyride-feature-tour-plugin) JS library).

*(Note: I don't maintain this module anymore, but it makes for a good example)*

### What's With The Hooks ?

Your own hooks will usually be of 2 kinds:

1. An *information* hook, which allows other modules to let your module know about certain functionality.
2. An *alter* hook, which allows other modules to have a say in what happens to data you're processing.

The second one can be tricky to test depending on when or where you allow other modules to alter data. If you use it in a similar fashion to the `hook_menu`/``hook_menu_alter` hooks, testing is pretty easy. If you allow other modules to have a say in the middle of a complex function (like `hook_node_load`), you're in trouble.

The Guide Me module provides a single hook, called `hook_guideme_path` ([doc here](http://cgit.drupalcode.org/guideme/tree/guideme.api.php?h=7.x-1.x)).

This hook allows modules to provide their own &ldquo;learning paths&rdquo;. The way it works is modules define &ldquo;paths&rdquo;, or tutorials if you will. A path is composed of several &ldquo;steps&rdquo;. Each step is an internal Drupal path (like `node/add`). When a user visits a page, Guide Me will check if it is part of a path. If so, it starts guiding the user.

Guide Me calls all `hook_guideme_path` implementations, and then calls `drupal_alter()` to allow other modules to alter the data. So we're in the easy-case scenario, and can apply what we learned about function purity in part 2.

These 2 hook calls *don't need testing*. We are using the Drupal API; we can safely assume it will work (if it does not, what are you going to do about it ? Drupal would be at fault, not your module).

What *does* need testing, however, is parsing this data and starting the correct &ldquo;learning path&rdquo; on page load.

### Testing The Relevant Parts

On page load (`hook_init`), there's a function called `guideme_get_map()` that returns a processed list of module-defined paths for easy processing and searching. Guide Me uses the result of this to see if we need to start a path.

Behind the scenes, this `guideme_get_map()` function calls 2 other functions, one *impure* and one *pure*:

<pre><code class="language-php">
/**
 * Simplified a little for our example.
 */
function guideme_get_map() {
    $guide_paths = guideme_get_guide_paths();
    return guideme_map_guide_paths($guide_paths);
}

</code></pre>

The first, `guideme_get_guide_paths()`, is impure as it calls `module_invoke_all()` and `drupal_alter()`. However, notice we could very easily have called this directly in `guideme_map_guide_paths()`. Instead, we call it *outside*, and pass the result as a parameter.

`guideme_map_guide_paths()` is *pure* - it is simply a processing function. It does the heavy lifting, and does not depend on any outside API.

The Guide Me unit tests contain several test cases specifically for `guideme_map_guide_paths()`. They are super-fast to run, and as long as they succeed, we can safely assume `guideme_get_map()` will work as well. FTW !

The next step is determining if the currently active page is part of a &ldquo;learning path&rdquo;. We thus need to check if any module-defined paths need to be triggered by the current URL. This is done by `guidemap_fetch_appropriate_guide_path()`, as follows:

<pre><code class="language-php">
$map = guideme_get_map();
$url = drupal_is_front_page() ? '<front>' : current_path();
list($id, $step_url) = guidemap_fetch_appropriate_guide_path($map, $url);

</code></pre>

Notice we *do not call* `current_path()` or `drupal_is_front_page()` directly from `guidemap_fetch_appropriate_guide_path()`, nor do we call our previous function `guideme_get_map()`. We could, and it would make the call a little easier to read. But it would make it *impure*. Yet, by passing this system-state information as parameters, our function remains pure.

Here again, the Guide Me unit tests contain several tests for `guidemap_fetch_appropriate_guide_path()`. If they pass, we can safely assume our `hook_init` implementation is correct. And, as a result, we can safely assume our hooks work (as long as the implementing module implements it correctly). FTW !

### Gotchas

Of course, for 100% test coverage, we would need to write a Drupal Web Test Case; there's no way around it. But our unit tests already cover +75% of our module's complexity. Which is a very decent amount, compared to 0%, as is the case for *many* modules.

Furthermore, we're in a pretty easy scenario. Testing the Node module this way, for instance, would be very hard and probably impractical.

For more information, you can see the source code of the entire Guide Me module [here](http://cgit.drupalcode.org/guideme/tree/guideme.module?h=7.x-1.x).

## Using Database Results

You probably already see where I am going with this. The whole, grand idea is to separate *impurity* from &ldquo;potential&rdquo; *purity*, thus making functions *pure*.

By passing results from *impure* functions as parameters to *pure* functions, we not only allow ourselves to test more easily, we also make providing test data much easier.

A great example of this is database results.

Testing computation done with data from a database (as is **very** often the case with Drupal) can be tricky. You need a database running during the test (which is, as we saw in part 1, the main reason Drupal tests are slow) and you need to insert test data in the database, so your function can retrieve it and you can assert the results.

However, it would be **much** easier if your processing function simply received an object representing the database data as a parameter (like an associative array).

## An Example: Using The Node API

One of the most typical examples would be implementing the Node API, say `hook_node_load`. On loading a node, your module must attach some extra data to the object.

A real world example, from the Comment module:

<pre><code class="language-php">
/**
 * Implements hook_node_load().
 */
function comment_node_load($nodes, $types) {
  $comments_enabled = array();

  // Check if comments are enabled for each node. If comments are disabled,
  // assign values without hitting the database.
  foreach ($nodes as $node) {
    // Store whether comments are enabled for this node.
    if ($node->comment != COMMENT_NODE_HIDDEN) {
      $comments_enabled[] = $node->nid;
    }
    else {
      $node->cid = 0;
      $node->last_comment_timestamp = $node->created;
      $node->last_comment_name = '';
      $node->last_comment_uid = $node->uid;
      $node->comment_count = 0;
    }
  }

  // For nodes with comments enabled, fetch information from the database.
  if (!empty($comments_enabled)) {
    $result = db_query('SELECT nid, cid, last_comment_timestamp, last_comment_name, last_comment_uid, comment_count FROM {node_comment_statistics} WHERE nid IN (:comments_enabled)', array(':comments_enabled' => $comments_enabled));
    foreach ($result as $record) {
      $nodes[$record->nid]->cid = $record->cid;
      $nodes[$record->nid]->last_comment_timestamp = $record->last_comment_timestamp;
      $nodes[$record->nid]->last_comment_name = $record->last_comment_name;
      $nodes[$record->nid]->last_comment_uid = $record->last_comment_uid;
      $nodes[$record->nid]->comment_count = $record->comment_count;
    }
  }
}

</code></pre>

There are 3 major parts here that are worth testing.

1. We check if the node has comments enabled. If not, we set some default comment-related information to the node.
2. We query the database for statistics about the node comments.
3. We use these statistics to set some comment-related information to our node objects.

Can you spot which parts we can turn *pure* ?

At least the first:

<pre><code class="language-php">
/**
 * Implements hook_node_load().
 */
function comment_node_load($nodes, $types) {
  $comments_enabled = _comment_check_enabled_nodes($nodes);

  // For nodes with comments enabled, fetch information from the database.
  if (!empty($comments_enabled)) {
    $result = db_query('SELECT nid, cid, last_comment_timestamp, last_comment_name, last_comment_uid, comment_count FROM {node_comment_statistics} WHERE nid IN (:comments_enabled)', array(':comments_enabled' => $comments_enabled));
    foreach ($result as $record) {
      $nodes[$record->nid]->cid = $record->cid;
      $nodes[$record->nid]->last_comment_timestamp = $record->last_comment_timestamp;
      $nodes[$record->nid]->last_comment_name = $record->last_comment_name;
      $nodes[$record->nid]->last_comment_uid = $record->last_comment_uid;
      $nodes[$record->nid]->comment_count = $record->comment_count;
    }
  }
}

/**
 * Check if comments are enabled for each node. If comments are disabled,
 * assign values without hitting the database.
 */
function _comment_check_enabled_nodes($nodes) {
  $comments_enabled = array();

  foreach ($nodes as $node) {
    // Store whether comments are enabled for this node.
    if ($node->comment != COMMENT_NODE_HIDDEN) {
      $comments_enabled[] = $node->nid;
    }
    else {
      $node->cid = 0;
      $node->last_comment_timestamp = $node->created;
      $node->last_comment_name = '';
      $node->last_comment_uid = $node->uid;
      $node->comment_count = 0;
    }
  }

  return $comments_enabled;
}

</code></pre>

By taking it out of the main function body, we now have one *pure* function. We can test this one very easily, and don't require a Web Test Case for it.

For the second point, the database query, there's no way around it: we have to write a Drupal Web Test case. Tough luck.

However, the third one is the same principle:

<pre><code class="language-php">
/**
 * Implements hook_node_load().
 */
function comment_node_load($nodes, $types) {
  $comments_enabled = _comment_check_enabled_nodes($nodes);

  // For nodes with comments enabled, fetch information from the database.
  if (!empty($comments_enabled)) {
    $result = db_query('SELECT nid, cid, last_comment_timestamp, last_comment_name, last_comment_uid, comment_count FROM {node_comment_statistics} WHERE nid IN (:comments_enabled)', array(':comments_enabled' => $comments_enabled));
    
    foreach ($result as $record) {
      $nodes[$record->nid] = _comment_set_node_information($nodes[$record->nid], $record);
    }
  }
}

/**
 * Set information from the database to the node.
 */
function _comment_set_node_information($node, $record) {
  $node->cid = $record->cid;
  $node->last_comment_timestamp = $record->last_comment_timestamp;
  $node->last_comment_name = $record->last_comment_name;
  $node->last_comment_uid = $record->last_comment_uid;
  $node->comment_count = $record->comment_count;

  return $node;
}

</code></pre>

This might all seem silly at first glance, but it does make sense; we ideally want to test the whole process, but even part of it is better than none.

Note that **Drupal core does not test this hook implementation**. The Drupal core team probably thinks it is not worth the effort and/or time to test such a simple function, knowing that the process of just writing the test and running it several times can take *hours*. However, with the above way, we can test 2/3 of the hook implementation, greatly reducing the required time.

## It's All About Shrewed Planning And A Watchful Eye

Drupal code - nay, PHP code in general - tends to have heavy dependencies on other functions. This is OK in many cases, but if it prevents you from writing testable code, it's really worth it to plan ahead and try to split complexity in smaller chunks.

This takes practice and planning. But, given enough time, it will become second nature to you. And you'll be a better developer (at least, PHP developer) for it.
