---
title: Take your editor's UX to the next level, part 2.
description: Drupal is pretty nice out of the box, but often it can use some tweaking to improve the editors' UX. This is how I tackle this.
layout: post
tags:
 - Drupal
 - Wisdom
 - UX
---

In [part 1](/lore/2015/03/11/take-your-editors-ux-to-the-next-level-part-1/), I discussed how you could greatly improve the experience of your site editors relatively cheaply. However, there's only so much you can achieve with modules. Sometimes, you need to get your hands dirty and code.

## Introducing The projectname_custom Module

Whenever I start a project, I always create a custom module called `projectname_custom`. This module is invariably located inside `sites/all/modules/custom/projectname_custom/`. This is where I will customize Drupal for the project's needs. I'm not talking about custom features or functionality. That will go inside other modules. The `projectname_custom` module is specifically for tweaking existing modules or core. It basically contains a bunch of [hook]() implementations.

## What To Change

This is hard to summarize, and depends a lot on your project. But, usually, it will contain some [`hook_form_FORM_ID_alter`]() implementations.

*Side note: over time, many of the following tips have been built into stand-alone modules and are available on Drupal.org. But, as I mentioned in [this post](/lore/2015/02/19/you-should-not-always-use-a-module-for-that/), it's not always a good idea to install modules for everything. Plus, it's serves the purpose of demonstration well.*

For example, let's look at the Node form.

### Node forms

The node form will contain a bunch of form fields you might never want to use. For example, under *Publishing options*, you will see checkboxes for *Make sticky* and *Promote to front page*. In *many* projects, these make absolutely no sense. They confuse editors and make you have to answer that annoying question: *&ldquo;What is this for?&rdquo;*

This is easily solved with a little form alter:

<pre><code class="language-php">
function projectname_custom_form_node_form_alter(&$form, $form_state) {
  $form['status']['promote']['#access'] = FALSE;    
  $form['status']['sticky']['#access'] = FALSE;    
}

</code></pre>

By denying access to these fields, you keep them available in code with their default values, so you do not risk breaking some other modules that might depend on these values being present.

Another thing is to deactivate the preview. The preview is considered broken [by many]() (me included). It's especially useless when using a different theme (administration theme) for editing content. This, again, is easy to solve:

<pre><code class="language-php">
function projectname_custom_form_node_form_alter(&$form, $form_state) {
  unset($form['buttons']['preview']);
}

</code></pre>

If you have a particularly long node form, it might be helpful to put some extra save button at the top (unless you use a administration theme that already provides this&thinsp;&mdash;&thinsp;some even make the buttons stick to the top when you scroll down, so you can always reach them):

<pre><code class="language-php">
function projectname_custom_form_node_form_alter(&$form, $form_state) {
  $form['buttons_top'] = $form['buttons'];
  $form['buttons_top']['#weight'] = -1000;
}

</code></pre>

### Module customizations

If you find yourself using a module that doesn't exactly do what you want, **do not hack it!** [See if it exposes hooks](/lore/2014/06/26/think-thrice-before-hacking-core-or-contrib/). Small hooks that tweak a small aspect of a module are ideal candidates for our `projectname_custom` module.
