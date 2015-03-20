---
title: Take your editors' UX to the next level, part 2.
description: Drupal is pretty nice out of the box, but often it can use some tweaking to improve the editors' UX. This is how I tackle this.
layout: post
tags:
 - Drupal
 - Wisdom
 - UX
---

In [part 1](/lore/2015/03/11/take-your-editors-ux-to-the-next-level-part-1/), I discussed how you could greatly improve the experience of your site editors relatively cheaply. However, there's only so much you can achieve with modules. Sometimes, you need to get your hands dirty and code.

## Introducing The projectname_custom Module

Whenever I start a project, I always create a custom module called `projectname_custom`. I do so because I *always* end up tweaking some parts of the system. This module is invariably located inside `sites/(all|site_name)/modules/custom/projectname_custom/`. This is where I will customize Drupal for the project's needs. I'm not talking about custom features or functionality. That will go inside other modules. The `projectname_custom` module is specifically for tweaking existing modules or core. It basically contains a bunch of [hook](https://api.drupal.org/api/drupal/includes!module.inc/group/hooks/7) implementations.

## What To Change

This is hard to summarize, and depends a lot on your project. But, usually, it will contain some [`hook_form_FORM_ID_alter()`](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_form_FORM_ID_alter/7) implementations.

*Side note: over time, many of the following tips have been built into stand-alone modules and are available on Drupal.org. But, as I mentioned in [this post](/lore/2015/02/19/you-should-not-always-use-a-module-for-that/), it's not always a good idea to install modules for everything. Plus, it's serves the purpose of demonstration well.*

For example, let's look at the Node form.

## Simplifying Node Forms

Drupal being a *content management system*, and the king of content being *nodes*, the number 1 area you want to improve the UI and UX is the node form. The following are some simple tips, but the techniques used will show you just how flexible this approach is, and how flexible Drupal is as a system.

### Get rid of the annoying publishing options

The node form will contain a bunch of form fields you might never want to use. For example, under *Publishing options*, you will see checkboxes for *Sticky at top of lists* and *Promoted to front page*. In many projects, these make absolutely no sense. They confuse editors and make you have to answer that annoying question: &ldquo;What is this for?&rdquo;

This is easily solved with a little [`hook_form_BASE_FORM_ID_alter()`](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_form_BASE_FORM_ID_alter/7):

<pre><code class="language-php">
function projectname_custom_form_node_form_alter(&$form, $form_state) {
  $form['options']['promote']['#access'] = FALSE;    
  $form['options']['sticky']['#access'] = FALSE;    
}
</code></pre>

By denying access to these fields, you keep them available in code with their default values, so you do not risk breaking some other modules that might depend on these values being present.

### Disable previews

Another thing is to deactivate the preview. The preview is [considered](https://www.drupal.org/node/1510544) [broken](http://www.inqbation.com/drupal-preview-is-not-working/) [by](https://www.drupal.org/project/pagepreview) [many](http://www.paulbooker.co.uk/drupal-developer/code-snippet/remove-preview-button-node-form) (me included). It's especially useless when using a different theme (administration theme) for editing content. This, again, is easy to solve:

<pre><code class="language-php">
function projectname_custom_form_node_form_alter(&$form, $form_state) {
  unset($form['actions']['preview']);
}
</code></pre>

### More save (and delete) buttons

If you have a particularly long node form, it might be helpful to put some extra save button at the top (unless you use an administration theme that already provides this&thinsp;&mdash;&thinsp;some even make the buttons stick to the top when you scroll down, so you can always reach them):

<pre><code class="language-php">
function projectname_custom_form_node_form_alter(&$form, $form_state) {
  $form['actions_top'] = $form['actions'];
  $form['actions_top']['#weight'] = -1000;
}
</code></pre>

### Only show a field when certain conditions are met

This is a common issue. Some fields might only be relevant if another one is filled, or a checkbox is checked. For instance, when creating a node, Drupal only shows you the form fields for a menu entry if you check the *Provide a menu link* checkbox.

This behavior is pretty easy to replicate, as Drupal's [Form API](https://api.drupal.org/api/drupal/developer!topics!forms_api_reference.html/7) allows us to add these kind of rules. Let's say, for example, that we only wish to show a textarea called *Description* if we check a checkbox called *Show a description*. The machine names are `field_description` and `field_show_description`, respectively, and are only shown on a content type called `post`.

In our [`hook_form_FORM_ID_alter()`](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_form_FORM_ID_alter/7) hook, which in this case is *specifically* for our `post` content type:

<pre><code class="language-php">
function projectname_custom_form_post_node_form_alter(&$form, $form_state) {
  $form['field_description']['#states'] = array(
    'invisible' => array(
      // Because Drupal fields have a language key in their name, we
      // can use the CSS attribute starts-with selector (^="") to
      // get our field. This prevents us from having to specify the
      // language key, like name="field_show_description[und]".
      ':input[name^="field_show_description"]' => array('checked' => FALSE),
    ),
  );
}
</code></pre>

Notice we can also do *the inverse*, meaning make the checkbox label say *Do not show a description* and, when checked, *hide* the description field. In that case, it's as easy as setting the condition to `TRUE`:

<pre><code class="language-php">
function projectname_custom_form_post_node_form_alter(&$form, $form_state) {
  $form['field_description']['#states'] = array(
    'invisible' => array(
      ':input[name^="field_show_description"]' => array('checked' => TRUE),
    ),
  );
}
</code></pre>

Let's take another example. Still inside our `post` content type, we have an optional *Email* textfield (`field_email`) and a *Show email* checkbox (`field_show_email`). We only want to show the checkbox if an email is actually provided in the *Email* textfield:

<pre><code class="language-php">
function projectname_custom_form_post_node_form_alter(&$form, $form_state) {
  $form['field_show_email']['#states'] = array(
    'invisible' => array(
      // Same trick as before, using starts-with attribute selector.
      ':input[name^="field_email"]' => array('empty' => TRUE),
    ),
  );
}
</code></pre>

You can get a full list of all possible flags [here](https://api.drupal.org/api/drupal/includes%21common.inc/function/drupal_process_states/7).

## Module Or Core Customizations

Sometimes you will find yourself using a module that doesn't exactly do what you want. In such cases, [**do not hack it**](/lore/2014/06/26/think-thrice-before-hacking-core-or-contrib/)! In many cases, it will expose hooks, which you can use to tweak the way the module (or Drupal core) behaves. Hooks that change a small aspect of a module are ideal candidates for our `projectname_custom` module.

### Expanding Drupal's permissions

For example, you may find yourself in a situation where Drupal's permission system just doesn't cut it. A typical example is when you give an editor the permission `use the administration pages and help` so she can use the [Admin menu](https://www.drupal.org/project/admin_menu). However, she now has entries in her menu to *Configuration*, *Structure*, etc. When clicking on these, she might only get a blank page. That sucks. The best is to hide them.

There are several options here. You could hook into the menu rendering, but that tends to get nasty and tricky. An approach I use is to provide my own, custom permissions, and change the menu item permissions&thinsp;&mdash;&thinsp;this requires some **good documentation on the project** for any future maintainers (and even for yourself).

For example, if I were to restrict access to `admin/config` for the editors, I define a new permission using [`hook_permission()`](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_permission/7):

<pre><code class="language-php">
function projectname_custom_permission() {
  return array(
    'use the administration pages for configuration' => array(
      'title' => t("Use the administration pages for configuration"),
      'description' => t("Use the administration pages under admin/config"),
    ),
  );
}
</code></pre>

This gives me a new permission. I can give this to administrators, site builders, whoever requires it. Now, with another hook, [`hook_menu_alter()`](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_menu_alter/7), I can change the access argument for `admin/config`:

<pre><code class="language-php">
function projectname_custom_menu_alter(&$items) {
  $items['admin/config']['access arguments'] = array('use the administration pages for configuration');
}
</code></pre>

Now, when I clear the site cache, the editors will no longer see *Configuration* in their admin menu, because they do not have the permission.

**To make it very clear we &ldquo;hacked&rdquo; Drupal's core behavior this way, we need to document it!** I suggest even putting up a little warning message on the permissions page, explaining what you did and why:

<pre><code class="language-php">
function projectname_custom_form_user_admin_permissions_alter() {
  drupal_set_message(t("Caution: projectname_custom defines a few custom permissions that expand on the default 'Use the administration pages and help' permission. The reason is to give editors access to the administration menu, but not showing them empty entries like Configuration. Check projectname_custom_menu_alter() for more information."), 'warning');
}
</code></pre>

*Note: for readability, here's the message:  
&ldquo;Caution: projectname_custom defines a few custom permissions that expand on the default 'Use the administration pages and help' permission. The reason is to give editors access to the administration menu, but not showing them empty entries like Configuration. Check projectname_custom_menu_alter() for more information.&rdquo;*

## Where To Go From Here

I could go on and on, but I'm sure you get the idea. There are many small aspects that you can improve, and&thinsp;&mdash;&thinsp;I can't stress this enough&thinsp;&mdash;&thinsp;your clients will love you for it.

Try to think like a content editor. Try to see what is distracting, what gets in their way. Ask them for suggestions. Tell them the budget may not allow you to implement all of them, but that you really want to make the experience as seamless and enjoyable as possible.

What about you? Do you have any tips for enhancing the editor experience? Put them in the comments.

