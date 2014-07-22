---
title: "Write Testable Code In Drupal - Part 1, What Is Wrong With Drupal Tests"
description: "Writing unit tests in Drupal is slow and complex, which means many projects stay away from unit tests. This is the first part in a series to write better, more testable code."
layout: post
favorite: false
tags:
  - Wisdom
  - Code
  - Drupal
  - TDD
---

Writing unit tests in Drupal is slow and costly, which means many projects stay away from them. This has been a problem for many years, but I have found a way to greatly speed up my Drupal development, even going as far as using <abbr title="Test Driven Development">TDD</abbr>.

This is the first part in a series to write better, more testable code.

## The Problem

If you have ever tried to use a TDD approach when writing a Drupal module, you have probably [felt the sadness and frustration](http://media3.giphy.com/media/Txh1UzI7d0aqs/giphy.gif) that comes from running tests that take minutes, or even hours, to run.

TDD is completely impractical with traditional Drupal development. The reason is two fold:

1. We often don't develop something new from scratch, but use the (very powerful) [hook](https://www.drupal.org/node/292) system to adapt the system and extend it (as we should).
2. Drupal is **heavily** dependent on the database.

Drupal needs access to the database for **everything** &mdash; it keeps extensive registries for Classes, callbacks, hook implementations, the theme layer and more.

So, for us to use the Drupal API, we must have an entire, bootable system that has access to this database. And this is where the trouble starts.

## How Slow Are Tests In Drupal

This will make you cry in shock.

Take this very simple test class:

````
class MySuperTestCase extends DrupalWebTestCase {

  public static function getInfo() {
    return array(
      'name' => 'Test some stuff',
      'description' => "We test and test till we drop, y'all",
      'group' => 'My Module',
    );
  }

  function setUp() {
    parent::setUp(array('my_module'));
  }

  public function testNodeHooks() {
    // Create a node.
    $this->drupalCreateNode(array(
      'type' => 'page',
    ));

    // Load it fully.
    $node = node_load(1);

    // Test our module's hook implementation is correctly adding a property
    // to the node.
    $this->assertNotNull($node->custom_property, "custom_property is set.");
  }

  public function testTaxonomyTermHooks() {
    // Create a Taxonomy term through the interface.
    $user = $this->drupalCreateUser(array(
      'administer taxonomy',
    ));
    $this->drupalLogin($user);

    // First create a vocabulary.
    $edit = array(
      'name' => $this->randomName(),
      'machine_name' => 'tags',
      'description' => $this->randomName(),
    );
    $this->drupalPost('admin/structure/taxonomy/add', $edit, t('Save'));

    // Now create a term.
    $edit = array(
      'name' => $this->randomName(),
      'description[value]' => $this->randomName(),
    );
    $this->drupalPost('admin/structure/taxonomy/tags/add', $edit, t('Save'));

    $term = taxonomy_term_load(1);

    // Test our module's hook implementation is correctly adding a property
    // to the term.
    $this->assertNotNull($term->custom_property, "custom_property is set.");    
  }

}
````

It tests if our custom module correctly adds a `custom_property` property on the loaded node or term entity. These hooks are implemented like this:

````
/**
 * Implements hook_node_load().
 */
function my_module_node_load($nodes) {
  foreach ($nodes as $node) {
    $node->custom_property = TRUE;
  }
}

/**
 * Implements hook_taxonomy_term_load().
 */
function my_module_taxonomy_term_load($terms) {
  foreach ($terms as $term) {
    $term->custom_property = TRUE;
  }
}
````

Even though this code is stupidly simple, running the above test takes 1min 23sec my machine.

Running the **entire Symfony test suite** takes **5min 20sec** on the same machine. According to [Openhub](http://www.openhub.net/p/symfony/analyses/latest/languages_summary), Symfony represents 843'007 lines of actual code (1'424'348 total). As this includes unit tests, we can probably cut this number in two, leaving us with roughly 420'000 lines of code.

Our module is just 10 lines.

That's 0.002% of the lines of code from Symfony, yet running the tests takes 24.5% of the time. This means that testing one line of code in Drupal takes approximately **10'000x** more time than testing one line in Symfony.

## Why Is This So Slow

If you've ever installed Drupal, you know it takes time. It takes you through some configuration forms, uses a batch to install the core module, asks for some final settings (site name, admin account credentials, etc) and then, *finally*, allows you to use it.

When running a *DrupalWebTestCase* (which, in the vast majority cases, is what you do when writing Drupal tests), the Testing framework will install a fresh, virtual Drupal copy for you. *For each test*.

A *test* is not just the class. *Each test method* (2 in our example) will trigger a full rebuild of a virtual Drupal instance. It's like setting up a new Drupal install by hand, going through the motions and batches, for every test method.

**We don't have a choice**: we cannot use the Drupal hook system without it. And almost *everything* in Drupal is done through hooks.

## Faster Tests

We can, of course, use *DrupalUnitTestCases*, which *do not* set up a Drupal environment. The problem with these, is that the hook system is unusable, as well as the theme layer, the form API and more. Because we usually heavily depend on the Drupal framework, writing *DrupalUnitTestCases* is often impractical, as much of our module will just stop working without it.

Or is it ?

### Past Solutions But Why I Don't Use Them

There have been [many](https://www.drupal.org/node/466972) [tips](http://www.jacobsingh.name/content/test-driven-development-drupal-possible) in the past on how to tweak your system to speed up tests.

However, these solutions tackle the problem from the wrong angle. Some try fixing the system by running the database in memory, tweaking the system architecture to squeeze out more performance, etc. This is complex and hard to reproduce across different development machines. Others try to &ldquo;cheat&rdquo; by using &ldquo;dirty&rdquo; test environments: instead of setting up a new Drupal install for each test, they use the same one across tests. This is much faster, but error-prone: you could very well be chasing bugs in failing tests that simply would not occur in a clean environment.

### Another Way

I've been using another way for some time now, which focuses on writing highly modular and specialized code and functions. I have even used [PHPUnit](http://phpunit.de) for some of these modules, instead of Drupal's in-house Testing framework (previously called Simpletest). This allows me to run my tests in a [Git pre-commit hook](/lore/2014/07/14/how-git-hooks-made-me-a-better-and-more-lovable-developer/), even though there's no Drupal environment set up (which is still required for running *DrupalUnitTestCases*).

In the next part, I'll discuss the theory behind this. It all begins with me learning Haskell.
